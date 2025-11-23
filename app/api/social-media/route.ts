import { NextRequest, NextResponse } from 'next/server';
import { saveSocialMediaInfo, getAllSocialMediaInfo } from '@/app/lib/database/social-media-info';
import { ApiResponse, ApiErrorCode, SaveSocialMediaInfoResponse } from '@/app/lib/types/api';
import { SocialMediaInfo } from '@/app/ui/input/types';

/**
 * POST /api/social-media
 * 
 * Create a new social media information entry
 * 
 * Request body:
 * {
 *   "socialMediaInfo": {
 *     "platforms": [
 *       {
 *         "platform": "Instagram" | "LinkedIn",
 *         "postsPerWeek": number,
 *         "imageFormat": ImageFormat
 *       }
 *     ],
 *     "defaultPostsPerWeek": number
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { socialMediaInfo } = body as { socialMediaInfo: SocialMediaInfo };

    // Validate request
    if (!socialMediaInfo) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ApiErrorCode.VALIDATION_ERROR,
            message: 'Social media information data is required',
          },
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Validate required fields
    if (!socialMediaInfo.platforms || socialMediaInfo.platforms.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ApiErrorCode.VALIDATION_ERROR,
            message: 'At least one platform must be configured',
          },
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Validate each platform configuration
    for (const platform of socialMediaInfo.platforms) {
      if (!platform.platform || (platform.platform !== 'Instagram' && platform.platform !== 'LinkedIn')) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: ApiErrorCode.VALIDATION_ERROR,
              message: 'Platform must be either Instagram or LinkedIn',
            },
          } as ApiResponse,
          { status: 400 }
        );
      }

      if (!platform.postsPerWeek || platform.postsPerWeek < 1 || platform.postsPerWeek > 50) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: ApiErrorCode.VALIDATION_ERROR,
              message: 'Posts per week must be between 1 and 50',
            },
          } as ApiResponse,
          { status: 400 }
        );
      }

      if (!platform.imageFormat) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: ApiErrorCode.VALIDATION_ERROR,
              message: 'Image format is required for each platform',
            },
          } as ApiResponse,
          { status: 400 }
        );
      }

      if (!platform.postingType || platform.postingType.trim() === '') {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: ApiErrorCode.VALIDATION_ERROR,
              message: 'Posting type is required for each platform',
            },
          } as ApiResponse,
          { status: 400 }
        );
      }
    }

    // Save to database (mock for now)
    const savedInfo = await saveSocialMediaInfo(socialMediaInfo);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        data: savedInfo,
        message: 'Social media information saved successfully',
      } as ApiResponse<SaveSocialMediaInfoResponse>,
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving social media info:', error);

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
 * GET /api/social-media
 * 
 * Get all social media information entries
 * 
 * Returns:
 * {
 *   "success": true,
 *   "data": [...]
 * }
 */
export async function GET() {
  try {
    // Get all social media info from database (mock for now)
    const info = await getAllSocialMediaInfo();

    return NextResponse.json(
      {
        success: true,
        data: info,
        message: `Found ${info.length} social media information entrie(s)`,
      } as ApiResponse<SaveSocialMediaInfoResponse[]>,
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching social media info:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: ApiErrorCode.DATABASE_ERROR,
          message: 'Failed to fetch social media information',
        },
      } as ApiResponse,
      { status: 500 }
    );
  }
}

