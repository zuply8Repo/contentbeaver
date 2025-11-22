import { NextRequest, NextResponse } from "next/server";
import {
  saveCompanyInfo,
  getAllCompanyInfo,
} from "@/app/lib/database/company-info";
import {
  ApiResponse,
  ApiErrorCode,
  SaveCompanyInfoResponse,
} from "@/app/lib/types/api";
import { CompanyInfo, BrandingInfo } from "@/app/ui/input/types";

/**
 * POST /api/company-info
 *
 * Create a new company information entry
 *
 * Request body:
 * {
 *   "companyInfo": {
 *     "companyName": "string",
 *     "industryNiche": "string",
 *     "productService": "string",
 *     "audience": "string",
 *     "mission": "string",
 *     "vision": "string",
 *     "statements": ["string"]
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { companyInfo, colorPalette, brandMood } = body as {
      companyInfo: CompanyInfo;
      colorPalette?: BrandingInfo["colorPalette"];
      brandMood?: BrandingInfo["mood"];
    };

    // Validate request
    if (!companyInfo) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ApiErrorCode.VALIDATION_ERROR,
            message: "Company information data is required",
          },
        } as ApiResponse,
        { status: 400 }
      );
    }

    // The UI already performs validation and also fills defaults like "N/A" for
    // optional fields, so we keep server-side validation minimal here.

    // Save to database, including optional branding fields
    const savedInfo = await saveCompanyInfo(companyInfo, {
      colorPalette,
      brandMood,
    });

    // Return success response
    return NextResponse.json(
      {
        success: true,
        data: savedInfo,
        message: "Company information saved successfully",
      } as ApiResponse<SaveCompanyInfoResponse>,
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving company info:", error);

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

/**
 * GET /api/company-info
 *
 * Get all company information entries
 *
 * Returns:
 * {
 *   "success": true,
 *   "data": [...]
 * }
 */
export async function GET() {
  try {
    // Get all company info from database (mock for now)
    const info = await getAllCompanyInfo();

    return NextResponse.json(
      {
        success: true,
        data: info,
        message: `Found ${info.length} company information entrie(s)`,
      } as ApiResponse<SaveCompanyInfoResponse[]>,
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching company info:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: ApiErrorCode.DATABASE_ERROR,
          message: "Failed to fetch company information",
        },
      } as ApiResponse,
      { status: 500 }
    );
  }
}
