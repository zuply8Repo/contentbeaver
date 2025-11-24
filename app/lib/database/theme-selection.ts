import { supabaseServer } from '@/app/lib/supabaseServer';
import { ThemeData, ThemeOption } from '@/app/ui/input/types';

/**
 * Database Service Layer for Theme Selection
 * 
 * Handles fetching and updating theme data from Supabase 'themes' table
 * 
 * Table structure:
 * - id: string (primary key)
 * - created_at: timestamp
 * - theme1: text (theme description)
 * - theme2: text (theme description)
 * - theme3: text (theme description)
 * - selected_theme: text (stores "theme1", "theme2", or "theme3")
 */

export interface GetThemesResult {
  id: string;
  created_at: string;
  themes: ThemeOption[];
  selectedTheme: string | null;
}

/**
 * Get theme data from the database
 * 
 * @returns Promise with theme data including all available themes and current selection
 */
export async function getThemes(): Promise<GetThemesResult> {
  try {
    // Fetch the first row from themes table (global setting)
    const { data, error } = await supabaseServer
      .from('themes')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching themes:', error);
      throw new Error(`Failed to fetch themes: ${error.message}`);
    }

    if (!data) {
      throw new Error('No themes found in database');
    }

    // Transform the data into ThemeOption array
    // Note: All themes share the same ID (the database row ID)
    const themes: ThemeOption[] = [
      {
        id: data.id, // Use actual database row ID
        text: data.theme1 || '',
        columnName: 'theme1',
      },
      {
        id: data.id, // Use actual database row ID
        text: data.theme2 || '',
        columnName: 'theme2',
      },
      {
        id: data.id, // Use actual database row ID
        text: data.theme3 || '',
        columnName: 'theme3',
      },
    ].filter(theme => theme.text !== ''); // Remove empty themes

    console.log('📊 [getThemes] Fetched themes from database:', {
      databaseRowId: data.id,
      themesCount: themes.length,
      selectedTheme: data.selected_theme,
    });

    return {
      id: data.id,
      created_at: data.created_at,
      themes,
      selectedTheme: data.selected_theme || null,
    };
  } catch (error) {
    console.error('Error in getThemes:', error);
    throw error;
  }
}

/**
 * Update the selected theme in the database
 * 
 * @param selectedTheme - The column name of the selected theme ("theme1", "theme2", or "theme3")
 * @returns Promise with updated theme data
 */
export async function updateSelectedTheme(
  selectedTheme: string
): Promise<{ id: string; selectedTheme: string; updatedAt: string }> {
  try {
    // Validate the selected theme
    if (!['theme1', 'theme2', 'theme3'].includes(selectedTheme)) {
      throw new Error('Invalid theme selection. Must be "theme1", "theme2", or "theme3"');
    }

    // Get the current theme row
    const { data: currentData, error: fetchError } = await supabaseServer
      .from('themes')
      .select('id')
      .limit(1)
      .single();

    if (fetchError) {
      console.error('Error fetching current theme:', fetchError);
      throw new Error(`Failed to fetch current theme: ${fetchError.message}`);
    }

    if (!currentData) {
      throw new Error('No theme record found in database');
    }

    // Update the selected_theme column
    const { data, error } = await supabaseServer
      .from('themes')
      .update({ selected_theme: selectedTheme })
      .eq('id', currentData.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating selected theme:', error);
      throw new Error(`Failed to update selected theme: ${error.message}`);
    }

    console.log('✅ Theme selection updated:', data);

    return {
      id: data.id,
      selectedTheme: data.selected_theme,
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error in updateSelectedTheme:', error);
    throw error;
  }
}

