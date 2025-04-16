import { Router, Request } from "express";
import { Session } from "express-session";
import { storage } from "../storage";

// Create router
const router = Router();

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

// Endpoint to get Polar checkout URL
router.get("/checkout", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  
  try {
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Get the hostname dynamically from the request
    const host = req.headers.host || 'localhost:5000';
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    
    // Include a success URL that redirects back to our application
    const successUrl = encodeURIComponent(`${protocol}://${host}/subscription/success`);
    
    // Include a cancel URL in case the user abandons checkout
    const cancelUrl = encodeURIComponent(`${protocol}://${host}/generate`);
    
    // Use the specific Polar checkout link provided with success URL and cancel URL
    const polarCheckoutUrl = `https://polar.sh/checkout/polar_c_Ks8z3dhFMifZDXQ67tSsglSF0EzVepfL4eske2ogKlK?success_url=${successUrl}&cancel_url=${cancelUrl}`;
    
    console.log(`Redirecting user ${userId} (${user.email}) to Polar checkout`);
    
    // Return the checkout URL
    return res.json({ 
      checkoutUrl: polarCheckoutUrl
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return res.status(500).json({ error: "Failed to create checkout session" });
  }
});

// Webhook endpoint to handle subscription events
router.post("/webhook", async (req, res) => {
  try {
    // In production, verify the webhook signature
    // const signature = req.headers['polar-signature'];
    // if (!signature) {
    //   return res.status(400).json({ error: "Missing Polar signature" });
    // }
    
    const event = req.body;
    console.log("Received Polar webhook event:", JSON.stringify(event, null, 2));
    
    // Handle different webhook events
    switch (event.type) {
      case 'subscription.created':
      case 'payment.succeeded':
        await handleSuccessfulPayment(event);
        break;
        
      case 'subscription.cancelled':
      case 'subscription.payment_failed':
      case 'payment.failed':
        await handleFailedPayment(event);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    // Always return 200 to acknowledge receipt
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Polar webhook error:", error);
    // Still return 200 to prevent retries (we don't want multiple updates for the same event)
    return res.status(200).json({ 
      received: true,
      error: error instanceof Error ? error.message : "Unknown error" 
    });
  }
});

// Helper function to handle successful payment
async function handleSuccessfulPayment(event: any) {
  // Extract customer email from the event
  const customerEmail = event.data?.customer?.email || event.data?.email;
  if (!customerEmail) {
    console.error("Customer email not found in webhook payload");
    return;
  }
  
  // Find the user by email
  const user = await storage.getUserByUsername(customerEmail);
  if (!user) {
    console.error(`User not found for email: ${customerEmail}`);
    return;
  }
  
  // Update user to pro plan with unlimited credits
  await storage.updateUser(user.id, {
    plan: 'pro',
    credits: 999999 // Effectively unlimited
  });
  
  console.log(`Updated user ${user.id} (${user.email}) to pro plan with unlimited credits`);
}

// Helper function to handle failed payment
async function handleFailedPayment(event: any) {
  const customerEmail = event.data?.customer?.email || event.data?.email;
  if (!customerEmail) {
    console.error("Customer email not found in webhook payload");
    return;
  }
  
  // Find the user
  const user = await storage.getUserByUsername(customerEmail);
  if (!user) {
    console.error(`User not found for email: ${customerEmail}`);
    return;
  }
  
  // If the user was already on the pro plan, downgrade to free
  if (user.plan === 'pro') {
    // Downgrade to free plan with 5 credits
    await storage.updateUser(user.id, {
      plan: 'free',
      credits: 5
    });
    
    console.log(`Downgraded user ${user.id} (${user.email}) to free plan due to payment failure`);
  }
}

export default router; 

