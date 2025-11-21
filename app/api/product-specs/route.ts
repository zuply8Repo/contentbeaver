import { NextRequest, NextResponse } from 'next/server';
import { saveProductSpec, getAllProductSpecs } from '@/app/lib/database/product-specs';
import { ApiResponse, ApiErrorCode, SaveProductSpecResponse } from '@/app/lib/types/api';
import { ProductSpec } from '@/app/ui/input/types';

/**
 * POST /api/product-specs
 * 
 * Create a new product specification
 * 
 * Request body:
 * {
 *   "productSpec": {
 *     "productName": "string",
 *     "description": "string",
 *     "features": ["string"],
 *     "technicalSpecs": "string",
 *     "tags": ["string"]
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { productSpec } = body as { productSpec: ProductSpec };

    // Validate request
    if (!productSpec) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ApiErrorCode.VALIDATION_ERROR,
            message: 'Product specification data is required',
          },
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Validate required fields
    if (!productSpec.productName || !productSpec.description) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ApiErrorCode.VALIDATION_ERROR,
            message: 'Product name and description are required',
          },
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Additional validation
    if (productSpec.productName.length < 3 || productSpec.productName.length > 100) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ApiErrorCode.VALIDATION_ERROR,
            message: 'Product name must be between 3 and 100 characters',
          },
        } as ApiResponse,
        { status: 400 }
      );
    }

    if (productSpec.description.length < 10 || productSpec.description.length > 500) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ApiErrorCode.VALIDATION_ERROR,
            message: 'Description must be between 10 and 500 characters',
          },
        } as ApiResponse,
        { status: 400 }
      );
    }

    if (!productSpec.features || productSpec.features.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ApiErrorCode.VALIDATION_ERROR,
            message: 'At least one feature is required',
          },
        } as ApiResponse,
        { status: 400 }
      );
    }

    if (!productSpec.tags || productSpec.tags.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ApiErrorCode.VALIDATION_ERROR,
            message: 'At least one tag is required',
          },
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Save to database (mock for now)
    const savedSpec = await saveProductSpec(productSpec);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        data: savedSpec,
        message: 'Product specification saved successfully',
      } as ApiResponse<SaveProductSpecResponse>,
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving product spec:', error);

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
 * GET /api/product-specs
 * 
 * Get all product specifications
 * 
 * Returns:
 * {
 *   "success": true,
 *   "data": [...]
 * }
 */
export async function GET() {
  try {
    // Get all product specs from database (mock for now)
    const specs = await getAllProductSpecs();

    return NextResponse.json(
      {
        success: true,
        data: specs,
        message: `Found ${specs.length} product specification(s)`,
      } as ApiResponse<SaveProductSpecResponse[]>,
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching product specs:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: ApiErrorCode.DATABASE_ERROR,
          message: 'Failed to fetch product specifications',
        },
      } as ApiResponse,
      { status: 500 }
    );
  }
}

