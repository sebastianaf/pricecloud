import express, { application } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import fs from "fs";
import S from "string";

import whitelist from "./config/whitelist";
import { morganOptions } from "./config/morgan";
import { logOptions } from "./config/log";
import { sequelize } from "./db/sequelize";
import { toInteger } from "lodash";
import { logCheck } from "./tools/log";
import auth from "./middlewares/auth.handler";
import routerApi from "./routes";

require("dotenv").config();

var app = express();
logCheck();

/***
 * Middlewares
 */
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed"));
    }
  },
};
app.use(cors(corsOptions));
app.use(auth);
app.use(express.json()); // for parsing application/json
//app.use(express.urlencoded({ extended: true }));
toInteger(process.env.API_LOG)
  ? app.use(
      morgan(morganOptions, {
        stream: fs.createWriteStream(logOptions.filePath, { flags: "a" }),
      })
    )
  : null;
app.use(helmet());
app.use(morgan(morganOptions));

/***
 * Routes
 */
app.get("/", (req, res) => {
  res.send("OK");
});

routerApi(app);

//testing conection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

app.listen(process.env.API_PORT, () => {
  console.log(`Running on port ${process.env.API_PORT}`);
});
