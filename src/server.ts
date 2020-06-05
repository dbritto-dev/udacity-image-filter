import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import { filterImageFromURL, deleteLocalFiles, validateURL } from "./util/util";

const SECRET_KEY = process.env.SECRET_KEY || "foo";

const jwtHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization = "" } = req.headers;

  if (authorization.split(" ").length < 2) {
    res.sendStatus(401);

    return;
  }

  const [type, token] = authorization.split(" ");

  if (type.toLowerCase() !== "bearer" || !token.length) return res.sendStatus(401);

  try {
    const { hello }: any = await jwt.verify(token, SECRET_KEY);

    if (hello !== "world!") return res.sendStatus(401);

    next();
  } catch (e) {
    res.sendStatus(401);
  }
};

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.use(jwtHandler);

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  app.get("/filteredimage", async (req: Request, res: Response) => {
    try {
      const { image_url = "" } = req.query;
      const imageURL = decodeURIComponent(image_url);

      if (!validateURL(imageURL)) {
        throw Error("Invalid image_url");
      }

      const filteredpath = await filterImageFromURL(imageURL);

      res.sendFile(filteredpath, () => deleteLocalFiles([filteredpath]));
    } catch (e) {
      res.sendStatus(400);
    }
  });

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (_, res: Response) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
