import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import fs from 'fs/promises'
import path from 'path'

// Define the Tool type for our data
type Tool = { id: string; name: string; /* add all other fields from your JSON */ };

const MODEL_NAME = "gemini-1.5-flash-latest";
const API_KEY = process.env.GEMINI_API_KEY!;

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(API_KEY);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const toolAId = searchParams.get('toolA')
  const toolBId = searchParams.get('toolB')

  if (!toolAId || !toolBId) {
    return NextResponse.json({ error: 'Missing tool IDs' }, { status: 400 })
  }

  try {
    // 1. Read the tools.json file from the CORRECT location
    const filePath = path.join(process.cwd(), 'public', 'tools.json'); // <--- THE FIX IS HERE
    const jsonData = await fs.readFile(filePath, 'utf-8');
    const tools: Tool[] = JSON.parse(jsonData);

    // 2. Find the data for the two requested tools
    const toolAData = tools.find(tool => tool.id === toolAId);
    const toolBData = tools.find(tool => tool.id === toolBId);

    if (!toolAData || !toolBData) {
      return NextResponse.json({ error: 'One or both tools not found' }, { status: 404 });
    }

    // 3. Construct the detailed prompt for the AI
    const prompt = `
      You are an expert AI software analyst. Based on the JSON data below for two AI tools, generate a detailed comparison.

      Tool A Data:
      ${JSON.stringify(toolAData, null, 2)}

      Tool B Data:
      ${JSON.stringify(toolBData, null, 2)}

      Your response MUST be a valid JSON object with the following exact structure. Do not include markdown formatting like \`\`\`json.
      {
        "summary": "A brief, neutral paragraph summarizing the key differences and who each tool is best for.",
        "tableData": [
          { "feature": "Pricing Model", "toolA": "...", "toolB": "..." },
          { "feature": "Best For", "toolA": "...", "toolB": "..." },
          { "feature": "Output Quality (Rating)", "toolA": "...", "toolB": "..." },
          { "feature": "Key Pro", "toolA": "...", "toolB": "..." }
        ],
        "verdict": "Your final recommendation on which tool is better for specific user types, explaining why."
      }
    `;

    // 4. Call the Gemini API
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const aiResponseText = response.text();

    if (!aiResponseText) {
      throw new Error('No content in AI response');
    }

    // 5. Parse and return the structured JSON response
    const comparisonJson = JSON.parse(aiResponseText);
    return NextResponse.json(comparisonJson);

  } catch (error) {
    console.error('Error in compare API:', error);
    return NextResponse.json({ error: 'Failed to generate comparison' }, { status: 500 });
  }
}