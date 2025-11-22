import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/app/lib/supabaseServer";
import { randomUUID } from "crypto";
import { ApiResponse, UploadImageResponse, GetUploadsResponse } from "@/app/lib/types/api";

export async function POST(request: NextRequest) {
  try {
    // Parse multipart/form-data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const description = formData.get("description") as string | null;

    // Validate inputs
    if (!file) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "File is required",
          },
        },
        { status: 400 }
      );
    }

    if (!description) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Description is required",
          },
        },
        { status: 400 }
      );
    }

    // Generate unique filename
    const uuid = randomUUID();
    const fileExtension = file.name.split(".").pop() || "jpg";
    const uniqueFilename = `${uuid}.${fileExtension}`;
    const storagePath = `anonymous/${uniqueFilename}`;

    // Convert File to ArrayBuffer then to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseServer.storage
      .from("user-image")
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase storage upload error:", uploadError);
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: "INTERNAL_ERROR",
            message: "Failed to upload image to storage",
            details: uploadError,
          },
        },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabaseServer.storage
      .from("user-image")
      .getPublicUrl(storagePath);

    const publicUrl = urlData.publicUrl;

    // Insert metadata into database
    const { data: dbData, error: dbError } = await supabaseServer
      .from("user_uploads")
      .insert({
        storage_path: storagePath,
        description: description,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database insert error:", dbError);
      // Try to clean up the uploaded file
      await supabaseServer.storage
        .from("user-image")
        .remove([storagePath]);

      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: "DATABASE_ERROR",
            message: "Failed to save upload metadata",
            details: dbError,
          },
        },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json<ApiResponse<UploadImageResponse>>(
      {
        success: true,
        data: {
          upload: {
            id: dbData.id,
            storage_path: dbData.storage_path,
            description: dbData.description,
            created_at: dbData.created_at,
          },
          public_url: publicUrl,
          filename: uniqueFilename,
          original_name: file.name,
        },
        message: "Image uploaded successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error in upload route:", error);
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

export async function GET() {
  try {
    // Fetch all uploads from database
    const { data, error } = await supabaseServer
      .from("user_uploads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Database query error:", error);
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: "DATABASE_ERROR",
            message: "Failed to fetch uploads",
            details: error,
          },
        },
        { status: 500 }
      );
    }

    // Generate public URLs for each upload
    const uploadsWithUrls = data.map((upload) => {
      const { data: urlData } = supabaseServer.storage
        .from("user-image")
        .getPublicUrl(upload.storage_path);

      return {
        id: upload.id,
        storage_path: upload.storage_path,
        description: upload.description,
        created_at: upload.created_at,
        public_url: urlData.publicUrl,
      };
    });

    return NextResponse.json<ApiResponse<GetUploadsResponse>>(
      {
        success: true,
        data: {
          uploads: uploadsWithUrls,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error in GET upload route:", error);
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

