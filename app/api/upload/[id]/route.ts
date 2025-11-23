import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/app/lib/supabaseServer";
import { ApiResponse, GetUploadByIdResponse } from "@/app/lib/types/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch upload by ID
    const { data, error } = await supabaseServer
      .from("user_uploads")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Database query error:", error);
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: "DATABASE_ERROR",
            message: "Failed to fetch upload",
            details: error,
          },
        },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Upload not found",
          },
        },
        { status: 404 }
      );
    }

    // Generate public URL
    const { data: urlData } = supabaseServer.storage
      .from("user-image")
      .getPublicUrl(data.storage_path);

    return NextResponse.json<ApiResponse<GetUploadByIdResponse>>(
      {
        success: true,
        data: {
          upload: {
            id: data.id,
            storage_path: data.storage_path,
            description: data.description,
            created_at: data.created_at,
            public_url: urlData.publicUrl,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred",
          details: error,
        },
      },
      { status: 500 }
    );
  }
}

