import { NextRequest, NextResponse } from "next/server";
import {
  getThemes,
  updateSelectedTheme,
} from "@/app/lib/database/theme-selection";
import {
  ApiResponse,
  ApiErrorCode,
  GetThemesResponse,
  SaveThemeSelectionRequest,
  SaveThemeSelectionResponse,
} from "@/app/lib/types/api";

/**
 * GET /api/theme-selection
 *
 * Get all available themes and the current selection
 *
 * Returns:
 * {
 *   "success": true,
 *   "data": {
 *     "id": "string",
 *     "created_at": "string",
 *     "themes": [
 *       { "id": "1", "text": "Theme description", "columnName": "theme1" }
 *     ],
 *     "selectedTheme": "theme1" | null
 *   }
 * }
 */
export async function GET() {
  try {
    // Get themes from database
    const themesData = await getThemes();

    return NextResponse.json(
      {
        success: true,
        data: themesData,
        message: `Found ${themesData.themes.length} theme(s)`,
      } as ApiResponse<GetThemesResponse>,
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching themes:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: ApiErrorCode.DATABASE_ERROR,
          message:
            error instanceof Error ? error.message : "Failed to fetch themes",
        },
      } as ApiResponse,
      { status: 500 }
    );
  }
}

/**
 * POST /api/theme-selection
 *
 * Save the user's theme selection
 *
 * Request body:
 * {
 *   "selectedTheme": "theme1" | "theme2" | "theme3"
 * }
 *
 * Returns:
 * {
 *   "success": true,
 *   "data": {
 *     "id": "string",
 *     "selectedTheme": "theme 1",
 *     "updatedAt": "string"
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { selectedTheme, themeId } = body as SaveThemeSelectionRequest;

    console.log("📨 [API] Received theme selection request:", {
      selectedTheme,
      themeId,
      themeIdType: typeof themeId,
    });

    // Validate request
    if (!selectedTheme) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ApiErrorCode.VALIDATION_ERROR,
            message: "Selected theme is required",
          },
        } as ApiResponse,
        { status: 400 }
      );
    }

    if (!themeId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ApiErrorCode.VALIDATION_ERROR,
            message: "Theme ID is required",
          },
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Validate theme value
    const validThemes = ["theme1", "theme2", "theme3"];
    if (!validThemes.includes(selectedTheme)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ApiErrorCode.VALIDATION_ERROR,
            message:
              'Invalid theme selection. Must be "theme1", "theme2", or "theme3"',
          },
        } as ApiResponse,
        { status: 400 }
      );
    }

    // TEMPORARY: Hardcoded response for testing
    // TODO: Uncomment the line below when backend is fully configured
    // const result = await updateSelectedTheme(selectedTheme);

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Hardcoded success response
    const result = {
      id: "mock_id_123",
      selectedTheme,
      updatedAt: new Date().toISOString(),
    };

    console.log("🎨 [MOCK] Theme selection saved:", result);

    // Send webhook to n8n
    try {
      const webhookUrl =
        "https://casavitri.app.n8n.cloud/webhook/5332c269-0087-4afd-b2d5-4fbb2acfe8dc";
      const webhookPayload = {
        theme_id: themeId,
        theme_name: selectedTheme,
      };

      console.log("🚀 [API → Webhook] Sending webhook to n8n:", {
        url: webhookUrl,
        payload: webhookPayload,
        themeIdDetails: {
          value: themeId,
          type: typeof themeId,
          isUUID:
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
              themeId
            ),
        },
      });

      const webhookResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(webhookPayload),
      });

      if (webhookResponse.ok) {
        console.log("✅ Webhook sent successfully");
      } else {
        console.error(
          "⚠️ Webhook failed:",
          webhookResponse.status,
          webhookResponse.statusText
        );
      }

      // Wait 10 seconds for n8n to process and update databases
      console.log("⏳ Waiting 10 seconds for n8n processing...");
      await new Promise((resolve) => setTimeout(resolve, 10000));
      console.log("✅ Wait complete");
    } catch (webhookError) {
      // Log webhook error but don't fail the entire operation
      console.error(
        "⚠️ Error sending webhook (operation will continue):",
        webhookError
      );
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        data: result,
        message: "Theme selection saved successfully",
      } as ApiResponse<SaveThemeSelectionResponse>,
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving theme selection:", error);

    // Handle specific error types
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ApiErrorCode.DATABASE_ERROR,
            message: error.message,
          },
        } as ApiResponse,
        { status: 500 }
      );
    }

    // Generic error
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ApiErrorCode.INTERNAL_ERROR,
          message: "An unexpected error occurred",
        },
      } as ApiResponse,
      { status: 500 }
    );
  }
}
