// app/actions/redis-actions.js
"use server";

import { connectRedis } from "@/modules/core/lib/redis";
import { handleError } from "@/modules/core/utils/jsonResponse.utils";
import { RedisArgument } from "@redis/client";

const redisPrefix = "vendor_";
const prefixedKey = (key: string) => redisPrefix.concat(key);
export async function setRedisValue(key: string, value: RedisArgument) {
  try {
    const redisClient = await connectRedis();
    await redisClient.set(prefixedKey(key), value);
    return {
      success: true,
      message: `Key '${prefixedKey(key)}' set successfully.`,
    };
  } catch (error) {
    handleError(error);
  }
}

export async function getRedisValue(key: string) {
  try {
    const redisClient = await connectRedis();
    const value = await redisClient.get(prefixedKey(key));
    return { success: true, value };
  } catch (error) {
    handleError(error);
  }
}
