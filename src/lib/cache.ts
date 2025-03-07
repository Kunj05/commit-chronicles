// src/lib/cache.ts
import { supabase } from './supabaseClient';

// Save data to Supabase cache
export const setCachedData = async (key: string, data: any) => {
  const { error } = await supabase
    .from('commit_cache')
    .upsert({ key, data, timestamp: new Date().toISOString() }); // Use upsert instead of insert

  if (error) {
    console.error('Error saving data to Supabase:', error);
    throw error;
  }
};

// Retrieve data from Supabase cache
// Retrieve data from Supabase cache
export const getCachedData = async (key: string): Promise<any | null> => {
  const { data, error } = await supabase
    .from('commit_cache')
    .select('data') // Only fetch the data column
    .eq('key', key)
    .single(); // Ensure only one row is returned

  if (error) {
    if (error.code === 'PGRST116') {
      console.log('No cached data found for key:', key);
    } else {
      console.error('Error fetching data from Supabase:', error);
    }
    return null;
  }

  // Always return cached data if it exists
  if (data) {
    console.log('Returning cached data for key:', key);
    return data.data;
  }

  return null; // Return null if no data is found
};