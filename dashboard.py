###### import libraries ######

from dash import Dash, html, dcc
import dash_bootstrap_components as dbc
import pandas as pd

###### import the data ######

# URL of the CSV file
url = "https://lustat.statec.lu/rest/data/LU1,DF_B1100,1.0/.A?startPeriod=2015&endPeriod=2024&lastNObservations=5&dimensionAtObservation=AllDimensions&format=csv"

# Reading the CSV file into a DataFrame
data = pd.read_csv(url)

# Display first few rows of the DataFrame
print(data.head())


###### create the dashboard ######

app = Dash(__name__)

# app.layout = html.Div()
app.layout = dbc.Container(html.P("My awesome dashboard will be here."),
                           fluid=True)

# if __name__ == "__main__":
#     app.run(debug=True, port=8050)

