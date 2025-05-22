# Geospatial Web Application

A simple Flask-based web application for displaying geospatial datasets on a Leaflet map.

## Features

*   Displays GeoJSON data on an interactive map.
*   Allows selection from multiple predefined GeoJSON layers.
*   Allows downloading of the currently displayed GeoJSON layer.
*   Basic API for serving GeoJSON files.
*   Unit tests for the backend API.

## Project Structure

```
geospatial_app/
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── static/             # Static assets (CSS, JavaScript)
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── main.js
├── templates/          # HTML templates
│   └── index.html
├── data/               # GeoJSON data files
│   ├── sample_points.geojson
│   ├── sample_lines.geojson
│   └── sample_polygons.geojson
└── tests/              # Unit tests
    └── test_app.py
```

## Setup and Installation

1.  **Clone the repository (if applicable) or ensure you have the `geospatial_app` directory.**

2.  **Create a Python Virtual Environment:**
    Navigate to the `geospatial_app` root directory and run:
    ```bash
    python -m venv .venv
    ```
    This creates a virtual environment in a `.venv` folder.

3.  **Activate the Virtual Environment:**
    *   On macOS and Linux:
        ```bash
        source .venv/bin/activate
        ```
    *   On Windows:
        ```bash
        .\.venv\Scriptsctivate
        ```

4.  **Install Dependencies:**
    With the virtual environment activated, install the required packages:
    ```bash
    pip install -r requirements.txt
    ```

## Running the Application

1.  **Ensure your virtual environment is activated.**

2.  **Run the Flask Development Server:**
    From the `geospatial_app` root directory, execute:
    ```bash
    python app.py
    ```
    The application will typically be available at `http://127.0.0.1:5000/`.

## Running Tests

1.  **Ensure your virtual environment is activated and dependencies (including `pytest`) are installed.**

2.  **Run Pytest:**
    From the `geospatial_app` root directory, execute:
    ```bash
    pytest
    ```
    Or, to be more explicit:
    ```bash
    python -m pytest
    ```
    This will discover and run the tests in the `tests/` directory.
