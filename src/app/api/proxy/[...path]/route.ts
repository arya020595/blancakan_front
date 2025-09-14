/**
 * API Proxy Route
 * Proxies requests to the backend API to avoid CORS issues
 */

import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE_URL = process.env.BACKEND_API_URL || "http://127.0.0.1:3000";

export async function GET(request: NextRequest) {
  return handleProxyRequest(request, "GET");
}

export async function POST(request: NextRequest) {
  return handleProxyRequest(request, "POST");
}

export async function PUT(request: NextRequest) {
  return handleProxyRequest(request, "PUT");
}

export async function DELETE(request: NextRequest) {
  return handleProxyRequest(request, "DELETE");
}

export async function PATCH(request: NextRequest) {
  return handleProxyRequest(request, "PATCH");
}

async function handleProxyRequest(request: NextRequest, method: string) {
  try {
    // Get the path after /api/proxy/
    const url = new URL(request.url);
    const pathSegments = url.pathname.split("/api/proxy/");
    const backendPath = pathSegments[1] || "";

    // Construct the backend URL
    const backendUrl = `${BACKEND_BASE_URL}/${backendPath}${url.search}`;

    console.log(`🔄 [PROXY] ${method} ${backendUrl}`);

    // Prepare headers (exclude host and other problematic headers)
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      if (!["host", "connection", "user-agent"].includes(key.toLowerCase())) {
        headers[key] = value;
      }
    });

    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers,
    };

    // Add body for POST, PUT, PATCH requests
    if (["POST", "PUT", "PATCH"].includes(method)) {
      try {
        const body = await request.text();
        if (body) {
          requestOptions.body = body;
        }
      } catch {
        console.log("📝 [PROXY] No body to parse");
      }
    }

    // Make the request to the backend
    const response = await fetch(backendUrl, requestOptions);

    // Get response data
    const responseData = await response.text();

    console.log(
      `✅ [PROXY] Response ${response.status} for ${method} ${backendPath}`
    );

    // Return the response with CORS headers
    return new NextResponse(responseData, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        "Content-Type":
          response.headers.get("content-type") || "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error) {
    console.error("❌ [PROXY] Error:", error);

    return NextResponse.json(
      {
        status: "error",
        message: "Proxy request failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods":
            "GET, POST, PUT, DELETE, PATCH, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
