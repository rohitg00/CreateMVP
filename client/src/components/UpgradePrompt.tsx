import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Zap } from 'lucide-react';

interface UpgradePromptProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  actionLabel?: string;
  isSignupFlow?: boolean;
  onActionClick?: () => void;
}

/**
 * A modal component that prompts users to upgrade to a pro plan
 * or complete signup first if they're in the signup flow
 */
export default function UpgradePrompt({
  isOpen,
  onClose,
  title = "Upgrade to Pro",
  description = "Unlock all features and unlimited generations with our Pro plan.",
  actionLabel = "Upgrade Now",
  isSignupFlow = false,
  onActionClick,
}: UpgradePromptProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Zap className="h-5 w-5 text-indigo-500 mr-2" />
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            {isSignupFlow ? (
              <p className="text-sm text-gray-500">
                To access premium features, please complete your sign-up first, then upgrade your account.
              </p>
            ) : (
              <div className="space-y-3">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-px mr-2 flex-shrink-0" />
                  <p className="text-sm">Unlimited MVPs and projects</p>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-px mr-2 flex-shrink-0" />
                  <p className="text-sm">Advanced AI models and larger context windows</p>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-px mr-2 flex-shrink-0" />
                  <p className="text-sm">Priority support and faster processing</p>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-px mr-2 flex-shrink-0" />
                  <p className="text-sm">Custom project templates and export options</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between flex-col sm:flex-row gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            {isSignupFlow ? "Continue with Free" : "Maybe Later"}
          </Button>
          <Button
            type="button" 
            onClick={onActionClick || onClose}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
          >
            {isSignupFlow ? "Complete Signup" : actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}