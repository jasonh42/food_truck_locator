# San Francisco Food Truck Locator
This application is a food truck locator for the San Francisco area. 
The app can be accessed at: http://ec2-54-187-138-125.us-west-2.compute.amazonaws.com/
My solution is full-stack (Python queries the DataSF API and relays the results via JSON to the Backbone.js frontend).

## Technologies
Back-end:
- Python with Flask Microframework
- Hosted on AWS

Front-end:
- Bootstrap with UnderscoreJS
- Backbone.js
- Font Awesome
- Google Maps API

Development tools:
- PyCharm

## Notes
This is my first Flask application. This is also my first Backbone.js application (although I have prior experience with AngularJS).
I spent quite a bit of time experimenting with Flask and BackboneJS before beginning work on the application.

## Improvements
This application can be improved in a number of ways. A few improvements include:
- Unit testing to ensure a stable product (using Jamine)
- Clicking a location on the sidebar should center that location on the map
- Usage of LESS or SASS for CSS implementation
- Geolocation through HTML5 to allow for a more accurate location (currently defaults to SF city center)
- A more unique and fun UI (Bootstrap-based UI's are commonplace across the web)
- Search functionality (to look for a particular type of food)

