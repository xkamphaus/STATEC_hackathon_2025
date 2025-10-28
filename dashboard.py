import dash
from dash import html
import dash_leaflet as dl
import json

import geopandas as gpd

def load_shapefile(shapefile_path):
    """
    Load a shapefile and convert it to GeoJSON format

    Args:
        shapefile_path: Path to the .shp file

    Returns:
        GeoJSON dictionary
    """
    gdf = gpd.read_file(shapefile_path)
    # Convert to WGS84 (EPSG:4326) for web mapping
    gdf = gdf.to_crs(epsg=4326)
    return json.loads(gdf.to_json())


geojson_data = load_shapefile('assets/LIMADM_COMMUNES.shp')

# Initialize the Dash app
app = dash.Dash(__name__)

# Load the GeoJSON file
# Create the app layout
app.layout = html.Div([
    dl.Map(
        children=[
            dl.TileLayer(),
            dl.GeoJSON(
                data=geojson_data,
                id="communes-geojson",
                options=dict(style=dict(color='#3388ff', weight=2, fillOpacity=0.3))
            )
        ],
        center=[49.6, 6.1],
        zoom=10,
        style={'width': '100%', 'height': '100vh'}
    )
], style={'margin': 0, 'padding': 0})

if __name__ == '__main__':
    app.run(debug=True, port=8050)
