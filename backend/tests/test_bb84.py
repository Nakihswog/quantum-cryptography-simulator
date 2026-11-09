
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

# Make the backend folder importable from the project root.
BACKEND_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_DIR))

from bb84 import run_bb84_simulation


class TestBB84EdgeCases(unittest.TestCase):

    def test_no_matching_bases(self):
        controlled_bases = ["+"] * 10 + ["x"] * 10

        with patch(
            "bb84.random.choice",
            side_effect=controlled_bases
        ):
            result = run_bb84_simulation(
                mode="secure",
                attack_intensity=0,
                channel_noise=0
            )

        self.assertEqual(result["total_checked"], 0)
        self.assertEqual(result["shared_key"], [])
        self.assertFalse(result["key_generated"])
        self.assertEqual(
            result["key_generation_status"],
            "failed_no_matching_bases"
        )
        self.assertEqual(result["qber"], 0.0)
        self.assertEqual(
            result["security_status"],
            "INCONCLUSIVE: No matching bases"
        )

    def test_secure_mode_generates_key_when_bases_match(self):
        controlled_bases = ["+"] * 20

        with patch(
            "bb84.random.choice",
            side_effect=controlled_bases
        ):
            result = run_bb84_simulation(
                mode="secure",
                attack_intensity=0,
                channel_noise=0
            )

        self.assertEqual(result["total_checked"], 10)
        self.assertEqual(result["errors"], 0)
        self.assertEqual(result["qber"], 0.0)
        self.assertTrue(result["key_generated"])
        self.assertEqual(
            result["key_generation_status"],
            "generated"
        )
        self.assertEqual(len(result["shared_key"]), 10)

    def test_high_qber_rejects_key(self):
        controlled_bases = ["+"] * 20

        with patch(
            "bb84.random.choice",
            side_effect=controlled_bases
        ), patch(
            "bb84.random.randint",
            return_value=0
        ):
            result = run_bb84_simulation(
                mode="secure",
                attack_intensity=0,
                channel_noise=100
            )

        self.assertEqual(result["total_checked"], 10)
        self.assertEqual(result["errors"], 10)
        self.assertEqual(result["qber"], 100.0)
        self.assertFalse(result["key_generated"])
        self.assertEqual(
            result["key_generation_status"],
            "failed_high_qber"
        )
        self.assertEqual(result["shared_key"], [])

    def test_full_eavesdropping_is_reported(self):
        controlled_bases = ["+"] * 30

        with patch(
            "bb84.random.choice",
            side_effect=controlled_bases
        ), patch(
            "bb84.random.random",
            return_value=0.0
        ):
            result = run_bb84_simulation(
                mode="attack",
                attack_intensity=100,
                channel_noise=0
            )

        self.assertEqual(result["intercepted_count"], 10)
        self.assertTrue(result["rolex_present"])
        self.assertEqual(result["total_checked"], 10)
        self.assertEqual(result["errors"], 0)
        self.assertEqual(result["qber"], 0.0)
        self.assertTrue(result["key_generated"])
        self.assertEqual(
            result["key_generation_status"],
            "generated"
        )

    def test_wrong_basis_eavesdropping_causes_errors(self):
        controlled_bases = ["+"] * 10 + ["x"] * 10 + ["+"] * 10
        controlled_bits = [0] * 10 + [1] * 20

        with patch(
            "bb84.random.choice",
            side_effect=controlled_bases
        ), patch(
            "bb84.random.random",
            return_value=0.0
        ), patch(
            "bb84.random.randint",
            side_effect=controlled_bits
        ):
            result = run_bb84_simulation(
                mode="attack",
                attack_intensity=100,
                channel_noise=0
            )

        self.assertEqual(result["intercepted_count"], 10)
        self.assertEqual(result["total_checked"], 10)
        self.assertEqual(result["errors"], 10)
        self.assertEqual(result["qber"], 100.0)
        self.assertFalse(result["key_generated"])
        self.assertEqual(
            result["key_generation_status"],
            "failed_high_qber"
        )
        self.assertEqual(result["shared_key"], [])

    def test_intermediate_eavesdropping_intensity(self):
        controlled_bases = ["+"] * 30
        controlled_random_values = (
            [0.0] * 5 + [0.9] * 5 + [0.9] * 10
        )

        with patch(
            "bb84.random.choice",
            side_effect=controlled_bases
        ), patch(
            "bb84.random.random",
            side_effect=controlled_random_values
        ):
            result = run_bb84_simulation(
                mode="attack",
                attack_intensity=50,
                channel_noise=0
            )

        self.assertEqual(result["intercepted_count"], 5)
        self.assertTrue(result["rolex_present"])
        self.assertEqual(result["total_checked"], 10)
        self.assertEqual(result["qber"], 0.0)

    def test_invalid_mode_defaults_to_secure(self):
        controlled_bases = ["+"] * 20

        with patch(
            "bb84.random.choice",
            side_effect=controlled_bases
        ):
            result = run_bb84_simulation(
                mode="invalid",
                attack_intensity=100,
                channel_noise=0
            )

        self.assertEqual(result["mode"], "secure")
        self.assertEqual(result["attack_intensity"], 0.0)
        self.assertEqual(result["intercepted_count"], 0)
        self.assertFalse(result["rolex_present"])
        self.assertEqual(result["total_checked"], 10)
        self.assertEqual(result["errors"], 0)
        self.assertEqual(result["qber"], 0.0)
        self.assertTrue(result["key_generated"])
        self.assertEqual(
            result["key_generation_status"],
            "generated"
        )

    def test_attack_intensity_boundary_values(self):
        test_cases = [
            (0, 0),
            (100, 10),
            (-20, 0),
            (150, 10),
        ]

        for intensity, expected_interceptions in test_cases:
            with self.subTest(intensity=intensity):
                controlled_bases = ["+"] * 30

                if intensity <= 0:
                    random_values = [0.9] * 20
                else:
                    random_values = [0.0] * 10 + [0.9] * 10

                with patch(
                    "bb84.random.choice",
                    side_effect=controlled_bases
                ), patch(
                    "bb84.random.random",
                    side_effect=random_values
                ):
                    result = run_bb84_simulation(
                        mode="attack",
                        attack_intensity=intensity,
                        channel_noise=0
                    )

                self.assertEqual(
                    result["attack_intensity"],
                    max(0.0, min(100.0, float(intensity)))
                )
                self.assertEqual(
                    result["intercepted_count"],
                    expected_interceptions
                )

    def test_channel_noise_boundary_values(self):
        test_cases = [
            (0, 0),
            (100, 10),
            (-20, 0),
            (150, 10),
        ]

        for noise, expected_flips in test_cases:
            with self.subTest(channel_noise=noise):
                controlled_bases = ["+"] * 20

                with patch(
                    "bb84.random.choice",
                    side_effect=controlled_bases
                ), patch(
                    "bb84.random.randint",
                    return_value=0
                ), patch(
                    "bb84.random.random",
                    side_effect=[0.5] * 10 + [0.0] * 10
                ):
                    result = run_bb84_simulation(
                        mode="secure",
                        attack_intensity=0,
                        channel_noise=noise
                    )

                self.assertEqual(
                    result["channel_noise"],
                    max(0.0, min(100.0, float(noise)))
                )
                self.assertEqual(
                    result["channel_noise_count"],
                    expected_flips
                )

    def test_simulation_result_consistency(self):
        # Use matching bases, controlled bits, and no channel noise.
        controlled_bases = ["+"] * 20
        controlled_bits = [0] * 10

        with patch(
            "bb84.random.choice",
            side_effect=controlled_bases
        ), patch(
            "bb84.random.randint",
            side_effect=controlled_bits
        ), patch(
            "bb84.random.random",
            return_value=0.9
        ):
            result = run_bb84_simulation(
                mode="attack",
                attack_intensity=50,
                channel_noise=0
            )

        # Interception count must match the interception flags.
        self.assertEqual(
            result["intercepted_count"],
            sum(result["interception_flags"])
        )
        self.assertEqual(
            result["rolex_present"],
            result["intercepted_count"] > 0
        )

        # Noise count must match the channel noise flags.
        self.assertEqual(
            result["channel_noise_count"],
            sum(result["channel_noise_flags"])
        )

        # QBER must agree with errors and checked positions.
        if result["total_checked"] > 0:
            expected_qber = round(
                result["errors"] / result["total_checked"] * 100,
                2
            )
            self.assertEqual(result["qber"], expected_qber)
        else:
            self.assertEqual(result["qber"], 0.0)

        # Key status must agree with the returned key.
        self.assertEqual(
            result["key_generated"],
            len(result["shared_key"]) > 0
        )

        if result["key_generation_status"] == "generated":
            self.assertTrue(result["key_generated"])
        else:
            self.assertFalse(result["key_generated"])


if __name__ == "__main__":
    unittest.main()
