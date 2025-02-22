import crypto from "crypto";
import { test, expect, jest } from "@jest/globals";

import { InMemoryCache, RedisCache } from "../cache.js";

const sha256 = (str: string) =>
  crypto.createHash("sha256").update(str).digest("hex");

test("InMemoryCache", async () => {
  const cache = new InMemoryCache();
  await cache.update("foo", "bar", [{ text: "baz" }]);
  expect(await cache.lookup("foo", "bar")).toEqual([{ text: "baz" }]);
});

test("RedisCache", async () => {
  const redis = {
    get: jest.fn(async (key: string) => {
      console.log(key, sha256("foo_bar_0"));
      if (key === sha256("foo_bar_0")) {
        return "baz";
      }
      return null;
    }),
  };
  const cache = new RedisCache(redis as any);
  expect(await cache.lookup("foo", "bar")).toEqual([{ text: "baz" }]);
});
