import { NextRequest, NextResponse } from "next/server";

/**
 * API Route: Trigger n8n Workflow
 * 
 * This route acts as a proxy to trigger the n8n webhook.
 * By making the request from the server-side, we avoid CORS issues.
 */
export async function POST(request: NextRequest) {
  try {
    const n8nWebhookUrl =
      "https://casavitri.app.n8n.cloud/webhook/c85afdec-350d-46e4-b8bb-deea2f926240";

    // Parse the incoming request body
    const body = await request.json();

    console.log("🚀 Triggering n8n workflow with data:", body);

    // Make the POST request to n8n webhook from the server
    const response = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Forward the data to the n8n webhook
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error("n8n webhook error:", response.status, response.statusText);
      return NextResponse.json(
        {
          success: false,
          error: `n8n webhook returned status ${response.status}`,
        },
        { status: response.status }
      );
    }

    // Get the response from n8n (if any)
    let n8nResponse;
    try {
      n8nResponse = await response.json();
    } catch {
      // If response is not JSON, that's okay
      n8nResponse = { message: "Workflow triggered successfully" };
    }

    console.log("✅ n8n workflow triggered successfully", n8nResponse);

    return NextResponse.json({
      success: true,
      message: "Workflow triggered successfully",
      data: n8nResponse,
    });
  } catch (error) {
    console.error("Error triggering n8n workflow:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to trigger workflow",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

