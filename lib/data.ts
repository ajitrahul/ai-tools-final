import fs from 'fs/promises';
import path from 'path';

// Define the full Tool type once, in one place
export type Tool = {
  id: string;
  name: string;
  logo_url: string;
  tagline: string;
  website_url: string;
  category: string[];
  pricing: { model: string; details: string; };
  pros: string[];
  cons: string[];
  best_for: string[];
  full_description: string;
  features: string[];
  rating: { overall: number; ease_of_use: number; output_quality: number; value: number; };
};

// The single source of truth for fetching our tools data
export async function getTools(): Promise<Tool[]> {
  // Correct path pointing to the public folder
  const filePath = path.join(process.cwd(), 'public', 'tools.json');
  try {
    const jsonData = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(jsonData);
  } catch (error) {
    console.error("Could not read tools.json:", error);
    return [];
  }
}