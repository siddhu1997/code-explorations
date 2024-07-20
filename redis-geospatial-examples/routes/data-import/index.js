const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");
const Redis = require("ioredis");

const redisClient = new Redis();
redisClient.on('connect', () => {
  console.log('Connected');
});

const router = express.Router();

router.post("/import", async (_req, res) => {
  try {
    const hotels = [];
    const stream = fs
      .createReadStream("./routes/data-import/hotel-data/goibibo_com-travel_sample.csv")
      .pipe(csv());

    for await (const row of stream) {
      const { property_name: HotelName, longitude, latitude, province, city, address, state } = row;
      hotels.push({
        name: HotelName,
        longitude,
        latitude,
        province,
        city,
        address,
        state
      });
    }

    for (const hotel of hotels) {
      await redisClient.geoadd(
        "hotels",
        hotel.longitude,
        hotel.latitude,
        hotel.name
      );
      console.log("Hotel added:", hotel.name);
    }

    console.log("CSV file successfully processed");
    return res.status(201).json({ ok: true, size: hotels.length });
  } catch (error) {
    console.error("Error processing CSV file:", error);
    return res.status(400).json({ ok: false, message: error.message });
  }
});

module.exports = router;
