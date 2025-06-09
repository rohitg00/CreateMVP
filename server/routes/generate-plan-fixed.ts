import { Router, Request, Response } from "express";
import multer from "multer";
import { PDFExtract } from "pdf.js-extract";
// API request functionality removed for self-hosted version
import archiver from "archiver";
import { storage } from "../storage";
import * as Express from "express"; // For properly typed Express Request/Response
import crypto from "crypto";

// API Key type definition
interface ApiKey {
  id: number;
  userId: number;
  provider: string;
  key: string;
  isUserProvided: boolean;
  createdAt: Date | null; // Allow null for compatibility
}

// Add Gemini API Response type definition
interface GeminiApiResponseChoiceMessage {
  role: string;
  content: string;
}

interface GeminiApiResponseChoice {
  message: GeminiApiResponseChoiceMessage;
  // Add other properties like finishReason, index if they exist
}

interface GeminiApiResponse {
  choices: GeminiApiResponseChoice[];
  // Add other top-level properties from the API response if they exist
}

// Helper function to get a system API key for a specific provider
async function getSystemApiKey(provider: string): Promise<ApiKey | null> {
  try {
    // Try to find a system API key for this provider
    const keys = await storage.getSystemApiKeys();
    return keys.find(key => key.provider === provider) || null;
  } catch (error) {
    console.error(`Error getting system API key for ${provider}:`, error);
    return null;
  }
}

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Simplified request interface for self-hosted version
interface SimpleRequest extends Express.Request {
  body: any;
  file?: any;
}

// Simplified user ID function for self-hosted version
function getUserId(req: any): number {
  // Self-hosted version always uses default user ID
  console.log("Self-hosted version: using default user ID 1");
  return 1;
}

interface MulterRequest extends Express.Request {
  file?: any; // This lets us work with the multer file without TypeScript errors
  body: any;
}

// Helper function to create markdown content
const createMarkdownFile = (content: string): string => {
  return content.trim() + "\n";
};

/**
 * Generate a hash from requirements text to uniquely identify a generation
 */
function generateRequirementsHash(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex');
}

const MAX_FINAL_REQUIREMENTS_LENGTH = 4000; // Characters

async function summarizeRequirements(requirementsText: string): Promise<string> {
  console.log(`Summarizing requirements of length ${requirementsText.length} as it exceeds ${MAX_FINAL_REQUIREMENTS_LENGTH} chars.`);
  const prompt = `Please summarize the following detailed project requirements into a concise version that captures the absolute critical features, goals, and user needs. Aim for a summary that is significantly shorter but still provides enough information for a development team to understand the core request. Be direct and retain essential details. Avoid conversational fluff. Original requirements:\\n\\n---\\n${requirementsText}\\n---\\n\\nConcise Summary:`;

  try {
    const systemKey = await getSystemApiKey("google");
    console.log(`Using ${systemKey ? 'system' : 'default'} API key for Google model (summarization)`);

    const originalGoogleKey = process.env.GOOGLE_API_KEY;
    if (systemKey) {
      process.env.GOOGLE_API_KEY = systemKey.key;
    }

    try {
      const timeoutMilliseconds = 45000; // 45 seconds for summarization
      console.log(`Setting timeout of ${timeoutMilliseconds / 1000} seconds for summarization.`);

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`Summarization request timed out`)), timeoutMilliseconds);
      });

      const raceResult = await Promise.race([
        fetch("http://localhost:5001/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "gemini-2.5-flash-preview-04-17", 
            messages: [{ role: "user", content: prompt }],
            temperature: 0.5, // Slightly lower temperature for more factual summary
            maxTokens: 1024 // Max tokens for the summary itself
          })
        }).then(res => res.json()),
        timeoutPromise
      ]);

      process.env.GOOGLE_API_KEY = originalGoogleKey;

      if (raceResult instanceof Error) {
        console.error(`Error or timeout during summarization:`, raceResult.message);
        throw raceResult; // Rethrow to be caught by the caller
      }

      const response = raceResult as any;
      
      let summary = '';
      if (response?.response) {
        summary = response.response;
      } else if (response?.choices?.[0]?.message?.content) {
        summary = response.choices[0].message.content;
      } else if (response?.content) {
        summary = response.content;
      } else if (typeof response === 'string') {
        summary = response;
      } else if (response?.error) {
        throw new Error(`API error: ${response.error}`);
      } else {
        console.error(`Unexpected response format for summarization:`, response);
        throw new Error(`Failed to generate summary (unexpected response format)`);
      }
      
      if (!summary || summary.trim().length === 0) {
        console.error(`Empty summary generated`);
        throw new Error(`Failed to generate summary (empty content)`);
      }
      
      summary = summary.trim();
      console.log(`Successfully summarized requirements. Original length: ${requirementsText.length}, Summary length: ${summary.length}`);
      return summary;

    } catch (innerError) {
      process.env.GOOGLE_API_KEY = originalGoogleKey;
      console.error(`Inner error during summarization API call:`, innerError);
      throw innerError;
    }
  } catch (error) {
    console.error(`Error summarizing requirements: `, error);
    // Fallback: if summarization fails, return original text but log the error
    // This prevents summarization failure from blocking the whole process, but may lead to original timeout issues.
    // Alternatively, could throw error and stop the request: throw new Error("Failed to summarize requirements, cannot proceed.");
    console.warn("Summarization failed. Proceeding with original long requirements text.");
    return requirementsText; 
  }
}

async function generateFile(filename: string, requirements: string): Promise<string> {
  // This is basic version of prompts that balance detail with performance for open source version for more advanced version goto https://createmvps.app
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
  
  try {
    console.log(`Generating ${filename} with prompt length: ${prompt.length}`);
    
    // Get a system API key for Google Gemini if possible
    const systemKey = await getSystemApiKey("google");
    console.log(`Using ${systemKey ? 'system' : 'default'} API key for Google model`);
    
    // Temporarily set Google API key in environment if we have one
    const originalGoogleKey = process.env.GOOGLE_API_KEY;
    if (systemKey) {
      process.env.GOOGLE_API_KEY = systemKey.key;
    }
    
    try {
      // Set up a timeout promise for the API request with longer timeout for more complex files
      const timeoutMilliseconds = ['backend.md', 'frontend.md', 'techstack.md'].includes(filename) 
        ? 150000  // 150 seconds for more complex documents
        : 120000; // 120 seconds for other documents (e.g., requirements.md)
      
      console.log(`Setting timeout of ${timeoutMilliseconds/1000} seconds for ${filename}`);
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`Request timed out for ${filename}`)), timeoutMilliseconds);
      });
      
      // Race the API request against the timeout
      // For more complex documents, we need to allocate more tokens
      const maxTokens = ['backend.md', 'frontend.md', 'techstack.md'].includes(filename)
        ? 8192  // More tokens for complex technical documents
        : 4096; // Standard token count for other documents
        
      console.log(`Using ${maxTokens} maxTokens for ${filename}`);
      
      const raceResult = await Promise.race([
        fetch("http://localhost:5001/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "gemini-2.5-flash-preview-04-17",  // Using Gemini 2.5 Flash Preview for better results
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            maxTokens: maxTokens
          })
        }).then(res => res.json()),
        timeoutPromise
      ]);
      
      // Restore original environment variable
      process.env.GOOGLE_API_KEY = originalGoogleKey;

      if (raceResult instanceof Error) {
        console.error(`Error or timeout for ${filename}:`, raceResult.message);
        if (raceResult.message.includes(`Request timed out for ${filename}`)) {
          console.log(`Generating fallback content for ${filename} due to timeout`);
          // Return a simpler fallback content for this file
          return `# ${filename.replace('.md', '').toUpperCase()} \n\n## Note: Content generation timed out.`;
        }
        throw raceResult;
      }
      
      const response = raceResult as any;
      
      let content = '';
      if (response?.response) {
        content = response.response;
      } else if (response?.choices?.[0]?.message?.content) {
        content = response.choices[0].message.content;
      } else if (response?.content) {
        content = response.content;
      } else if (typeof response === 'string') {
        content = response;
      } else if (response?.error) {
        throw new Error(`API error: ${response.error}`);
      } else {
        console.error(`Unexpected response format for ${filename}:`, response);
        throw new Error(`Failed to generate content for ${filename} (unexpected response format)`);
      }
      
      if (!content || content.trim().length === 0) {
        console.error(`Empty content generated for ${filename}`);
        throw new Error(`Failed to generate content for ${filename} (empty content)`);
      }
      
      // Validate content isn't just asking for requirements
      if (content.includes("Please provide the requirements") || 
          content.includes("I need the requirements") ||
          content.includes("Because no specifications were provided")) {
        throw new Error(`Generated content for ${filename} is requesting requirements instead of providing content`);
      }
      
      return content;
    } catch (innerError) {
      // Restore original environment variable in case of error
      process.env.GOOGLE_API_KEY = originalGoogleKey;
      throw innerError;
    }
  } catch (error) {
    console.error(`Error generating ${filename}:`, error);
    throw error;
  }
}

router.post("/", upload.single("file"), async (req: Express.Request, res: Express.Response) => {
  // Get multer file from request
  const multerReq = req as Express.Request & { file?: any };
  
  // --- START OF ROUTE HANDLER --- Log immediately after multer
  console.log("--- ENTERING /api/generate-plan ROUTE HANDLER ---");
  console.log(`Timestamp: ${new Date().toISOString()}`);
  
  try {
    // Set the content type for the response
    res.setHeader('Content-Type', 'application/json');
    
    console.log("Self-hosted version - skipping authentication check");

    // Self-hosted version - create a default user for plan generation
    let user = {
      id: 1,
      username: 'self-hosted-user',
      email: 'user@localhost'
    };
    console.log(`Using default self-hosted user - User ID: ${user.id}`);
    
    // Process the file and text for plan generation
    let text = typeof req.body.text === 'string' ? req.body.text : '';
    const file = multerReq.file;
    
    // Start processing the actual generation request
    return await processGenerationRequest(req, res, user, text, file);
    
  } catch (error: any) {
    console.error("Error in route handler:", error);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({
      error: "Failed to process request",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}); // Close the route handler

// Process generation request with authenticated user
async function processGenerationRequest(req: Express.Request, res: Express.Response, user: any, text: string, file?: any): Promise<Express.Response> {
  // Start a timer to measure generation performance
  const startTime = Date.now();
  console.log(`[MVP Generation] Starting generation for user ${user.id} at ${new Date().toISOString()}`);
  console.log("Text input length:", text.length);
  console.log("File present:", !!file);
  
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
          // Convert buffer to temp data URL
          const dataBuffer = file.buffer;
          // Extract text
          const extractedData = await pdfExtractor.extractBuffer(dataBuffer, {});
          
          // Process extracted pages
          let extractedText = extractedData.pages
            .map(page => page.content.map(item => item.str).join(' '))
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
          }); // Return error response for PDF processing issues
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
        } // Otherwise, we just stick with the original text input.
      }
    } catch (error) {
      console.error("Error processing file upload:", error);
      if (!hasTextInput) {
        return res.status(400).json({
          error: "File processing failed",
          details: "Could not process the uploaded file. Please enter requirements manually."
        });
      } // Otherwise, log error but continue with text input
    }
  }
  
  // Validate we have some requirements to work with
  if (!finalRequirements || finalRequirements.trim().length < 10) {
    return res.status(400).json({
      error: "Insufficient requirements",
      details: "Please provide more detailed requirements. The provided text is too short to generate a meaningful plan."
    });
  }
  
  // Summarize finalRequirements if they are too long
  if (finalRequirements.length > MAX_FINAL_REQUIREMENTS_LENGTH) {
    try {
      const summarizedRequirements = await summarizeRequirements(finalRequirements);
      console.log(`Original requirements length: ${finalRequirements.length}, Summarized to: ${summarizedRequirements.length}`);
      finalRequirements = summarizedRequirements;
    } catch (summarizationError) {
      console.error("Failed to summarize requirements, proceeding with original but this may cause issues:", summarizationError);
      // Optional: return an error to the user if summarization is critical and fails
      // return res.status(500).json({ error: "Failed to process lengthy requirements. Please try a shorter prompt.", details: summarizationError.message });
    }
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
  const chunks: any[] = [];
  
  archive.on('data', (chunk) => chunks.push(chunk));
  
  // Set up archive completion handler
  archive.on('finish', async () => {
    const zipBuffer = Buffer.concat(chunks);
    console.log(`ZIP generated: ${zipBuffer.length} bytes`);

    // Generate hash from the requirements text
    const requirementsHash = generateRequirementsHash(finalRequirements);
    console.log(`Generated requirements hash: ${requirementsHash}`);
    
    // Store variable outside of try/catch to be accessible in credit deduction logic
    let createdPlan = null;
    
    try {
      console.log(`Plan generation tracking disabled in self-hosted version`);
    } catch (error) {
      // Log but don't fail the request if storage fails
      console.error(`Error storing plan in database:`, error);
    }

    console.log(`Generating plan for user ${user.id} (unlimited usage in self-hosted version)`);
    
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

  // Add Cursor Project Rules in new MDC format
  
  // Main implementation rule (always applied)
  const implementationRule = `---
description: Core implementation guidelines for the project
alwaysApply: true
---

# Project Implementation Guidelines

You are implementing a project based on the provided documentation files. Follow these core principles:

## Documentation-First Approach
- Always read and understand ALL documentation files before starting implementation
- Refer to requirements.md as the source of truth for project requirements  
- Follow the PRD (prd.md) step by step for feature development
- Use techstack.md for technology decisions and architecture guidance
- Consult backend.md and frontend.md for implementation specifics

## Project Organization
- Keep the project structure organized and follow established patterns
- Update status.md after completing each major milestone or task
- Document any deviations from the original plan with clear reasoning
- Ask for clarification when requirements are unclear or conflicting

## Quality Standards
- Write clean, maintainable, and well-documented code
- Follow the defined architecture and design patterns
- Implement proper error handling and validation
- Test thoroughly before marking tasks complete
- Use meaningful variable and function names

## File References
@requirements.md
@prd.md
@techstack.md
@backend.md
@frontend.md
@flow.md
@status.md`;

  // Frontend-specific rules
  const frontendRule = `---
description: Frontend development guidelines and best practices
globs: ["**/*.tsx", "**/*.jsx", "**/*.css", "**/*.scss", "**/*.js", "**/*.ts", "**/components/**", "**/pages/**", "**/styles/**"]
alwaysApply: false
---

# Frontend Development Rules

When working on frontend components and pages:

## Component Development
- Create reusable, modular components following the component structure outlined in frontend.md
- Use TypeScript for type safety and better development experience
- Implement proper state management as specified in the documentation
- Follow the UI/UX guidelines provided in the project documentation

## Styling Guidelines
- Use the CSS framework/approach specified in techstack.md
- Maintain consistent styling patterns throughout the application
- Implement responsive design for mobile and desktop viewports
- Follow accessibility best practices (ARIA labels, semantic HTML)

## Performance Best Practices
- Optimize bundle size and implement code splitting where appropriate
- Use lazy loading for routes and heavy components
- Optimize images and assets
- Implement proper caching strategies

## Testing
- Write unit tests for complex components and utilities
- Test user interactions and edge cases
- Ensure cross-browser compatibility

@frontend.md
@techstack.md
@prd.md`;

  // Backend-specific rules
  const backendRule = `---
description: Backend development guidelines and API implementation
globs: ["**/*.py", "**/*.js", "**/*.ts", "**/api/**", "**/server/**", "**/models/**", "**/routes/**", "**/controllers/**"]
alwaysApply: false
---

# Backend Development Rules

When implementing backend functionality:

## API Development
- Follow the API design patterns outlined in backend.md
- Implement proper HTTP status codes and error responses
- Use consistent naming conventions for endpoints
- Document API endpoints with clear request/response examples

## Data Management
- Implement the data models as specified in backend.md
- Use proper database indexing and query optimization
- Implement data validation and sanitization
- Handle database migrations properly

## Security Implementation
- Follow the security guidelines outlined in the backend documentation
- Implement proper authentication and authorization
- Validate and sanitize all user inputs
- Use environment variables for sensitive configuration

## Performance & Scalability
- Implement caching strategies where appropriate
- Use async/await patterns for non-blocking operations
- Monitor and log application performance
- Design for horizontal scaling if specified

@backend.md
@techstack.md
@flow.md`;

  // Database and API rules
  const databaseRule = `---
description: Database design and API integration guidelines
globs: ["**/models/**", "**/migrations/**", "**/database/**", "**/api/**", "**/*.sql"]
alwaysApply: false
---

# Database & API Guidelines

When working with data persistence and external APIs:

## Database Design
- Follow the data model specifications in backend.md
- Implement proper relationships and constraints
- Use appropriate data types and indexing strategies
- Plan for data migration and versioning

## API Integration
- Implement error handling for external API calls
- Use proper timeout and retry strategies
- Cache API responses when appropriate
- Handle rate limiting gracefully

## Data Security
- Implement proper data encryption for sensitive information
- Follow GDPR/privacy compliance requirements if applicable
- Use parameterized queries to prevent SQL injection
- Implement proper backup and recovery procedures

@backend.md
@flow.md`;

  // Testing and quality rules
  const testingRule = `---
description: Testing guidelines and quality assurance practices
globs: ["**/*.test.*", "**/*.spec.*", "**/tests/**", "**/test/**"]
alwaysApply: false
---

# Testing & Quality Assurance

When writing tests and ensuring code quality:

## Testing Strategy
- Follow the testing criteria outlined in status.md
- Write unit tests for business logic and utilities
- Implement integration tests for API endpoints
- Add end-to-end tests for critical user workflows

## Test Organization
- Organize tests in a logical directory structure
- Use descriptive test names that explain the scenario
- Mock external dependencies and services
- Maintain test data and fixtures properly

## Quality Gates
- Ensure all tests pass before merging code
- Maintain adequate code coverage (aim for 80%+)
- Run linting and code formatting tools
- Test edge cases and error scenarios

@status.md
@flow.md`;

  // Documentation rules
  const documentationRule = `---
description: Documentation maintenance and updates
globs: ["**/*.md", "**/docs/**", "**/README*"]
alwaysApply: false
---

# Documentation Guidelines

When updating or creating documentation:

## Documentation Maintenance
- Keep all documentation files up to date with implementation changes
- Update status.md regularly to reflect current progress
- Document any architectural decisions or deviations from the original plan
- Include code examples and usage instructions where helpful

## API Documentation
- Document all API endpoints with request/response examples
- Include authentication requirements and error codes
- Provide integration examples for common use cases
- Keep API versioning information current

## User Documentation
- Write clear setup and installation instructions
- Provide troubleshooting guides for common issues
- Include configuration options and environment setup
- Create user guides for key features

@requirements.md
@prd.md
@status.md`;

  // Add all rule files to the archive
  archive.append(createMarkdownFile(implementationRule), { name: '.cursor/rules/implementation.mdc' });
  archive.append(createMarkdownFile(frontendRule), { name: '.cursor/rules/frontend.mdc' });
  archive.append(createMarkdownFile(backendRule), { name: '.cursor/rules/backend.mdc' });
  archive.append(createMarkdownFile(databaseRule), { name: '.cursor/rules/database.mdc' });
  archive.append(createMarkdownFile(testingRule), { name: '.cursor/rules/testing.mdc' });
  archive.append(createMarkdownFile(documentationRule), { name: '.cursor/rules/documentation.mdc' });

  try {
    await archive.finalize();
  } catch (error) {
    console.error("Error finalizing archive:", error);
    throw error;
  }

  // Don't return a response here - the response is sent in the archive.on('finish') handler above
  // This fixes the "generatedFiles is not defined" error and the race condition
  console.log("Archive finalization started - waiting for finish event to send response");
  
  // This is a placeholder return that won't be reached - the real response happens in the 'finish' event
  return res; 
}

// Endpoint to download the latest generated plan
router.get("/download-latest-plan", async (req, res) => {
  try {
    // Set the content type for the response
    res.setHeader('Content-Type', 'application/json');
    
    const userId = getUserId(req);

    // Get the user
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log(`Generating ZIP file for download for user ${userId}`);
    
    // Generate a fresh plan with the latest data (using the existing functionality)
    // For simplicity, we'll replicate the key parts of the generate functionality
    
    const files: Record<string, string> = {};
    const fileNames = [
      'requirements.md',
      'prd.md',
      'techstack.md',
      'backend.md',
      'frontend.md',
      'flow.md',
      'status.md'
    ];
    
    // Mock the content with simple placeholders if needed
    // In a real implementation, you'd retrieve the actual content
    for (const fileName of fileNames) {
      files[fileName.replace('.md', '')] = `# ${fileName}\n\nThis is a placeholder for ${fileName}`;
    }
    
    // Create zip archive
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    // Add each file to the archive
    for (const [name, content] of Object.entries(files)) {
      archive.append(content, { name: `${name}.md` });
    }
    
    // Set the proper headers for a zip file download
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=implementation-plan.zip');
    
    // Pipe the archive directly to the response
    archive.pipe(res);
    
    // Finalize the archive
    archive.finalize();
    
    console.log("ZIP download response sent successfully");
    
  } catch (error) {
    console.error("Error generating download:", error);
    // Ensure JSON content type even for errors
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({
      error: "Failed to generate download",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Add this new endpoint to serve the latest plan as a direct ZIP file
router.get("/latest-plan-zip", async (req, res) => {
  const userId = getUserId(req);

  try {
    console.log(`Direct ZIP download requested for user ${userId}`);
    
    // Get the user's latest plan from the database
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // For simplified self-hosted version, generate basic plan files
    console.log(`Download endpoint called for user ${userId} - generating basic plan files`);
    
    const files: Record<string, string> = {};
    const fileNames = [
      'requirements.md',
      'prd.md',
      'techstack.md',
      'backend.md',
      'frontend.md',
      'flow.md',
      'status.md'
    ];
    
    try {
      // Generate basic placeholder files for self-hosted version
      let requirements = "Basic implementation plan for self-hosted CreateMVP";
      
      // Generate files using the stored requirements
      for (const fileName of fileNames) {
        console.log(`Generating ${fileName} from cached requirements...`);
        const content = await generateFile(fileName, requirements);
        files[fileName.replace('.md', '')] = content;
        console.log(`Successfully generated ${fileName} (${content.length} chars)`);
      }
    } catch (error) {
      console.error("Error generating files from cached requirements:", error);
      // Fall back to placeholder files
      for (const fileName of fileNames) {
        files[fileName.replace('.md', '')] = `# ${fileName}\n\nThis is a placeholder for ${fileName}. The original content couldn't be regenerated.`;
      }
    }
    
    // Create zip archive
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    // Set the proper headers for a zip file download
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=implementation-plan.zip');
    
    // Add each file to the archive
    for (const [name, content] of Object.entries(files)) {
      archive.append(createMarkdownFile(content), { name: `Instructions/${name}.md` });
    }
    
    // Add Cursor Project Rules in new MDC format
    
    // Main implementation rule (always applied)
    const implementationRule = `---
description: Core implementation guidelines for the project
alwaysApply: true
---

# Project Implementation Guidelines

You are implementing a project based on the provided documentation files. Follow these core principles:

## Documentation-First Approach
- Always read and understand ALL documentation files before starting implementation
- Refer to requirements.md as the source of truth for project requirements  
- Follow the PRD (prd.md) step by step for feature development
- Use techstack.md for technology decisions and architecture guidance
- Consult backend.md and frontend.md for implementation specifics

## Project Organization
- Keep the project structure organized and follow established patterns
- Update status.md after completing each major milestone or task
- Document any deviations from the original plan with clear reasoning
- Ask for clarification when requirements are unclear or conflicting

## Quality Standards
- Write clean, maintainable, and well-documented code
- Follow the defined architecture and design patterns
- Implement proper error handling and validation
- Test thoroughly before marking tasks complete
- Use meaningful variable and function names

## File References
@requirements.md
@prd.md
@techstack.md
@backend.md
@frontend.md
@flow.md
@status.md`;

    // Frontend-specific rules
    const frontendRule = `---
description: Frontend development guidelines and best practices
globs: ["**/*.tsx", "**/*.jsx", "**/*.css", "**/*.scss", "**/*.js", "**/*.ts", "**/components/**", "**/pages/**", "**/styles/**"]
alwaysApply: false
---

# Frontend Development Rules

When working on frontend components and pages:

## Component Development
- Create reusable, modular components following the component structure outlined in frontend.md
- Use TypeScript for type safety and better development experience
- Implement proper state management as specified in the documentation
- Follow the UI/UX guidelines provided in the project documentation

## Styling Guidelines
- Use the CSS framework/approach specified in techstack.md
- Maintain consistent styling patterns throughout the application
- Implement responsive design for mobile and desktop viewports
- Follow accessibility best practices (ARIA labels, semantic HTML)

## Performance Best Practices
- Optimize bundle size and implement code splitting where appropriate
- Use lazy loading for routes and heavy components
- Optimize images and assets
- Implement proper caching strategies

## Testing
- Write unit tests for complex components and utilities
- Test user interactions and edge cases
- Ensure cross-browser compatibility

@frontend.md
@techstack.md
@prd.md`;

    // Backend-specific rules
    const backendRule = `---
description: Backend development guidelines and API implementation
globs: ["**/*.py", "**/*.js", "**/*.ts", "**/api/**", "**/server/**", "**/models/**", "**/routes/**", "**/controllers/**"]
alwaysApply: false
---

# Backend Development Rules

When implementing backend functionality:

## API Development
- Follow the API design patterns outlined in backend.md
- Implement proper HTTP status codes and error responses
- Use consistent naming conventions for endpoints
- Document API endpoints with clear request/response examples

## Data Management
- Implement the data models as specified in backend.md
- Use proper database indexing and query optimization
- Implement data validation and sanitization
- Handle database migrations properly

## Security Implementation
- Follow the security guidelines outlined in the backend documentation
- Implement proper authentication and authorization
- Validate and sanitize all user inputs
- Use environment variables for sensitive configuration

## Performance & Scalability
- Implement caching strategies where appropriate
- Use async/await patterns for non-blocking operations
- Monitor and log application performance
- Design for horizontal scaling if specified

@backend.md
@techstack.md
@flow.md`;

    // Database and API rules
    const databaseRule = `---
description: Database design and API integration guidelines
globs: ["**/models/**", "**/migrations/**", "**/database/**", "**/api/**", "**/*.sql"]
alwaysApply: false
---

# Database & API Guidelines

When working with data persistence and external APIs:

## Database Design
- Follow the data model specifications in backend.md
- Implement proper relationships and constraints
- Use appropriate data types and indexing strategies
- Plan for data migration and versioning

## API Integration
- Implement error handling for external API calls
- Use proper timeout and retry strategies
- Cache API responses when appropriate
- Handle rate limiting gracefully

## Data Security
- Implement proper data encryption for sensitive information
- Follow GDPR/privacy compliance requirements if applicable
- Use parameterized queries to prevent SQL injection
- Implement proper backup and recovery procedures

@backend.md
@flow.md`;

    // Testing and quality rules
    const testingRule = `---
description: Testing guidelines and quality assurance practices
globs: ["**/*.test.*", "**/*.spec.*", "**/tests/**", "**/test/**"]
alwaysApply: false
---

# Testing & Quality Assurance

When writing tests and ensuring code quality:

## Testing Strategy
- Follow the testing criteria outlined in status.md
- Write unit tests for business logic and utilities
- Implement integration tests for API endpoints
- Add end-to-end tests for critical user workflows

## Test Organization
- Organize tests in a logical directory structure
- Use descriptive test names that explain the scenario
- Mock external dependencies and services
- Maintain test data and fixtures properly

## Quality Gates
- Ensure all tests pass before merging code
- Maintain adequate code coverage (aim for 80%+)
- Run linting and code formatting tools
- Test edge cases and error scenarios

@status.md
@flow.md`;

    // Documentation rules
    const documentationRule = `---
description: Documentation maintenance and updates
globs: ["**/*.md", "**/docs/**", "**/README*"]
alwaysApply: false
---

# Documentation Guidelines

When updating or creating documentation:

## Documentation Maintenance
- Keep all documentation files up to date with implementation changes
- Update status.md regularly to reflect current progress
- Document any architectural decisions or deviations from the original plan
- Include code examples and usage instructions where helpful

## API Documentation
- Document all API endpoints with request/response examples
- Include authentication requirements and error codes
- Provide integration examples for common use cases
- Keep API versioning information current

## User Documentation
- Write clear setup and installation instructions
- Provide troubleshooting guides for common issues
- Include configuration options and environment setup
- Create user guides for key features

@requirements.md
@prd.md
@status.md`;

    // Add all rule files to the archive
    archive.append(createMarkdownFile(implementationRule), { name: '.cursor/rules/implementation.mdc' });
    archive.append(createMarkdownFile(frontendRule), { name: '.cursor/rules/frontend.mdc' });
    archive.append(createMarkdownFile(backendRule), { name: '.cursor/rules/backend.mdc' });
    archive.append(createMarkdownFile(databaseRule), { name: '.cursor/rules/database.mdc' });
    archive.append(createMarkdownFile(testingRule), { name: '.cursor/rules/testing.mdc' });
    archive.append(createMarkdownFile(documentationRule), { name: '.cursor/rules/documentation.mdc' });
    
    // Pipe the archive directly to the response
    archive.pipe(res);
    
    // Finalize the archive
    archive.finalize();
    
    console.log("Direct ZIP sent to browser successfully using cached requirements");
  } catch (error) {
    console.error("Error generating direct ZIP download:", error);
    res.status(500).json({ error: "Failed to generate direct ZIP" });
  }
});

export default router;
