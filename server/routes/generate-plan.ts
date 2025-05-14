import { Router, Request, Response } from "express";
import multer from "multer";
import { PDFExtract } from "pdf.js-extract";
import { apiRequest } from "../lib/api";
import archiver from "archiver";
import { storage } from "../storage";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Define MulterRequest interface with file property from multer using any type to avoid complex typing issues
interface MulterRequest extends Request {
  file?: any; // Using any type to avoid complex typing issues with multer
}

// Helper function to create markdown content
const createMarkdownFile = (content: string): string => {
  return content.trim() + "\n";
};

async function generateFile(filename: string, requirements: string): Promise<string> {
  // More concise prompts that balance detail with performance
  const filePrompts: Record<string, string> = {
    'requirements.md': `You are a Senior Business Analyst creating a detailed requirements document for:

${requirements}

Create a detailed requirements document that ONLY addresses what's described above. Format as markdown with these sections:
1. Project Overview - Describe exactly what was requested
2. Functional Requirements - List all features mentioned
3. Non-Functional Requirements - Include any performance/technical requirements mentioned
4. Dependencies and Constraints - Note any limitations or integrations mentioned

Be specific and detailed but concise. Focus on clarity and actionable information.`,

    'prd.md': `You are a Product Manager creating a detailed PRD for:

${requirements}

Create a detailed PRD that ONLY addresses what's described above. Format as markdown with these sections:
1. Introduction - Describe exactly what was requested
2. Product Specifications - Detail the features mentioned
3. User Experience - Describe how users will interact with the system
4. Implementation Requirements - Note technical requirements mentioned

Be specific and detailed but practical. Focus on information developers need to implement the product.`,

    'techstack.md': `You are a Software Architect recommending technology choices for:

${requirements}

Recommend appropriate technologies that would work well for this specific project. Format as markdown with these sections:
1. Frontend Technologies - Appropriate for the described UI needs
2. Backend Technologies - Suitable for the described functionality
3. Database - Appropriate for the data requirements
4. Infrastructure - Deployment and hosting considerations

Focus on practical, maintainable choices that align with current best practices. Include brief justifications for major technology decisions.`,

    'backend.md': `You are a Backend Engineer designing an implementation guide for:

${requirements}

Create a practical backend implementation plan in markdown format with these sections:
1. Document Header - Include "Version: 1.0" and "Date: (today's date)"
2. API Design - Document key endpoints, methods, and payloads
3. Data Models - Outline essential database tables/collections with fields
4. Business Logic - Describe core backend processes
5. Security - Explain authentication and authorization approach
6. Performance - Suggest optimization strategies
7. Code Examples - Provide sample code for key functions

Focus on providing clear, usable guidance. Include practical code examples for the most important functionality.`,

    'frontend.md': `You are a Frontend Developer creating an implementation guide for:

${requirements}

Create a detailed frontend implementation guide specifically for this project. Format as markdown with these sections:
1. Component Structure - UI components needed for the described features
2. State Management - How to handle data for the described functionality
3. UI/UX Guidelines - Visual design considerations
4. Page Layouts - Key screens needed for the described features

Focus on providing actionable guidance with practical code examples for the most important components.`,

    'flow.md': `You are a Solutions Architect creating flow documentation for:

${requirements}

Create system flow documentation specifically for this project. Format as markdown with these sections:
1. User Workflows - How users will interact with the system
2. Data Flows - How data moves through the system
3. Integration Points - How components connect
4. Error Handling - How to manage failures

Include simple mermaid diagrams for the most critical flows (user journeys and data flows).
Focus on clarity and practical information that guides development.`,

    'status.md': `You are a Project Manager creating a project status template for:

${requirements}

Create a project status tracking template specifically for this project. Format as markdown with these sections:
1. Implementation Phases - Based on the specific features mentioned
2. Milestone Checklist - Concrete deliverables from the requirements
3. Testing Criteria - What needs to be tested based on the features
4. Deployment Stages - How this specific project should be deployed

Focus ONLY on the described project.`
  };

  const prompt = filePrompts[filename];
  
  console.log(`Using 8192 maxTokens for ${filename}`);
      
      const response = await apiRequest("POST", "/api/chat", {
        model: "gemini-2.5-pro-preview-05-06",  // Using Gemini 2.5 Pro Preview for better results
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        maxTokens: 8192
      });
      
      if (!response?.choices?.[0]?.message?.content) {
        throw new Error(`Failed to generate content for ${filename}`);
      }
  
      const content = response.choices[0].message.content;
      
      // Validate content isn't just asking for requirements
      if (content.includes("Please provide the requirements") || 
          content.includes("I need the requirements") ||
          content.includes("Because no specifications were provided")) {
        throw new Error(`Failed to generate valid content for ${filename}: Model is asking for more requirements`);
      }
      
      return content;
}

router.post("/", upload.single("file"), async (req: MulterRequest, res: Response) => {
  // --- START OF ROUTE HANDLER --- Log immediately after multer
  console.log("--- ENTERING /api/generate-plan ROUTE HANDLER ---");
  console.log(`Timestamp: ${new Date().toISOString()}`);
  
  try {
    // Set the content type for the response
    res.setHeader('Content-Type', 'application/json');
    
    // Process the file and text for plan generation
    let text = typeof req.body.text === 'string' ? req.body.text : '';
    const file = req.file;
    
    // Check requirements before proceeding
    const hasTextInput = text && text.trim() !== "";
    const hasFileUpload = !!file?.buffer && file.buffer.length > 0;
    
    if (!hasTextInput && !hasFileUpload) {
      return res.status(400).json({
        error: "No requirements provided",
        details: "Please provide requirements in the text field or upload a PDF file"
      });
    }
    
    // Initialize requirements from text input ONLY if it exists
    let finalRequirements = hasTextInput ? text : "";
    
    // For very short inputs, enhance the requirements to help the model generate better content
    if (finalRequirements.length < 100) {
      console.log(`Enhancing short input requirements (${finalRequirements.length} chars)`);
      finalRequirements = `${finalRequirements}\n\nPlease create a comprehensive implementation plan for this application concept. Consider standard features, user experience, and technical implementation details that would typically be needed for this type of application. Assume modern best practices and common user expectations for this kind of application.`;
      console.log(`Enhanced requirements length: ${finalRequirements.length} chars`);
    }
    
    // If a PDF file was uploaded, extract its text
    if (hasFileUpload) {
      try {
        console.log("Attempting to extract text from PDF file");
        const pdfExtractor = new PDFExtract();
        const isPdf = file?.mimetype === 'application/pdf';
        
        if (isPdf) {
          try {
            // Extract text
            const extractedData = await pdfExtractor.extractBuffer(file.buffer);
            
            // Process extracted pages
            let extractedText = extractedData.pages
              .map(page => page.content.map((item: any) => item.str).join(' '))
              .join('\n');
              
            console.log(`Successfully extracted ${extractedText.length} characters from PDF`);
            
            // If we already have text input, append PDF text with a separator
            if (hasTextInput) {
              finalRequirements += "\n\n--- EXTRACTED FROM PDF ---\n\n" + extractedText;
            } else {
              // Otherwise just use the PDF text
              finalRequirements = extractedText;
            }
          } catch (error) {
            console.error("Error extracting PDF text:", error);
            return res.status(400).json({
              error: "PDF extraction failed",
              details: "Could not extract text from the uploaded PDF. Please try a different file or enter requirements manually."
            });
          }
        } else {
          // Not a PDF file
          console.error("Uploaded file is not a PDF:", file?.mimetype);
          if (!hasTextInput) {
            // If we don't have text input, this is an error
            return res.status(400).json({
              error: "Invalid file type",
              details: "Only PDF files are supported for requirement uploads. Please upload a PDF or enter requirements manually."
            });
          }
        }
      } catch (error) {
        console.error("Error processing file upload:", error);
        if (!hasTextInput) {
          return res.status(400).json({
            error: "File processing failed",
            details: "Could not process the uploaded file. Please enter requirements manually."
          });
        }
      }
    }
    
    // Validate we have some requirements to work with
    if (!finalRequirements || finalRequirements.trim().length < 10) {
      return res.status(400).json({
        error: "Insufficient requirements",
        details: "Please provide more detailed requirements. The provided text is too short to generate a meaningful plan."
      });
    }
    
    // Generate files using AI
    const files: Record<string, string> = {};
    
    // Log the requirements we're using
    console.log(`\n--- Preparing to generate files with final requirements (length: ${finalRequirements.length}) ---\n${finalRequirements.substring(0, 500)}${finalRequirements.length > 500 ? '...' : ''}\n----------------------------------------------------------------------\n`);
    
    // Generate each file
    for (const fileName of ['requirements.md', 'prd.md', 'techstack.md', 'backend.md', 'frontend.md', 'flow.md', 'status.md']) {
      try {
        console.log(`Starting generation of ${fileName}...`);
        const content = await generateFile(fileName, finalRequirements);
        files[fileName.replace('.md', '')] = content;
        console.log(`Successfully generated ${fileName} (${content.length} chars)`);
      } catch (error) {
        console.error(`Error generating ${fileName}:`, error);
        return res.status(500).json({
          error: `Failed to generate ${fileName}`,
          details: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }
    
    // Create a ZIP file with all the generated Markdown files
    const archive = archiver('zip', { zlib: { level: 9 } });
    const chunks: Buffer[] = [];
    
    archive.on('data', (chunk) => chunks.push(chunk));
    
    // Set up archive completion handler
    archive.on('finish', async () => {
      const zipBuffer = Buffer.concat(chunks);
      console.log(`ZIP generated: ${zipBuffer.length} bytes`);

      // Return success response with explicit content type
      res.setHeader('Content-Type', 'application/json');
      return res.json({
        files,
        zipBuffer: zipBuffer.toString('base64')
      });
    });
    
    archive.on('error', (err) => {
      console.error("Archive error:", err);
      throw err;
    });

    // Add files to archive
    Object.entries(files).forEach(([name, content]) => {
      archive.append(createMarkdownFile(content), { name: `Instructions/${name}.md` });
    });

    // Add .cursorrules file
    const cursorRules = `# Cursor AI Rules and Guidelines

## General Rules
- Always read and understand all documentation files before starting implementation
- Follow the PRD step by step
- Keep the project structure organized
- Update status.md after completing each step
- Ask for clarification when requirements are unclear

## File Purposes
- requirements.md: Source of truth for project requirements
- prd.md: Product specification and features
- techstack.md: Technical decisions and architecture
- backend.md: Backend implementation guide
- frontend.md: Frontend implementation guide
- flow.md: System and user flow documentation
- status.md: Progress tracking and milestones

## Best Practices
- Maintain consistent code style
- Write clear comments and documentation
- Follow the defined architecture
- Test thoroughly before marking tasks complete
- Keep the status.md file updated`;
    
    archive.append(createMarkdownFile(cursorRules), { name: 'Instructions/.cursorrules' });

    try {
      await archive.finalize();
    } catch (error) {
      console.error("Error finalizing archive:", error);
      throw error;
    }

    // Don't return a response here - the response is sent in the archive.on('finish') handler above
    console.log("Archive finalization started - waiting for finish event to send response");
    
    // This is a placeholder return that won't be reached - the real response happens in the 'finish' event
    return res; 
  } catch (error: any) {
    console.error("Error in route handler:", error);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({
      error: "Failed to process request",
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