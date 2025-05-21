from flask import Flask, render_template, jsonify # Add jsonify
from flask_cors import CORS
import os # Add os
import json # Add json

app = Flask(__name__)
CORS(app)

# Path to the data directory
DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/data/<layer_name>')
def get_layer_data(layer_name):
    try:
        # Initial validation for layer_name format
        if ".." in layer_name or "/" in layer_name or "\\" in layer_name:
            return jsonify({"error": "Invalid layer name"}), 400

        filepath = os.path.join(DATA_DIR, f"{layer_name}.geojson")

        # Secondary validation that the resolved path is within the intended DATA_DIR
        if not os.path.abspath(filepath).startswith(os.path.abspath(DATA_DIR)):
            # This case should ideally be caught by the initial name check,
            # but it's a good safeguard.
            return jsonify({"error": "Invalid layer name"}), 400

        if not os.path.exists(filepath):
            return jsonify({"error": "Layer not found"}), 404
        
        with open(filepath, 'r') as f:
            data = json.load(f)
        return jsonify(data)
    except Exception as e:
        # Log the error for debugging
        app.logger.error(f"Error serving layer {layer_name}: {e}")
        return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(debug=True)
