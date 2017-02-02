var promise = require('bluebird');

var options = {
    promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://ptarmigan:VkrP15a1@localhost:5432/ptarmigan';
var db = pgp(connectionString);

module.exports = {

    getVectorLayers: function(req, res, next) {
    	db.any("SELECT * FROM parcel_layers ORDER BY layer_name")
    	.then(function(data) {
			res.status(200)
			    .json(data);
		    })
		    .catch(function(err) {
			return next(err);
		    });
    },

    getVectorLayer: function(req, res, next) {
    	db.one("SELECT * FROM parcel_layers WHERE id='" + req.params.id + "'")
	    .then(function(data) {
			res.status(200)
			    .json(data);
		    })
		    .catch(function(err) {
			return next(err);
		    });
    },

    getRasterLayers: function(req, res, next) {
    	var lyr = '[{"layer_extents":"","layer_color":"","layer_key_name":"","layer_public":"1","southwest_coordinates":{"0":{"0":""}},"written":"","layer_projection":"","url":"http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png","layer_enabled":"1","layer_type":"raster","layer_name":"Open Street Map","layer_geom_field":"","layer_key_abbreviation":"","northeast_coordinates":{"0":{"0":""}},"name":"Open Street Map","id":"STREET","layer_boundary":"","layer_southwest_extent":"","layer_projection_name":"","layer_northeast_extent":"","layer_table":"","layer_key_field":"","attribution":"Map data &copy; OpenStreetMap contributors"}]';
    	
    	res.status(200).json(JSON.parse(lyr));    	
    },
    
    getFeaturesByRect: function(req, res, next) {
		var layerID = req.params.id;
		var nwLon = parseFloat(req.params.nwLat);
		var nwLat = parseFloat(req.params.nwLon);
		var seLon = parseFloat(req.params.seLat);
		var seLat = parseFloat(req.params.seLon);	
		
		db.one("SELECT * FROM parcel_layers WHERE id='" + layerID + "'")
		.then(function(data) {
			var qry = "SELECT row_to_json(fc)::VARCHAR FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, ST_AsGeoJSON(ST_Transform(lg." + data.layer_geom_field + ", 4326))::json As geometry, row_to_json((SELECT l FROM (SELECT " + data.layer_key_field + " AS feature_id, '" + layerID + "' AS layer_id) As l)) As properties FROM " + data.layer_table + " As lg WHERE ST_Transform(lg." + data.layer_geom_field + ", 4326) && ST_SetSRID('BOX3D(" + nwLon + " " + nwLat + "," + seLon + " " + seLat + ")'::box3d, 4326)) As f)  As fc";
	
			console.log(qry);
			
			db.one(qry)
			    .then(function(data) {
				res.status(200)
				    .json(JSON.parse(data.row_to_json));
			    })
			    .catch(function(err) {
				return next(err);
			    });
		    })
		    .catch(function(err) {
			return next(err);
		    });    
    }
   	
}

    
