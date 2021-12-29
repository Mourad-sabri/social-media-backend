import { createClient } from "redis";

const redisClient = createClient();

redisClient.on("error", (err) => {
  console.log(err);
});

redisClient.on("connect", () => {
  console.log("connected to redis");
});
export default redisClient;
