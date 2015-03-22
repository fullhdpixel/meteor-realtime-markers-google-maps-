Coordinates = new Mongo.Collection('coordinates');

if (Meteor.isServer) {
    Meteor.methods({
        saveCoordinates: function(userid, x, y) {
            var timestamp = new moment().unix();

            Coordinates.update({
                id: userid
            }, {
                id: userid,
                x: x,
                y: y,
                timestamp: timestamp
            }, {
                upsert: true
            });
        }
    });
}
