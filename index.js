const dotenv = require("dotenv");
const http = require("http");
const httpContext = require("express-http-context");
const express = require("express");
const bodyParser = require("body-parser");
const { Client } = require("@googlemaps/google-maps-services-js");

dotenv.config();

const key = process.env.API_KEY;

const app = express();
const server = http.createServer(app);

app
  .use(express.urlencoded({ extended: false }))
  .use(express.json())
  .use(httpContext.middleware)
  .get("/", async (req, res) => {
    const { lat, long } = req.query;

    const result = await calculateLocations(lat, long);

    res.json(result);
  })
  .listen(3002, () =>
    console.log({ message: `Server ᕕ(ಠ‿ಠ)ᕗ in the port ${3002}` })
  );

server.on("error", () => console.log({ error: "algo salio mal" }));

const calculateLocations = async (lat, long) => {
  const client = new Client({});

  console.log(
    `consultando la localización en base a las geo coordenadas [${lat}, ${long}]`
  );

  const result = await client
    .reverseGeocode({
      params: {
        latlng: [lat, long],
        key,
      },
    })
    .then((r) => {
      return r.data.results[0].address_components;
      // return result;
    })
    .catch((e) => {
      console.log(e);
    });

  console.log({ result });

  return result;
};
