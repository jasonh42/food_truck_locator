from flask import Flask, render_template, request, Response
import urllib, json

app = Flask(__name__)

# default square of San Francisco area
default_bounds = {"lat_north_east": "37.7933",
                  "lng_south_west": "-122.5620",
                  "lat_south_west": "37.7366",
                  "lng_north_east": "-122.2713"}

# base API URL
api_url = "http://data.sfgov.org/resource/rqzj-sfat.json?Status=APPROVED"


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/v1/')
def api():
    """
    Simple API that accepts four corners of a map. This API will sanitize the coordinates,
    send the information to the SFGov API, and output the received data.
    """

    # get all required coordinates. default to standard square of San Francisco if input not provided.
    lat_north_east = request.args.get('lat_north_east', default_bounds['lat_north_east'])
    lng_south_west = request.args.get('lng_south_west', default_bounds['lng_south_west'])
    lat_south_west = request.args.get('lat_south_west', default_bounds['lat_south_west'])
    lng_north_east = request.args.get('lng_north_east', default_bounds['lng_north_east'])

    # build the request url
    request_url = api_url
    request_url = request_url + "&$where=latitude>" + lat_south_west
    request_url = request_url + "%20AND%20latitude<" + lat_north_east
    request_url = request_url + "%20AND%20longitude<" + lng_north_east
    request_url = request_url + "%20AND%20longitude>" + lng_south_west

    # open the url for reading
    response = urllib.urlopen(request_url)

    # parse the data into JSON
    data = json.loads(response.read())

    # only show the first 75 items
    data = json.dumps(data[0:75])

    # build the response for output
    resp = Response(response=data, status=200, mimetype="application/json")

    return resp

if __name__ == '__main__':
    app.run(debug=True)