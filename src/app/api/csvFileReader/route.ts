import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();
  console.log(data, "data");

  try {
    if (!data) {
      throw new Error("Not Found");
    }
    return NextResponse.json({
      emails: data,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 404,
      }
    );
  }
}
