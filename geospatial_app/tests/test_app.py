import pytest
import os
# This import assumes that pytest is run from the 'geospatial_app' directory,
# or that the directory containing 'geospatial_app' is in PYTHONPATH,
# allowing 'geospatial_app.app' to be found.
# If 'app.py' is in the root of 'geospatial_app' and 'tests' is a subdir,
# and you run pytest from 'geospatial_app', then use: 'from app import app as flask_app'
# The worker should resolve this based on its execution context.
# Assuming 'geospatial_app' is the project root where app.py resides.
from app import app as flask_app

@pytest.fixture
def app_instance():
    flask_app.config.update({
        "TESTING": True,
    })
    yield flask_app

@pytest.fixture
def client(app_instance):
    return app_instance.test_client()

def test_get_layer_data_success(client):
    # Assumes sample_points.geojson exists in the data directory
    response = client.get('/api/data/sample_points')
    assert response.status_code == 200
    data = response.json
    assert data is not None
    assert data.get('type') == 'FeatureCollection'
    assert isinstance(data.get('features'), list)
    assert len(data.get('features', [])) > 0

def test_get_layer_data_not_found(client):
    response = client.get('/api/data/non_existent_layer_12345')
    assert response.status_code == 404
    data = response.json
    assert data is not None
    assert data.get('error') == 'Layer not found'

def test_get_layer_data_invalid_name_traversal(client):
    response = client.get('/api/data/../app') 
    assert response.status_code == 400 
    data = response.json
    assert data is not None
    assert data.get('error') == 'Invalid layer name'

def test_get_layer_data_invalid_name_absolute_path(client):
    response = client.get('/api/data//some/absolute/path/file') 
    assert response.status_code == 400
    data = response.json
    assert data is not None
    assert data.get('error') == 'Invalid layer name'
