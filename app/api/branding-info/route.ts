import { NextRequest, NextResponse } from 'next/server';
import { saveBrandingInfo, getAllBrandingInfo } from '@/app/lib/database/branding-info';
import { ApiResponse, ApiErrorCode, SaveBrandingInfoResponse } from '@/app/lib/types/api';
import { BrandingInfo } from '@/app/ui/input/types';

/**
 * POST /api/branding-info
 * 
 * Create a new branding information entry
 * 
 * Request body:
 * {
 *   "brandingInfo": {
 *     "colorPalette": [
 *       { "id": "string", "hex": "#XXXXXX", "name": "string" }
 *     ],
 *     "mood": ["string"]
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { brandingInfo } = body as { brandingInfo: BrandingInfo };

    // Validate request
    if (!brandingInfo) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ApiErrorCode.VALIDATION_ERROR,
            message: 'Branding information data is required',
          },
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Validate color palette
    if (!brandingInfo.colorPalette || brandingInfo.colorPalette.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ApiErrorCode.VALIDATION_ERROR,
            message: 'At least one color is required in the color palette',
          },
        } as ApiResponse,
        { status: 400 }
      );
    }

    if (brandingInfo.colorPalette.length > 6) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ApiErrorCode.VALIDATION_ERROR,
            message: 'Maximum 6 colors allowed in the color palette',
          },
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Validate hex codes
    const hexPattern = /^#[0-9A-F]{6}$/i;
    const invalidColors = brandingInfo.colorPalette.filter(
      (color) => !hexPattern.test(color.hex)
    );
    if (invalidColors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ApiErrorCode.VALIDATION_ERROR,
            message: 'All colors must be valid hex codes (e.g., #FF5733)',
          },
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Validate mood tags
    if (!brandingInfo.mood || brandingInfo.mood.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ApiErrorCode.VALIDATION_ERROR,
            message: 'At least one mood tag is required',
          },
        } as ApiResponse,
        { status: 400 }
      );
    }

    if (brandingInfo.mood.length > 8) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ApiErrorCode.VALIDATION_ERROR,
            message: 'Maximum 8 mood tags allowed',
          },
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Save to database (mock for now)
    const savedInfo = await saveBrandingInfo(brandingInfo);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        data: savedInfo,
        message: 'Branding information saved successfully',
      } as ApiResponse<SaveBrandingInfoResponse>,
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving branding info:', error);

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
          message: 'An unexpected error occurred',
        },
      } as ApiResponse,
      { status: 500 }
    );
  }
}

/**
 * GET /api/branding-info
 * 
 * Get all branding information entries
 * 
 * Returns:
 * {
 *   "success": true,
 *   "data": [...]
 * }
 */
export async function GET() {
  try {
    // Get all branding info from database (mock for now)
    const info = await getAllBrandingInfo();

    return NextResponse.json(
      {
        success: true,
        data: info,
        message: `Found ${info.length} branding information entrie(s)`,
      } as ApiResponse<SaveBrandingInfoResponse[]>,
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching branding info:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: ApiErrorCode.DATABASE_ERROR,
          message: 'Failed to fetch branding information',
        },
      } as ApiResponse,
      { status: 500 }
    );
  }
}

