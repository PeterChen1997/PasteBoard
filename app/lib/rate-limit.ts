import { NextResponse } from "next/server";

interface RateLimitContext {
  ip: string;
  path: string;
}

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export async function checkRateLimit(context: RateLimitContext) {
  const { ip, path } = context;
  const key = `${ip}-${path}`;
  const now = Date.now();
  const limit = 10;
  const windowMs = 60 * 1000;

  const current = rateLimitMap.get(key) || {
    count: 0,
    resetTime: now + windowMs,
  };

  if (now > current.resetTime) {
    current.count = 1;
    current.resetTime = now + windowMs;
  } else {
    current.count++;
  }

  rateLimitMap.set(key, current);

  const remaining = Math.max(0, limit - current.count);
  const reset = Math.ceil((current.resetTime - now) / 1000);

  if (current.count > limit) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": reset.toString(),
        },
      }
    );
  }

  return {
    headers: {
      "X-RateLimit-Limit": limit.toString(),
      "X-RateLimit-Remaining": remaining.toString(),
      "X-RateLimit-Reset": reset.toString(),
    },
  };
}
