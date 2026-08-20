// app/actions/redis-actions.js
"use server";

import { vendorPrefixedKey } from "@/modules/core/domain/constants/redis";
import { connectRedis, disconnectRedis } from "@/modules/core/lib/redis";
import { getJsonOrString } from "@/modules/core/utils";
import { handleError } from "@/modules/core/utils/jsonResponse.utils";
import { RedisArgument } from "@redis/client";

export async function setRedisValue(key: string, value: RedisArgument) {
  try {
    const redisClient = await connectRedis();
    await redisClient.set(vendorPrefixedKey(key).concat(":"), value);
    await disconnectRedis();
  } catch (error) {
    return handleError(error);
  }
}

export async function getRedisValue(key: string) {
  try {
    const redisClient = await connectRedis();
    const value = await redisClient.get(vendorPrefixedKey(key).concat(":"));
    await disconnectRedis();
    return getJsonOrString(value);
  } catch (error) {
    return handleError(error);
  }
}

export async function deleteRedisValue(key: string) {
  try {
    const redisClient = await connectRedis();
    await redisClient.del(vendorPrefixedKey(key).concat(":"));
    await disconnectRedis();
  } catch (error) {
    return handleError(error);
  }
}
