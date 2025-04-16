import { Router, Request } from "express";
import multer from "multer";
import { PDFExtract } from "pdf.js-extract";
import { apiRequest } from "../lib/api";
import archiver from "archiver";
import { storage } from "../storage";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// Helper function to create markdown content
const createMarkdownFile = (content: string): string => {
  return content.trim() + "\n";
};

async function generateFile(filename: string, requirements: string): Promise<string> {
  // Enhanced prompts that focus specifically on the user's input
  const filePrompts: Record<string, string> = {
    'requirements.md': `You are a Business Analyst creating a requirements document for this specific project:

${requirements}

Create a detailed requirements document that ONLY addresses what's described above. Format as markdown with these sections:
1. Project Overview - Describe exactly what was requested
2. Functional Requirements - List all features mentioned
3. Non-Functional Requirements - Include any performance/technical requirements mentioned
4. Dependencies and Constraints - Note any limitations or integrations mentioned

Be specific and concrete. Do NOT invent requirements not mentioned in the input.`,

    'prd.md': `You are a Product Manager creating a PRD for this specific project:

${requirements}

Create a detailed PRD that ONLY addresses what's described above. Format as markdown with these sections:
1. Introduction - Describe exactly what was requested
2. Product Specifications - Detail the features mentioned
3. User Experience - Describe how users will interact with the system
4. Implementation Requirements - Note technical requirements mentioned

Be specific and concrete. Do NOT invent features not mentioned in the input.`,

    'techstack.md': `You are a Technical Architect recommending technologies for this specific project:

${requirements}

Recommend appropriate technologies that would work well for this specific project. Format as markdown with these sections:
1. Frontend Technologies - Appropriate for the described UI needs
2. Backend Technologies - Suitable for the described functionality
3. Database - Appropriate for the data requirements
4. Infrastructure - Deployment and hosting considerations

Justify each recommendation based on the specific project requirements.`,

    'backend.md': `You are a Backend Developer detailing implementation for this specific project:

${requirements}

Create a detailed backend implementation guide specifically for this project. Format as markdown with these sections:
1. API Design - Endpoints needed for the described functionality
2. Data Models - Database schema based on the requirements
3. Business Logic - Core backend processes needed
4. Security Considerations - Authentication and authorization needs

Focus ONLY on what's needed for the described project.`,

    'frontend.md': `You are a Frontend Developer detailing implementation for this specific project:

${requirements}

Create a detailed frontend implementation guide specifically for this project. Format as markdown with these sections:
1. Component Structure - UI components needed for the described features
2. State Management - How to handle data for the described functionality
3. UI/UX Guidelines - Visual design considerations
4. Page Layouts - Key screens needed for the described features

Focus ONLY on what's needed for the described project.`,

    'flow.md': `You are a System Architect documenting flows for this specific project:

${requirements}

Create system flow documentation specifically for this project. Format as markdown with these sections:
1. User Workflows - How users will interact with the system
2. Data Flows - How data moves through the system
3. Integration Points - How components connect
4. Error Handling - How to manage failures

Include simple mermaid diagrams where helpful. Focus ONLY on the described project.`,

    'status.md': `You are a Project Manager creating a status template for this specific project:

${requirements}

Create a project status tracking template specifically for this project. Format as markdown with these sections:
1. Implementation Phases - Based on the specific features mentioned
2. Milestone Checklist - Concrete deliverables from the requirements
3. Testing Criteria - What needs to be tested based on the features
4. Deployment Stages - How this specific project should be deployed

Focus ONLY on the described project.`
  };

  const prompt = filePrompts[filename];
  
  try {
    console.log(`Generating ${filename} with prompt length: ${prompt.length}`);
    
    const response = await apiRequest("POST", "/api/chat", {
      model: "gemini-1.5-flash-002",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      maxTokens: 4096
    });

    if (!response?.choices?.[0]?.message?.content) {
      throw new Error(`Failed to generate content for ${filename}`);
    }

    const content = response.choices[0].message.content;
    
    // Validate content isn't just asking for requirements
    if (content.includes("Please provide the requirements") || 
        content.includes("I need the requirements") ||
        content.includes("Because no specifications were provided")) {
      throw new Error(`Generated content for ${filename} is requesting requirements instead of providing content`);
    }
    
    return content;
  } catch (error) {
    console.error(`Error generating ${filename}:`, error);
    throw error;
  }
}

router.post("/", upload.single("file"), async (req: MulterRequest, res) => {
  try {
    // Set the content type for the response
    res.setHeader('Content-Type', 'application/json');
    
    // Debug incoming request
    console.log("Received request body:", req.body);
    console.log("Received file:", req.file ? "Yes" : "No");
    
    // Get requirements from form data
    let requirements = req.body.text || "";
    console.log("Raw requirements:", requirements);
    
    // Check if requirements are provided
    if (!requirements || requirements.trim() === "") {
      console.error("No requirements provided in text field");
      return res.status(400).json({
        error: "No requirements provided",
        details: "Please provide requirements in the text field"
      });
    }

    // If a PDF file was uploaded, extract its text
    if (req.file?.buffer) {
      try {
        console.log("Processing PDF file...");
        const pdfExtract = new PDFExtract();
        const data = await pdfExtract.extractBuffer(req.file.buffer);
        const pdfText = data.pages.map(page => page.content).join("\n");
        requirements += "\n" + pdfText;
        console.log("PDF text extracted successfully");
      } catch (error) {
        console.error("PDF extraction error:", error);
        return res.status(400).json({
          error: "Failed to process PDF file",
          details: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }

    console.log("Final requirements text:", requirements);

    // Generate files one by one
    const files: Record<string, string> = {};
    const fileNames = ['requirements.md', 'prd.md', 'techstack.md', 'backend.md', 'frontend.md', 'flow.md', 'status.md'];

    for (const fileName of fileNames) {
      try {
        console.log(`Starting generation of ${fileName}...`);
        const content = await generateFile(fileName, requirements);
        console.log(`Successfully generated ${fileName} (${content.length} chars)`);
        files[fileName.replace('.md', '')] = content;
      } catch (error) {
        console.error(`Error generating ${fileName}:`, error);
        return res.status(500).json({
          error: `Failed to generate ${fileName}`,
          details: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }

    // Create zip archive
    const archive = archiver('zip', { zlib: { level: 9 } });
    const chunks: any[] = [];
    
    archive.on('data', (chunk) => chunks.push(chunk));
    archive.on('finish', async () => {
      const zipBuffer = Buffer.concat(chunks);
      console.log(`ZIP generated: ${zipBuffer.length} bytes`);
      
      // Return the generated files
      return res.json({
        files,
        zipBuffer: zipBuffer.toString('base64'),
      });
    });
    
    // Add each file to the zip
    for (const [name, content] of Object.entries(files)) {
      archive.append(content, { name: `${name}.md` });
    }
    
    // Finalize the archive
    archive.finalize();
    
  } catch (error) {
    console.error("Error in generate-plan:", error);
    return res.status(500).json({
      error: "Failed to generate plan",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Route to get the latest plan as a zip file
router.get("/", async (req, res) => {
  try {
    // Return a helpful error instructing to use the POST endpoint
    return res.status(400).json({
      error: "Invalid request method",
      details: "To generate a plan, use POST with your project requirements"
    });
  } catch (error) {
    console.error("Error getting latest plan:", error);
    return res.status(500).json({
      error: "Failed to get latest plan",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

export default router;