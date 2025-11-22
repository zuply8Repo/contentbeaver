import { CompanyInfo, BrandingInfo } from "@/app/ui/input/types";
import { supabaseServer } from "@/app/lib/supabaseServer";

/**
 * Database Service Layer for Company Information
 *
 * This is a mock implementation. Replace the logic inside these functions
 * with actual database calls when ready.
 *
 * Supported databases:
 * - PostgreSQL (via Prisma)
 * - MongoDB (via Mongoose)
 * - Supabase
 * - Firebase
 * - MySQL
 * - Any other database
 */

export interface SaveCompanyInfoResponse {
  id: string;
  companyInfo: CompanyInfo;
  createdAt: string;
  updatedAt: string;
}

// This mirrors the minimal set of columns you keep in the `onboarding` table.
interface CompanyInfoRow {
  id: string;
  companyName: string | null;
  industry: string | null;
  productService: string | null;
  audience: string | null;
  colorPalette: unknown | null;
  brandMood: string[] | null;
}

/**
 * Save company information to the database
 *
 * @param companyInfo - The company information data to save
 * @returns Promise with the saved company info including ID and timestamps
 *
 * TODO: Replace this mock implementation with actual database logic
 */
export async function saveCompanyInfo(
  companyInfo: CompanyInfo,
  options?: {
    colorPalette?: BrandingInfo["colorPalette"];
    brandMood?: BrandingInfo["mood"];
  }
): Promise<SaveCompanyInfoResponse> {
  // Map from our domain model to Supabase table columns
  const payload = {
    companyName: companyInfo.companyName || null,
    industry: companyInfo.industryNiche || null,
    productService: companyInfo.productService || null,
    audience: companyInfo.audience || null,
    colorPalette: options?.colorPalette ?? null,
    brandMood: options?.brandMood ?? null,
  };

  const { data, error } = await supabaseServer
    .from("onboarding")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error("Error saving company info to Supabase:", error);
    throw new Error(error.message);
  }

  const now = new Date().toISOString();

  return {
    id: data.id,
    companyInfo,
    // We still return timestamps in the API type, but they are app-level,
    // not persisted in the Supabase table.
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Get company information by ID
 *
 * @param id - The company information ID
 * @returns Promise with the company info or null if not found
 *
 * TODO: Implement actual database query
 */
export async function getCompanyInfoById(
  id: string
): Promise<SaveCompanyInfoResponse | null> {
  const { data, error } = await supabaseServer
    .from("onboarding")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching company info by id from Supabase:", error);
    throw new Error(error.message);
  }

  if (!data) return null;

  const companyInfo: CompanyInfo = {
    companyName: data.companyName ?? "",
    industryNiche: data.industry ?? "",
    productService: data.productService ?? "",
    audience: data.audience ?? "",
    // Not stored in the table – return sensible defaults
    mission: "",
    vision: "",
    statements: [],
  };

  return {
    id: data.id,
    companyInfo,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Get all company information entries
 *
 * @returns Promise with array of all company info entries
 *
 * TODO: Implement actual database query
 */
export async function getAllCompanyInfo(): Promise<SaveCompanyInfoResponse[]> {
  const { data, error } = await supabaseServer
    .from("onboarding")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching all company info from Supabase:", error);
    throw new Error(error.message);
  }

  return (
    data?.map((row) => {
      const companyInfo: CompanyInfo = {
        companyName: row.companyName ?? "",
        industryNiche: row.industry ?? "",
        productService: row.productService ?? "",
        audience: row.audience ?? "",
        mission: "",
        vision: "",
        statements: [],
      };

      return {
        id: row.id,
        companyInfo,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }) ?? []
  );
}

/**
 * Update company information
 *
 * @param id - The company information ID
 * @param companyInfo - The updated company information data
 * @returns Promise with the updated company info
 *
 * TODO: Implement actual database update
 */
export async function updateCompanyInfo(
  id: string,
  companyInfo: Partial<CompanyInfo>
): Promise<SaveCompanyInfoResponse> {
  const payload: Partial<CompanyInfoRow> = {
    companyName: companyInfo.companyName ?? null,
    industry: companyInfo.industryNiche ?? null,
    productService: companyInfo.productService ?? null,
    audience: companyInfo.audience ?? null,
  };

  const { data, error } = await supabaseServer
    .from("onboarding")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating company info in Supabase:", error);
    throw new Error(error.message);
  }

  const mergedCompanyInfo: CompanyInfo = {
    companyName: data.companyName ?? "",
    industryNiche: data.industry ?? "",
    productService: data.productService ?? "",
    audience: data.audience ?? "",
    mission: "",
    vision: "",
    statements: [],
  };

  return {
    id: data.id,
    companyInfo: mergedCompanyInfo,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Delete company information
 *
 * @param id - The company information ID to delete
 * @returns Promise with boolean indicating success
 *
 * TODO: Implement actual database deletion
 */
export async function deleteCompanyInfo(id: string): Promise<boolean> {
  const { error } = await supabaseServer
    .from("onboarding")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting company info from Supabase:", error);
    throw new Error(error.message);
  }

  return true;
}
