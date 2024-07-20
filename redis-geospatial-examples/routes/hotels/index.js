const express = require("express");
const Redis = require("ioredis");

const redisClient = new Redis();
redisClient.on("connect", () => {
  console.log("Connected");
});

const router = new express.Router();

// GEOHASH - Add hotels
router.post("/hotels/geohash", async (req, res) => {
  const { name } = req.body;
  try {
    const response = await redisClient.geohash("hotels", name);
    return res.json(response);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// GEOPOS - Get Postion of a Hotel
router.post("/hotels/position", async (req, res) => {
  const { name } = req.body;
  try {
    const response = await redisClient.geopos("hotels", name);
    return res.json(response);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// GEODIST - Get distance between two hotels
router.post("/hotels/distance", async (req, res) => {
  const { hotel1, hotel2, unit = 'km' } = req.body;
  try {
    const response = await redisClient.geodist("hotels", hotel1, hotel2, unit);
    return res.json(response);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// GEORADIUS - Get hotels within a radius
router.post('/hotels/nearby', async (req, res) => {
    const { lng, lat, radius, unit = 'km' } = req.body;
    try {
        const response = await redisClient.georadius(
          "hotels",
          lng,
          lat,
          radius,
          unit
        );
        return res.json(response);
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

// GEORADIUSBYMEMBER - Get hotels within a radius of a hotel
router.post('/hotels/members-nearby', async (req, res) => {
    const { name, radius, unit = "km" } = req.body;
    try {
        const response = await redisClient.georadiusbymember(
          "hotels",
          name,
          radius,
          unit
        );
        return res.json(response);
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

module.exports = router;
