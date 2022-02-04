import "./dotenv";
import express from "express";
import bodyParser from "body-parser";
import { Request, Response } from "express";
import { Routes } from "./routes";
import { logger } from "./logger";
//import { NETWORKS_TO_WATCH } from "./utils";
import Reporter from "./reporter";
import { getRpc } from "./eos/networks";
import {getNetworksToWatch} from "./dotenv";

async function start() {
  const app = express();
  app.enable("trust proxy");
  app.use(bodyParser.json());

  // register express routes from defined application routes
  Routes.forEach(route => {
    (app as any)[route.method](
      route.route,
      (req: Request, res: Response, next: Function) => {
        const result = new (route.controller as any)()[route.action](
          req,
          res,
          next
        );
        if (result instanceof Promise) {
          result.then(result =>
            result !== null && result !== undefined
              ? res.send(result)
              : undefined
          );
        } else if (result !== null && result !== undefined) {
          res.json(result);
        }
      }
    );
  });

  // start express server
  const PORT = process.env.PORT || 8080;
  const VERSION = process.env.npm_package_version
  app.set('views', __dirname + '/views');
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.listen(PORT);

  let networks_to_watch = getNetworksToWatch();

  logger.info(
    `Reporter v${VERSION}: Express server has started on port ${PORT}. Open http://localhost:${PORT}/logs`
  );
  logger.info(
    `Using endpoints ${networks_to_watch.map(network => getRpc(network).endpoint).join(`, `)}`
  );

  const reporters = networks_to_watch.map(
    network =>
      new Reporter(network)
  );
  reporters.map(reporter => reporter.start());

}

start().catch(error => logger.error(error.message || error));

process.on("unhandledRejection", function(reason: any, p) {
  let message = reason ? (reason as any).stack : reason;
  logger.error(`Possibly Unhandled Rejection at: ${message}`);

  process.exit(1);
});
