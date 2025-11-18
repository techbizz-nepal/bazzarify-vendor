import { createClient } from "redis";

const redisClient = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
  },
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

export async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log("Redis redisClient connected");
  }
  return redisClient;
}
export async function disconnectRedis() {
  if (!redisClient.isOpen) {
    redisClient.destroy();
    console.log("Redis disconnected");
  }
}
export default redisClient;
