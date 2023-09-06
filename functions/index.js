const functions = require("firebase-functions");
const axios = require("axios");
const cors = require("cors")({origin: true});

exports.getPlaces = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const latitude = req.query.latitude || 35.6895;
    const longitude = req.query.longitude || 139.6917;
    const apiKey = functions.config().googleapi.key;
    const radius = 100; // in meters

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      const data = response.data;

      if (data.status === "OK") {
        res.send(data.results);
      } else {
        res.status(400).send(data);
      }
    } catch (error) {
      res.status(500).send(error);
    }
  });
});
