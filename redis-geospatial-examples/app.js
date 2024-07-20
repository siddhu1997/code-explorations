const express = require("express");
const dataRouter = require("./routes/data-import");
const hotelsRouter = require("./routes/hotels");

const app = express();
const port = 3000;

app.use(express.json());
app.use(dataRouter);
app.use(hotelsRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
