import { NextResponse } from "next/server";
import { ZodSchema } from "zod";

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function apiUnauthorized() {
  return apiError("Unauthorized", 401);
}

export function apiForbidden() {
  return apiError("Forbidden", 403);
}

export function validateBody<T>(schema: ZodSchema<T>, body: unknown) {
  const result = schema.safeParse(body);
  if (!result.success) {
    return {
      data: null,
      error: result.error.flatten(),
    };
  }

  return {
    data: result.data,
    error: null,
  };
}
