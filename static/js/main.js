// Load the application once the DOM is ready, using `jQuery.ready`:
$(function() {

    var FoodTruck = Backbone.Model.extend({

        //default attributes for a food truck
        defaults: function() {
            return {
                applicant: null,
                address: null,
                fooditems: null,
                longitude: null,
                latitude: null
            };
        }

    });

    //food truck collection
    var FoodTruckList = Backbone.Collection.extend({
        model: FoodTruck,

        url: function() {
            return "/api/v1/";
        },
        parse: function (response) {
            return response;
        }
    });

    //instantiate the food truck list
    var FoodTrucks = new FoodTruckList;

    //food truck view
    var FoodTruckView = Backbone.View.extend({

        tagName: "a",

        className: "list-group-item",

        template: _.template($('#food-truck-template').html()),

        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'remove', this.remove);
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    //main app
    var AppView = Backbone.View.extend({

        el: $("#food-trucks"),

        initialize: function() {

            this.listenTo(FoodTrucks, 'reset', this.addAll);

            //default coordinates (center of SF)
            var defaultCoordinates = {
                lat: 37.765,
                lng: -122.4167
            };
            var mapOptions = {
                zoom: 12,
                center: new google.maps.LatLng(defaultCoordinates['lat'], defaultCoordinates['lng'])
            };

            //initialize the map
            this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

            var self = this;
            google.maps.event.addListener(this.map, 'idle', function(event) {

                var latlngBounds = self.map.getBounds();
                var lat_north_east = latlngBounds.getNorthEast().lat();
                var lng_south_west = latlngBounds.getSouthWest().lng();
                var lat_south_west = latlngBounds.getSouthWest().lat();
                var lng_north_east = latlngBounds.getNorthEast().lng();

                self.populateFoodTrucks(lat_north_east,
                                        lng_south_west,
                                        lat_south_west,
                                        lng_north_east);

            });

        },

        populateFoodTrucks: function(lat_north_east, lng_south_west, lat_south_west, lng_north_east) {
            FoodTrucks.fetch({
                data: $.param({lat_north_east: lat_north_east,
                               lng_south_west: lng_south_west,
                               lat_south_west: lat_south_west,
                               lng_north_east: lng_north_east}),
                reset: true
            });

        },

        addOne: function(truck) {

            var self = this;

            //add the marker to the map
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(truck.get('latitude'), truck.get('longitude')),
                map: this.map,
                title: truck.get('applicant')
            });

            //on marker click, set up an info window
            var markerTemplate = _.template($('#map-marker-template').html());

            google.maps.event.addListener(marker, 'click', function() {
                if (self.infoWindow) self.infoWindow.close();

                self.infoWindow = new google.maps.InfoWindow({
                    content: markerTemplate(truck.toJSON()),
                });
                self.infoWindow.open(self.map, marker);
            });

            //add the food truck to the view
            var view = new FoodTruckView({
                model: truck
            });
            this.$("#food-truck-list").append(view.render().el);
        },

        addAll: function() {
            this.$("#food-truck-list").html("");
            FoodTrucks.each(this.addOne, this);
        }

    });

    //create the app
    var App = new AppView;

});