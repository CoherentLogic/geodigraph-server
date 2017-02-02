var express = require('express');
var router = express.Router();
var db = require('../queries');

router.get('/vectorLayers', db.getVectorLayers);
router.get('/vectorLayer/:id', db.getVectorLayer);
router.get('/rasterLayers', db.getRasterLayers);
router.get('/features/rect/:id/:nwLat/:nwLon/:seLat/:seLon', db.getFeaturesByRect);

module.exports = router;
