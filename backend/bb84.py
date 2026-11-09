
import random


def run_bb84_simulation(
    mode="secure",
    attack_intensity=50,
    channel_noise=0,
):
    """Run an educational BB84 simulation with interception and channel noise."""

    NUM_BITS = 10
    QBER_THRESHOLD = 11.0

    # Validate mode.
    if not isinstance(mode, str) or mode.lower() not in ("secure", "attack"):
        mode = "secure"
    else:
        mode = mode.lower()

    # Validate attack intensity.
    try:
        attack_intensity = float(attack_intensity)
    except (TypeError, ValueError):
        attack_intensity = 50.0

    attack_intensity = max(0.0, min(100.0, attack_intensity))

    # Validate channel noise.
    try:
        channel_noise = float(channel_noise)
    except (TypeError, ValueError):
        channel_noise = 0.0

    channel_noise = max(0.0, min(100.0, channel_noise))

    effective_intensity = (
        attack_intensity if mode == "attack" else 0.0
    )

    # 1. Ghost generates random bits and bases.
    ghost_bits = [
        random.randint(0, 1) for _ in range(NUM_BITS)
    ]
    ghost_bases = [
        random.choice(["+", "x"]) for _ in range(NUM_BITS)
    ]

    # 2. Encode Ghost's bits into BB84 states.
    ghost_qubits = []

    for bit, basis in zip(ghost_bits, ghost_bases):
        if basis == "+":
            ghost_qubits.append("|0>" if bit == 0 else "|1>")
        else:
            ghost_qubits.append("|+>" if bit == 0 else "|->")

    # 3. Rolex may intercept the transmitted qubits.
    rolex_bases = []
    intercepted_bits = []
    interception_flags = []

    # Track the basis and bit used to prepare the state
    # that continues toward Leo.
    transmitted_bases = []
    transmitted_bits = []

    for i in range(NUM_BITS):
        intercept = (
            mode == "attack"
            and random.random() < effective_intensity / 100.0
        )

        interception_flags.append(intercept)

        if intercept:
            eve_basis = random.choice(["+", "x"])
            rolex_bases.append(eve_basis)

            if eve_basis == ghost_bases[i]:
                eve_bit = ghost_bits[i]
            else:
                eve_bit = random.randint(0, 1)

            intercepted_bits.append(eve_bit)
            transmitted_bases.append(eve_basis)
            transmitted_bits.append(eve_bit)

        else:
            rolex_bases.append(None)
            intercepted_bits.append(None)
            transmitted_bases.append(ghost_bases[i])
            transmitted_bits.append(ghost_bits[i])

    # 4. Apply independent channel bit-flip noise.
    noisy_transmitted_bits = []
    channel_noise_flags = []

    for bit in transmitted_bits:
        noise_occurred = (
            random.random() < channel_noise / 100.0
        )

        channel_noise_flags.append(noise_occurred)

        if noise_occurred:
            noisy_transmitted_bits.append(1 - bit)
        else:
            noisy_transmitted_bits.append(bit)

    # 5. Leo chooses random bases and measures the received states.
    leo_bases = [
        random.choice(["+", "x"]) for _ in range(NUM_BITS)
    ]
    leo_results = []

    for i in range(NUM_BITS):
        if leo_bases[i] == transmitted_bases[i]:
            leo_results.append(noisy_transmitted_bits[i])
        else:
            # Measurement in a different basis is random
            # in this simplified BB84 model.
            leo_results.append(random.randint(0, 1))

    # 6. Sift the key using positions with matching bases.
    matching_positions = [
        i
        for i in range(NUM_BITS)
        if ghost_bases[i] == leo_bases[i]
    ]

    ghost_sifted_key = [
        ghost_bits[i] for i in matching_positions
    ]
    leo_sifted_key = [
        leo_results[i] for i in matching_positions
    ]

    # 7. Calculate QBER.
    errors = sum(
        ghost_sifted_key[i] != leo_sifted_key[i]
        for i in range(len(matching_positions))
    )

    total_checked = len(matching_positions)

    qber = (
        errors / total_checked * 100.0
        if total_checked
        else 0.0
    )

    intercepted_count = sum(interception_flags)
    noise_count = sum(channel_noise_flags)

    # 8. Interpret the result cautiously.
    if total_checked == 0:
        security_status = "INCONCLUSIVE: No matching bases"
    elif qber > QBER_THRESHOLD:
        security_status = "WARNING: High QBER detected!"
    elif mode == "attack" and effective_intensity > 0:
        security_status = (
            "INCONCLUSIVE: Attack mode is active; "
            "QBER is below threshold"
        )
    elif channel_noise > 0:
        security_status = (
            "CHANNEL NOISE ENABLED: Review QBER before trusting the key"
        )
    else:
        security_status = "Communication Secure"

    # 9. Decide whether to return a candidate key and explain why.
    if total_checked == 0:
        shared_key = []
        key_generation_status = "failed_no_matching_bases"
        key_generation_message = (
            "Key generation failed: Ghost and Leo had no matching bases. "
            "Run the simulation again to try to obtain matching positions."
        )

    elif qber > QBER_THRESHOLD:
        shared_key = []
        key_generation_status = "failed_high_qber"
        key_generation_message = (
            f"Key generation rejected: QBER is {qber:.2f}%, "
            f"which exceeds the {QBER_THRESHOLD:.0f}% threshold."
        )

    else:
        shared_key = leo_sifted_key.copy()
        key_generation_status = "generated"
        key_generation_message = (
            f"A candidate key was generated from {total_checked} "
            f"matching positions. Observed QBER: {qber:.2f}%. "
            "This educational simulation does not prove that the key "
            "is secure."
        )

    return {
        "mode": mode,
        "attack_intensity": effective_intensity,
        "channel_noise": channel_noise,

        "rolex_present": intercepted_count > 0,
        "intercepted_count": intercepted_count,
        "interception_flags": interception_flags,

        "channel_noise_count": noise_count,
        "channel_noise_flags": channel_noise_flags,

        "ghost_bits": ghost_bits,
        "ghost_bases": ghost_bases,
        "ghost_qubits": ghost_qubits,

        "rolex_bases": rolex_bases,
        "intercepted_bits": intercepted_bits,

        "transmitted_bases": transmitted_bases,
        "transmitted_bits": noisy_transmitted_bits,

        "leo_bases": leo_bases,
        "leo_results": leo_results,

        "shared_key": shared_key,
        "key_generated": len(shared_key) > 0,
        "key_generation_status": key_generation_status,
        "key_generation_message": key_generation_message,
        "qber_threshold": QBER_THRESHOLD,

        "errors": errors,
        "total_checked": total_checked,
        "qber": round(qber, 2),
        "security_status": security_status,
    }
