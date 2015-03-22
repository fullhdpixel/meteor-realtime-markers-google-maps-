Coordinates = new Mongo.Collection('coordinates');

if (Meteor.isClient) {
    Meteor.startup(function() {
        GoogleMaps.load();
    });

    Template.maps.helpers({
        mapsOptions: function() {
            if (GoogleMaps.loaded()) {
                var x = 52.225653;
                var y = 6.636614;

                var myLatlng = new google.maps.LatLng(x, y);

                return {
                    center: myLatlng,
                    zoom: 16
                };
            }
        }
    });

    Template.body.created = function() {
        GoogleMaps.ready('exampleMap', function(map) {
            var markers = Coordinates.find({}).fetch();
            var count = Coordinates.find({}).count();

            var map = GoogleMaps.maps.exampleMap.instance;

            for (i = 0; i < count; i++) {
                var x = markers[i]['x'];
                var y = markers[i]['y'];
                var timestamp = moment(markers[i]['timestamp'] * 1000).fromNow();

                var myLatlng = new google.maps.LatLng(x, y);

                var marker = new google.maps.Marker({
                    position: myLatlng,
                    map: map,
                    title: timestamp
                });
            }
        });
    };

    Template.maps.rendered = function() {
        resizeMap();
        $(window).resize(function() {
            resizeMap();
        });

        Meteor.setInterval(function() {
            getCoordinates();
        }, 1000);
    }

    function resizeMap() {
        var height = $(window).height() + 'px';
        $('.map-container').css({
            'height': height
        });
    }

    function getCoordinates() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    }

    function showPosition(position) {
        var x = position.coords.latitude
        var y = position.coords.longitude;

        if (!Session.get('userid')) {

            var userid = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < 20; i++) {
                userid += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            Session.setPersistent('userid', userid);
        }

        var userid = Session.get('userid');

        Meteor.call('saveCoordinates', userid, x, y, function(error, result) {
            if (error) {
                alert(error);
            }
        });
    }
}
