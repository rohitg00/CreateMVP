import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, FileText, Loader2, Download, CheckCircle2, 
  Code, Database, Layout, Server, Layers, FileJson, 
  FileCode, FileCog, FileSearch, Activity, GitPullRequest, 
  ListChecks, Workflow, UploadCloud, File as FileIcon, X, ChevronsUpDown, Check
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import GeneratedFiles from "./GeneratedFiles";
import FileViewer from "./FileViewer";
import { useLocation } from "wouter";
import JSZip from 'jszip';
import { useUser } from "@/lib/userContext";

// Define file type icons with full descriptive names
const fileTypeIcons: Record<string, { icon: React.ReactNode; fullName: string }> = {
  "backend.md": { 
    icon: <Code className="h-4 w-4 text-blue-400" />, 
    fullName: "Backend Implementation" 
  },
  "flow.md": { 
    icon: <Workflow className="h-4 w-4 text-purple-400" />, 
    fullName: "User Flow Diagram" 
  },
  "frontend.md": { 
    icon: <Layout className="h-4 w-4 text-indigo-400" />, 
    fullName: "Frontend Implementation" 
  },
  "prd.md": { 
    icon: <GitPullRequest className="h-4 w-4 text-green-400" />, 
    fullName: "Product Requirements Document" 
  },
  "requirements.md": { 
    icon: <FileSearch className="h-4 w-4 text-yellow-400" />, 
    fullName: "Technical Requirements" 
  },
  "status.md": { 
    icon: <Activity className="h-4 w-4 text-red-400" />, 
    fullName: "Project Status" 
  },
  "techstack.md": { 
    icon: <Layers className="h-4 w-4 text-cyan-400" />, 
    fullName: "Technology Stack" 
  },
  "default": { 
    icon: <FileText className="h-4 w-4 text-gray-400" />, 
    fullName: "Documentation File" 
  }
};

// Generation stages with colors
const generationStages: Record<string, { text: string; color: string }> = {
  "analyzing": { text: "Analyzing Requirements", color: "bg-blue-500" },
  "planning": { text: "Planning Architecture", color: "bg-indigo-500" },
  "generating": { text: "Generating Documentation", color: "bg-purple-500" },
  "finalizing": { text: "Finalizing Plan", color: "bg-pink-500" },
  "complete": { text: "Plan Generated Successfully!", color: "bg-green-500" }
};

// Sample file contents for preview
const sampleFileContents: Record<string, string> = {
  "prd.md": `# Product Requirements Document

## Overview
This document outlines the requirements for the Social Media Agent application.

## User Stories
1. As a social media manager, I want to schedule posts across multiple platforms
2. As a content creator, I want to analyze engagement metrics
3. As a team lead, I want to assign tasks to team members

## Features
- Multi-platform posting
- Analytics dashboard
- Team collaboration tools
- Content calendar
- AI-powered content suggestions`,

  "requirements.md": `# Technical Requirements

## Functional Requirements
- User authentication and authorization
- Social media platform integration (Twitter, Instagram, Facebook, LinkedIn)
- Post scheduling and management
- Analytics and reporting
- Team collaboration features

## Non-Functional Requirements
- Response time < 2 seconds
- 99.9% uptime
- GDPR compliance
- Secure data storage
- Mobile responsive design`,

  "techstack.md": `# Technology Stack

## Frontend
- React.js with TypeScript
- Next.js for server-side rendering
- Tailwind CSS for styling
- Redux for state management

## Backend
- Node.js with Express
- PostgreSQL database
- Redis for caching
- JWT for authentication

## DevOps
- Docker for containerization
- AWS for hosting
- GitHub Actions for CI/CD
- Jest for testing`,

  "flow.md": `# User Flow Diagram

## Authentication Flow
1. User visits landing page
2. User clicks "Sign Up" or "Login"
3. User completes authentication
4. User is redirected to dashboard

## Post Creation Flow
1. User navigates to "Create Post"
2. User selects platforms
3. User creates content
4. User schedules or posts immediately
5. System confirms successful posting`,

  "frontend.md": `# Frontend Implementation

## Component Structure
- App
  - Layout
    - Sidebar
    - TopNav
    - MainContent
      - Dashboard
      - PostCreator
      - Calendar
      - Analytics
      - Settings

## Pages
- Home/Landing
- Dashboard
- Post Creator
- Analytics
- Calendar
- Settings
- Team Management`,

  "backend.md": `# Backend Implementation

## API Endpoints
- /api/auth - Authentication endpoints
- /api/posts - Post management
- /api/analytics - Analytics data
- /api/teams - Team management
- /api/platforms - Platform integration

## Database Schema
- Users
- Posts
- Teams
- Analytics
- Platforms
- Schedules`,

  "status.md": `# Project Status

## Timeline
- Week 1-2: Setup and initial development
- Week 3-4: Core features implementation
- Week 5-6: Testing and refinement
- Week 7-8: Beta release and feedback

## Current Status
- Authentication: Complete
- Post Management: In Progress
- Analytics: Not Started
- Team Features: Not Started`
};

export default function RequirementUpload() {
  const [textInput, setTextInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const [generationStage, setGenerationStage] = useState<string | null>(null);
  const [generatingFiles, setGeneratingFiles] = useState<string[]>([]);
  const [completedFiles, setCompletedFiles] = useState<string[]>([]);
  const [showGeneratedFiles, setShowGeneratedFiles] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [fileViewerOpen, setFileViewerOpen] = useState<boolean>(false);
  const [zipData, setZipData] = useState<string | null>(null);
  const { user, loadUser, setCredits } = useUser();

  const generatePlanMutation = useMutation({
    mutationFn: async (data: { text: string; file?: File }) => {
      // Create FormData object
      const formData = new FormData();
      
      // Explicitly set text field
      formData.append("text", data.text || "");
      
      // Add file if it exists
      if (data.file) {
        formData.append("file", data.file);
      }
      
      // Simulate generation stages for better UX
      setGenerationStage("analyzing");
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setGenerationStage("planning");
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setGenerationStage("generating");
      
      // Use the actual files from the screenshot
      const filesToGenerate = [
        "requirements.md",
        "backend.md",
        "flow.md",
        "frontend.md",
        "prd.md",
        "status.md",
        "techstack.md"
      ];
      
      setGeneratingFiles(filesToGenerate);
      
      for (const file of filesToGenerate) {
        // Add file to generating list
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
        
        // Mark file as completed
        setCompletedFiles(prev => [...prev, file]);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Make the API request
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        body: formData,
      });
      
      // Log the response content type for debugging
      const contentType = response.headers.get("content-type");
      console.log("Response content type:", contentType);
      
      // Handle non-OK responses
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      // Safely check if the response is JSON before parsing
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text();
        console.error("Received non-JSON response:", textResponse.substring(0, 200) + "...");
        throw new Error("Server returned non-JSON response. Please try again.");
      }
      
      // Parse the JSON response
      const result = await response.json();
      
      setGenerationStage("finalizing");
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setGenerationStage("complete");
      setShowGeneratedFiles(true);
      return result;
    },
    onSuccess: async (data) => {
      console.log("Plan generation successful with FULL data:", data);
      console.log("Plan generation successful with data structure:", {
        hasFiles: !!data.files,
        filesKeys: data.files ? Object.keys(data.files) : [],
        hasZipBuffer: !!data.zipBuffer,
        zipBufferLength: data.zipBuffer ? data.zipBuffer.length : 0
      });
      
      // Store the data in state first
      setGeneratedPlan(data);
      
      // Show the generated files section
      setShowGeneratedFiles(true);
      setGenerationStage("complete");
      
      // If the user is on the free plan, update their credits in UI
      if (user && user.plan === "free") {
        // Refresh user data to get updated credit count
        await loadUser();
        
        // Show credit usage toast
        showCreditUpdateToast();
      }
      
      toast({
        title: "Success",
        description: "Implementation plan generated successfully",
      });
      
      // Give time for state to update before attempting download
      setTimeout(() => {
        console.log("Checking if ZIP can be downloaded...");
        const currentData = data; // Use the data from the API response directly
        
        if (currentData && currentData.zipBuffer) {
          console.log("ZIP buffer found in API response, length:", currentData.zipBuffer.length);
          try {
            // Direct download from API response data
            const binaryString = atob(currentData.zipBuffer);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            
            // Create the blob and download
            const blob = new Blob([bytes], { type: 'application/zip' });
            const url = URL.createObjectURL(blob);
            
            // Create and trigger download
            const a = document.createElement('a');
            a.href = url;
            a.download = 'implementation-plan.zip';
            document.body.appendChild(a);
            a.click();
            
            // Clean up
            setTimeout(() => {
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }, 100);
            
            console.log("Auto-download completed successfully");
          } catch (error) {
            console.error("Auto-download error:", error);
          }
        } else {
          console.error("No ZIP buffer found in API response for auto-download");
        }
      }, 2000);
    },
    onError: (error: any) => {
      console.error("Error generating plan:", error);
      
      // Check if it's a credit limit error
      let errorMessage = "Failed to generate implementation plan";
      
      if (error?.response?.data?.error === "Credit limit reached") {
        errorMessage = "You've used all your free generation credits. Please upgrade to the Pro plan for unlimited generations.";
        
        // Show toast with upgrade button
        toast({
          title: "Credit Limit Reached",
          description: (
            <div className="flex flex-col gap-2">
              <p>You've used all your free generation credits.</p>
              <Button 
                variant="default" 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                onClick={() => setLocation("/pricing")}
              >
                Upgrade to Pro
              </Button>
            </div>
          ),
          variant: "destructive",
        });
      } else {
        // Show regular error toast
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
      
      setGenerationStage(null);
      setGeneratingFiles([]);
      setCompletedFiles([]);
      setStatus("error");
      setStatusMessage(errorMessage);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleSubmit called");
    setGeneratedPlan(null);
    setGeneratingFiles([]);
    setCompletedFiles([]);
    setShowGeneratedFiles(false);
    
    if (!textInput.trim() && !file) {
      toast({
        title: "Error",
        description: "Please provide requirements via text or PDF",
        variant: "destructive",
      });
      return;
    }

    // Create the request data
    const requestData = {
      text: textInput,
      file: file || undefined
    };
    
    // Call the mutation
    generatePlanMutation.mutate(requestData);
  };

  const handleDownloadAll = () => {
    // Show loading toast
    toast({
      title: "Preparing Download",
      description: "Your files are being packaged for download..."
    });
    
    console.log("handleDownloadAll called, generatedPlan:", generatedPlan);
    
    // Use the server data or sample data to create a proper ZIP file
    const downloadFiles = async () => {
      try {
        // Create a new JSZip instance
        const zip = new JSZip();
        
        // Determine which files to include
        let filesToZip: Record<string, string> = {};
        
        // If we have files from the server, use those
        if (generatedPlan?.files && Object.keys(generatedPlan.files).length > 0) {
          filesToZip = generatedPlan.files;
          console.log("Using server-generated files for ZIP:", Object.keys(filesToZip));
        } else {
          // Otherwise use sample data
          console.log("Using sample files for ZIP");
          const fileList = [
            "prd.md",
            "requirements.md",
            "techstack.md",
            "flow.md",
            "frontend.md",
            "backend.md",
            "status.md"
          ];
          
          fileList.forEach(name => {
            const key = name.replace('.md', '');
            filesToZip[key] = sampleFileContents[name] || `# ${name}\n\nContent for ${name}`;
          });
        }
        
        // Add each file to the ZIP
        Object.entries(filesToZip).forEach(([key, content]) => {
          if (typeof content === 'string') {
            zip.file(`${key}.md`, content);
          }
        });
        
        // Generate the ZIP file blob
        const zipBlob = await zip.generateAsync({ type: "blob" });
        
        // Create a download URL and trigger download
        const downloadUrl = URL.createObjectURL(zipBlob);
        
        // Create a link to trigger download
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = 'implementation-plan.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);
        
        toast({
          title: "Download Complete",
          description: "Your implementation plan has been downloaded as a ZIP file",
        });
      } catch (err) {
        console.error("Error downloading files:", err);
        toast({
          title: "Download Failed",
          description: "There was an error creating your ZIP download",
          variant: "destructive",
        });
      }
    };
    
    // Start download process
    downloadFiles();
  };

  const handleViewFile = (fileName: string) => {
    console.log(`handleViewFile called for ${fileName}`);
    console.log(`generatedPlan?.files:`, generatedPlan?.files);
    
    setSelectedFile(fileName);
    
    let content = '';
    
    // Check if we have content from the API
    if (generatedPlan?.files && generatedPlan.files[fileName]) {
      content = generatedPlan.files[fileName];
      console.log(`Using actual content for ${fileName} from API`);
    }
    // Try to use sample content if available
    else if (sampleFileContents[fileName + '.md']) {
      content = sampleFileContents[fileName + '.md'];
      console.log(`Using sample content for ${fileName}`);
    }
    // Fallback to a placeholder
    else {
      content = `# ${fileName.charAt(0).toUpperCase() + fileName.slice(1)}\n\nThis is a placeholder for ${fileName}`;
      console.log(`Using placeholder for ${fileName}`);
    }
    
    setFileContent(content);
    setFileViewerOpen(true);
  };

  // Reset completed files when generation stage changes
  useEffect(() => {
    if (generationStage !== "generating") {
      setGeneratingFiles([]);
      setCompletedFiles([]);
    }
  }, [generationStage]);

  // Updated download function that falls back to a direct API call
  const downloadPlan = () => {
    console.log("Download function called");
    console.log("generatedPlan available:", generatedPlan);
    
    if (generatedPlan?.zipBuffer) {
      console.log("Using zipBuffer from state, length:", generatedPlan.zipBuffer.length);
      try {
        // Log the zipBuffer to verify it exists
        console.log("zipBuffer length:", generatedPlan.zipBuffer.length);
        
        // Simple direct conversion from base64 to blob
        const binaryString = atob(generatedPlan.zipBuffer);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        // Create the blob and download
        const blob = new Blob([bytes], { type: 'application/zip' });
        const url = URL.createObjectURL(blob);
        
        // Create and trigger download
        const a = document.createElement('a');
        a.href = url;
        a.download = 'implementation-plan.zip';
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);
        
        console.log("Download triggered successfully from state data");
        
        toast({
          title: "Download Started",
          description: "Your implementation plan is being downloaded",
        });
      } catch (error) {
        console.error("Download error:", error);
        fallbackToServerDownload();
      }
    } else {
      console.error("No zipBuffer found in generatedPlan state, trying server download");
      fallbackToServerDownload();
    }
    
    // Fallback function to request ZIP directly from server
    function fallbackToServerDownload() {
      console.log("Attempting fallback download from server...");
      
      toast({
        title: "Downloading",
        description: "Requesting implementation plan from server...",
      });
      
      // Make a direct GET request to a new endpoint that returns the ZIP file
      fetch('/api/latest-plan-zip', {
        method: 'GET',
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Server download failed');
        }
        return response.blob();
      })
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'implementation-plan.zip';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);
        
        console.log("Fallback download successful");
        
        toast({
          title: "Download Complete",
          description: "Your implementation plan has been downloaded",
        });
      })
      .catch(error => {
        console.error("Fallback download error:", error);
        toast({
          title: "Download Failed",
          description: "Unable to download plan. Please try again later.",
          variant: "destructive",
        });
      });
    }
  };

  // Add a function to show credit usage information
  const showCreditUpdateToast = () => {
    if (user && user.plan === "free") {
      toast({
        title: "Credit Used",
        description: (
          <div className="space-y-2">
            <p>You've used 1 credit for this plan generation.</p>
            <div className="flex items-center justify-between text-sm text-slate-200">
              <span>Credits remaining: {user.credits}</span>
              <span>{user.credits}/5</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2.5 rounded-full" 
                style={{ width: `${(user.credits / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        ),
      });
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-2xl mx-auto bg-slate-900/80 border-slate-800 shadow-xl">
          <CardHeader className="pb-4 border-b border-slate-800">
            <CardTitle className="text-2xl font-bold text-white">Upload MVP Requirements</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="requirements" className="text-sm font-medium text-slate-300">
                  Enter Requirements
                </label>
                <Textarea
                  id="requirements"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Enter your MVP requirements here..."
                  className="min-h-[200px] bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Or Upload PDF
                </label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-20 rounded-lg border-dashed border-2 border-indigo-500/30 bg-indigo-950/30 text-indigo-300 hover:bg-indigo-900/30"
                    onClick={() => document.getElementById("pdf-upload")?.click()}
                  >
                    <Upload className="h-5 w-5 mr-2 text-indigo-400" />
                    <span>Upload PDF</span>
                  </Button>
                  {file && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setFile(null)}
                      className="text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      ×
                    </Button>
                  )}
                </div>
              </div>

              <AnimatePresence>
                {generationStage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-lg bg-slate-800/50 p-4 border border-slate-700">
                      <div className="space-y-4">
                        {Object.entries(generationStages).map(([stage, { text, color }], index) => {
                          const stageIndex = Object.keys(generationStages).indexOf(generationStage || "");
                          const currentIndex = Object.keys(generationStages).indexOf(stage);
                          const isCompleted = currentIndex < stageIndex;
                          const isActive = stage === generationStage;
                          
                          return (
                            <div key={stage} className="flex items-center gap-3">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-500' : isActive ? color : 'bg-slate-700'}`}>
                                {isCompleted ? (
                                  <CheckCircle2 className="w-4 h-4 text-white" />
                                ) : (
                                  isActive && <Loader2 className="w-4 h-4 text-white animate-spin" />
                                )}
                              </div>
                              <div className={`text-sm ${isCompleted ? 'text-green-400' : isActive ? 'text-white' : 'text-slate-500'}`}>
                                {text}
                              </div>
                            </div>
                          );
                        })}
                        
                        {/* File generation animation */}
                        {generationStage === "generating" && (
                          <div className="mt-4 pl-9 space-y-2">
                            <AnimatePresence>
                              {generatingFiles.map((file) => {
                                const isCompleted = completedFiles.includes(file);
                                const fileInfo = fileTypeIcons[file] || fileTypeIcons.default;
                                
                                return (
                                  <motion.div
                                    key={file}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className={`flex items-center gap-2 text-xs ${isCompleted ? 'text-green-400' : 'text-slate-300'}`}
                                  >
                                    <div className="w-5 h-5 flex items-center justify-center">
                                      {isCompleted ? (
                                        <motion.div
                                          initial={{ scale: 0.8 }}
                                          animate={{ scale: 1 }}
                                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        >
                                          {fileInfo.icon}
                                        </motion.div>
                                      ) : (
                                        <Loader2 className="w-3 h-3 animate-spin text-slate-400" />
                                      )}
                                    </div>
                                    <span className="font-medium">{fileInfo.fullName}</span>
                                    {isCompleted && (
                                      <motion.div
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.2 }}
                                      >
                                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                                      </motion.div>
                                    )}
                                  </motion.div>
                                );
                              })}
                            </AnimatePresence>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-4">
                <Button
                  variant="default"
                  size="lg"
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 py-6"
                  disabled={generatePlanMutation.isPending || (!textInput.trim() && !file)}
                  onClick={handleSubmit}
                >
                  {generatePlanMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {generationStage ? generationStages[generationStage]?.text : 'Generating...'}
                    </>
                  ) : (
                    <>
                      <UploadCloud className="mr-2 h-5 w-5" />
                      Generate Implementation Plan
                    </>
                  )}
                </Button>
                
                {/* Large download button that appears after generation */}
                {generationStage === "complete" && (
                  <div className="mt-4 animate-pulse">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full flex items-center justify-center py-6 bg-green-600/40 hover:bg-green-600/70 border-green-500/50 text-white"
                      onClick={() => {
                        console.log("Primary download button clicked");
                        if (generatedPlan?.zipBuffer) {
                          downloadPlan();
                        } else {
                          toast({
                            title: "Download Error",
                            description: "No ZIP data available to download",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      <Download className="mr-2 h-5 w-5" />
                      Download Implementation Plan
                    </Button>
                  </div>
                )}
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setTextInput("");
                  setFile(null);
                }}
                className="mt-4 text-indigo-300 bg-indigo-950/30 border-indigo-700/30 hover:bg-indigo-900/50"
              >
                Clear All
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Generated Files UI */}
      {(showGeneratedFiles || generationStage === "complete") && (
        <>
          {/* Debug info section */}
          <div className="mt-4 p-4 bg-gray-800 rounded-md border border-gray-700">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Debug Info:</h3>
            <div className="text-xs text-gray-400 space-y-1">
              <p>Generation stage: {generationStage}</p>
              <p>Show generated files: {showGeneratedFiles ? 'Yes' : 'No'}</p>
              <p>Has ZIP buffer: {generatedPlan?.zipBuffer ? 'Yes' : 'No'}</p>
              <p>ZIP buffer length: {generatedPlan?.zipBuffer?.length || 0} bytes</p>
              <p>Files available: {generatedPlan?.files ? Object.keys(generatedPlan.files).join(', ') : 'None'}</p>
            </div>
            <div className="mt-3 flex space-x-2">
              <button 
                className="text-xs px-2 py-1 bg-blue-800 text-white rounded"
                onClick={() => {
                  console.log("Current generatedPlan:", generatedPlan);
                  alert("Check console for generatedPlan data");
                }}
              >
                Log Data
              </button>
              <button 
                className="text-xs px-2 py-1 bg-green-800 text-white rounded"
                onClick={() => {
                  console.log("Manual download triggered");
                  downloadPlan();
                }}
              >
                Force Download
              </button>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Generated MVP Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {["requirements", "prd", "techstack", "backend", "frontend", "flow", "status"].map((fileName) => (
                <div 
                  key={fileName}
                  className="bg-gradient-to-br from-slate-800/80 to-indigo-900/30 p-4 rounded-xl border border-indigo-500/20 shadow-md hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
                  onClick={() => handleViewFile(fileName)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-white">
                      {fileName === "requirements" && "Technical Requirements"}
                      {fileName === "prd" && "Product Requirements"}
                      {fileName === "techstack" && "Technology Stack"}
                      {fileName === "backend" && "Backend Implementation"}
                      {fileName === "frontend" && "Frontend Implementation"}
                      {fileName === "flow" && "User Flow Diagram"}
                      {fileName === "status" && "Project Status"}
                    </h3>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-indigo-300 hover:text-white hover:bg-indigo-800/50"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewFile(fileName);
                      }}
                      leftIcon={<FileText className="h-5 w-5" />}
                    >
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <Button
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md text-white"
                onClick={downloadPlan}
                leftIcon={<Download className="h-4 w-4" />}
              >
                Download All Files
              </Button>
            </div>
          </div>
        </>
      )}

      {/* File Viewer */}
      <FileViewer
        fileName={selectedFile || ""}
        content={fileContent || "No content available"}
        isOpen={fileViewerOpen}
        onClose={() => {
          console.log("FileViewer closed");
          setFileViewerOpen(false);
          setSelectedFile(null);
        }}
      />

      {/* Fixed position download button when plan is generated */}
      {generatedPlan?.zipBuffer && (
        <div className="fixed bottom-8 right-8 z-50">
          <Button 
            className="shadow-lg bg-green-600 hover:bg-green-700 text-white"
            onClick={downloadPlan}
            leftIcon={<Download className="h-5 w-5" />}
          >
            Download Plan
          </Button>
        </div>
      )}
    </div>
  );
}