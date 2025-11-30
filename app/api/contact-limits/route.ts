import { getAuth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { DEFAULT_CONTACT_LIMIT } from "@/lib/constants";

interface DailyLimitData {
  count: number;
  date: string;
  userId: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
};

// ------------------------------
//           GET HANDLER
// ------------------------------
export async function GET(request: Request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    const user = await currentUser();

    if (!user) {
      return new NextResponse(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    const today = new Date().toISOString().split("T")[0];

    const limit = DEFAULT_CONTACT_LIMIT;

    let limitData: DailyLimitData = {
      count: 0,
      date: today,
      userId,
    };

    if (user.privateMetadata?.dailyContactLimit) {
      limitData = user.privateMetadata.dailyContactLimit as DailyLimitData;
    }

    if (limitData.date !== today) {
      limitData.count = 0;
      limitData.date = today;
    }

    return new NextResponse(
      JSON.stringify({
        userId,
        count: limitData.count,
        limit,
        remaining: Math.max(0, limit - limitData.count),
        hasExceeded: limitData.count >= limit,
        date: limitData.date,
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("[CONTACT_LIMITS_GET]", error);
    return new NextResponse(
      JSON.stringify({ error: error?.message || "Internal error" }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

// ------------------------------
//           POST HANDLER
// ------------------------------
export async function POST(request: Request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    if (!user) {
      return new NextResponse(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    const today = new Date().toISOString().split("T")[0];

    const limit = DEFAULT_CONTACT_LIMIT;

    let limitData: DailyLimitData = {
      count: 0,
      date: today,
      userId,
    };

    if (user.privateMetadata?.dailyContactLimit) {
      limitData = user.privateMetadata.dailyContactLimit as DailyLimitData;
    }

    if (limitData.date !== today) {
      limitData.count = 0;
      limitData.date = today;
    }

    if (limitData.count >= limit) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Daily limit exceeded" }),
        { status: 403, headers: corsHeaders }
      );
    }

    const newCount = limitData.count + 1;

    await client.users.updateUserMetadata(userId, {
      privateMetadata: {
        ...(user.privateMetadata || {}),
        dailyContactLimit: {
          count: newCount,
          date: today,
          userId,
        },
      },
    });

    return new NextResponse(
      JSON.stringify({
        success: true,
        count: newCount,
        limit,
        remaining: Math.max(0, limit - newCount),
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("[CONTACT_LIMITS_POST]", error);
    return new NextResponse(
      JSON.stringify({ error: error?.message || "Internal error" }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}