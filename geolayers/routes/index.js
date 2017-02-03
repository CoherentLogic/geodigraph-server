var express = require('express');
var router = express.Router();
var db = require('../queries');

console.log("Initializing route handlers...");

router.get('/vectorLayers', db.getVectorLayers);
router.get('/vectorLayer/:id', db.getVectorLayer);
router.get('/rasterLayers', db.getRasterLayers);
router.get('/features/rect/:id/:nwLat/:nwLon/:seLat/:seLon', db.getFeaturesByRect);

console.log("Route handlers initialized.");

console.log("\n\nPID " + process.pid + " listening for REST connections.");

module.exports = router;
