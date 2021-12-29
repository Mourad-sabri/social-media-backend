import { Router } from "express";
import { v4 } from "uuid";
import { client } from "../aws";
const router = Router();

router.get("/image-upload", async (req, res) => {
  const url = await client.getSignedUrl("putObject", {
    Bucket: "casatalk",
    ContentType: "content/png",
    Key: `images/${v4()}.png`,
    ACL: "public-read",
  });
  res.status(200).json(url);
});

export { router as UploadRouter };
