import { NextResponse } from "next/server";

export async function GET() {
  const lyrics = String(process.env.TEST_LYRICS || "").trim();

  if (!lyrics) {
    return NextResponse.json(
      {
        message: "Missing TEST_LYRICS on server.",
        code: "MISSING_TEST_LYRICS",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ lyrics });
}
