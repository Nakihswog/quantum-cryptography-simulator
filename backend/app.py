from flask import Flask, jsonify, render_template, request
from flask_cors import CORS

from bb84 import run_bb84_simulation

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/simulate", methods=["GET"])
def simulate():
    mode = request.args.get("mode", "secure")
    intensity = request.args.get("intensity", default="50")
    noise = request.args.get("noise", default="0")

    try:
        intensity = float(intensity)
    except (TypeError, ValueError):
        return jsonify({
            "error": "Invalid attack intensity. Use a value from 0 to 100."
        }), 400

    if not 0 <= intensity <= 100:
        return jsonify({
            "error": "Attack intensity must be between 0 and 100."
        }), 400

    try:
        noise = float(noise)
    except (TypeError, ValueError):
        return jsonify({
            "error": "Invalid channel noise. Use a value from 0 to 100."
        }), 400

    if not 0 <= noise <= 100:
        return jsonify({
            "error": "Channel noise must be between 0 and 100."
        }), 400

    result = run_bb84_simulation(
        mode=mode,
        attack_intensity=intensity,
        channel_noise=noise,
    )

    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True)