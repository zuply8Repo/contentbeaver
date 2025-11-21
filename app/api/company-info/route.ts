import { NextRequest, NextResponse } from 'next/server';
import { saveCompanyInfo, getAllCompanyInfo } from '@/app/lib/database/company-info';
import { ApiResponse, ApiErrorCode, SaveCompanyInfoResponse } from '@/app/lib/types/api';
import { CompanyInfo } from '@/app/ui/input/types';

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
    const { companyInfo } = body as { companyInfo: CompanyInfo };

    // Validate request
    if (!companyInfo) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ApiErrorCode.VALIDATION_ERROR,
            message: 'Company information data is required',
          },
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Validate required fields
    if (!companyInfo.companyName || !companyInfo.industryNiche) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ApiErrorCode.VALIDATION_ERROR,
            message: 'Company name and industry/niche are required',
          },
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Additional validation
    if (companyInfo.companyName.length < 2 || companyInfo.companyName.length > 100) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ApiErrorCode.VALIDATION_ERROR,
            message: 'Company name must be between 2 and 100 characters',
          },
        } as ApiResponse,
        { status: 400 }
      );
    }

    if (companyInfo.productService.length < 10 || companyInfo.productService.length > 300) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ApiErrorCode.VALIDATION_ERROR,
            message: 'Product/Service must be between 10 and 300 characters',
          },
        } as ApiResponse,
        { status: 400 }
      );
    }

    if (companyInfo.audience.length < 10 || companyInfo.audience.length > 500) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ApiErrorCode.VALIDATION_ERROR,
            message: 'Audience must be between 10 and 500 characters',
          },
        } as ApiResponse,
        { status: 400 }
      );
    }

    if (companyInfo.mission.length < 10 || companyInfo.mission.length > 500) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ApiErrorCode.VALIDATION_ERROR,
            message: 'Mission must be between 10 and 500 characters',
          },
        } as ApiResponse,
        { status: 400 }
      );
    }

    if (companyInfo.vision.length < 10 || companyInfo.vision.length > 500) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ApiErrorCode.VALIDATION_ERROR,
            message: 'Vision must be between 10 and 500 characters',
          },
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Save to database (mock for now)
    const savedInfo = await saveCompanyInfo(companyInfo);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        data: savedInfo,
        message: 'Company information saved successfully',
      } as ApiResponse<SaveCompanyInfoResponse>,
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving company info:', error);

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
    console.error('Error fetching company info:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: ApiErrorCode.DATABASE_ERROR,
          message: 'Failed to fetch company information',
        },
      } as ApiResponse,
      { status: 500 }
    );
  }
}

