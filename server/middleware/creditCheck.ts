import { Request, Response, NextFunction } from "express";
import { storage } from "../storage";
import { Session } from "express-session";

// Define the request with session 
interface AuthenticatedRequest extends Request {
  session: {
    userId?: number;
  } & Session;
}

// Get user ID from session
function getUserId(req: Request): number | null {
  return (req as AuthenticatedRequest).session?.userId || null;
}

/**
 * Middleware to check if a user has enough credits to generate a plan
 * Free users can only generate 5 plans (credits start at 5)
 * Pro users have unlimited generations
 */
export async function checkCredits(req: Request, res: Response, next: NextFunction) {
  try {
    // Check authentication
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({
        error: "Authentication required",
        details: "You must be logged in to generate a plan"
      });
    }

    // Get user and check credits
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
        details: "Your user account could not be found"
      });
    }

    // Check if the user is on the free plan and has used all their credits
    if (user.plan === "free" && user.credits <= 0) {
      return res.status(403).json({
        error: "Credit limit reached",
        details: "You have used all your free generation credits. Please upgrade to the Pro plan for unlimited generations."
      });
    }

    // Store user in request for later use
    (req as any).user = user;
    
    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Credit check error:", error);
    return res.status(500).json({
      error: "Server error",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

/**
 * Middleware to deduct a credit after successful plan generation
 * Only deducts from free users, pro users have unlimited
 */
export async function deductCredit(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = getUserId(req);
    const user = (req as any).user;
    
    if (userId && user && user.plan === "free") {
      await storage.updateUserCredits(userId, -1);
    }
    
    next();
  } catch (error) {
    console.error("Credit deduction error:", error);
    // Don't block the response, just log the error
    next();
  }
} 