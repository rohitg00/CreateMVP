import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Key, CheckCircle2, LogIn, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useUser } from "@/lib/userContext";
import { Link } from "wouter";

interface ApiKey {
  id: number;
  provider: string;
  key: string;
  createdAt: string;
  isUserProvided: boolean;
}

export default function ApiKeySettings() {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({
    alibaba: "",
    anthropic: "",
    athene: "",
    chatglm: "",
    deepseek: "",
    google: "",
    meta: "",
    openai: "",
    xai: "",
    yi: ""
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useUser();

  // Fetch existing API keys
  const { data: existingKeys, isLoading: isLoadingKeys } = useQuery({
    queryKey: ["/api/keys"],
    onSuccess: (data: ApiKey[]) => {
      // Update state with existing keys (masked)
      const newState = { ...apiKeys };
      data.forEach(key => {
        newState[key.provider] = "••••••••";
      });
      setApiKeys(newState);
    }
  });

  // Save API key mutation
  const saveKeyMutation = useMutation({
    mutationFn: async ({ provider, key }: { provider: string; key: string }) => {
      console.log(`Saving API key for provider: ${provider}`);
      
      // First try the /api/keys endpoint, then fall back to /api/api-keys for compatibility
      try {
        return await apiRequest("POST", "/api/keys", { 
          provider, 
          key, 
          isUserProvided: true 
        });
      } catch (error) {
        console.error("Error saving with /api/keys, trying fallback endpoint", error);
        // Fallback to alternative endpoint if the primary one fails
        return apiRequest("POST", "/api/api-keys", { 
          provider, 
          key, 
          isUserProvided: true 
        });
      }
    },
    onSuccess: () => {
      // Invalidate both query keys to ensure we refresh regardless of which endpoint was used
      queryClient.invalidateQueries({ queryKey: ["/api/keys"] });
      queryClient.invalidateQueries({ queryKey: ["/api/api-keys"] });
      
      toast({
        title: "API Key Saved",
        description: "Your API key has been saved successfully",
      });
    },
    onError: (error: Error) => {
      console.error("Error saving API key:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save API key. Please check your input and try again.",
        variant: "destructive",
      });
    }
  });
  
  // Delete API key mutation
  const deleteKeyMutation = useMutation({
    mutationFn: async (keyId: number) => {
      try {
        // First try primary endpoint
        return await apiRequest("DELETE", `/api/keys/${keyId}`);
      } catch (error) {
        console.error("Error with primary delete endpoint, trying fallback", error);
        // Fallback to alternate endpoint
        return apiRequest("DELETE", `/api/api-keys/${keyId}`);
      }
    },
    onSuccess: () => {
      // Invalidate both query key patterns to ensure proper cache updates
      queryClient.invalidateQueries({ queryKey: ["/api/keys"] });
      queryClient.invalidateQueries({ queryKey: ["/api/api-keys"] });
      
      toast({
        title: "API Key Deleted",
        description: "Your API key has been removed successfully",
      });
    },
    onError: (error: Error) => {
      console.error("Failed to delete API key:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete API key. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSaveKey = (provider: string) => {
    const key = apiKeys[provider];
    if (!key) {
      toast({
        title: "Error",
        description: "Please enter an API key",
        variant: "destructive",
      });
      return;
    }

    // Don't send if it's the masked placeholder
    if (key === "••••••••") {
      toast({
        title: "No Change",
        description: "API key was not changed",
      });
      return;
    }

    saveKeyMutation.mutate({ provider, key });
  };
  
  const handleDeleteKey = (keyId: number) => {
    if (confirm("Are you sure you want to delete this API key? This cannot be undone.")) {
      deleteKeyMutation.mutate(keyId);
    }
  };

  const handleInputChange = (provider: string, value: string) => {
    setApiKeys(prev => ({
      ...prev,
      [provider]: value
    }));
  };

  // Check if user is logged in
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Key className="h-10 w-10 text-indigo-400 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
        <p className="text-slate-400 mb-6">
          You need to be logged in to manage your API keys.
        </p>
        <Link href="/auth/login">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <LogIn className="mr-2 h-4 w-4" />
            Log In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 overflow-y-auto mt-2">
      <div className="text-slate-400 space-y-2 p-3 border border-slate-800 rounded-md bg-indigo-900/10">
        <div className="flex gap-2 items-center">
          <div className="p-1.5 bg-indigo-950/70 rounded-full">
            <Key className="h-4 w-4 text-indigo-400" />
          </div>
          <p className="text-sm">
            Your API keys are encrypted and stored securely in our database
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="p-1.5 bg-indigo-950/70 rounded-full">
            <CheckCircle2 className="h-4 w-4 text-green-400" />
          </div>
          <p className="text-sm">
            You're only charged for requests made with your API keys
          </p>
        </div>
      </div>

      {isLoadingKeys ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
        </div>
      ) : (
        <div className="grid gap-4 pb-4">
          {Object.entries({
            "OpenAI API Key": "openai",
            "Google API Key": "google",
            "Anthropic API Key": "anthropic",
            "Deepseek API Key": "deepseek",
            "Meta API Key": "meta",
            "Alibaba API Key": "alibaba",
            "ChatGLM API Key": "chatglm",
            "Athene API Key": "athene",
            "Xai API Key": "xai",
            "Yi API Key": "yi"
          }).map(([label, provider], index) => (
            <motion.div 
              key={provider} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="space-y-2 bg-slate-800/30 p-3 rounded-md border border-slate-700/50"
            >
              <div className="flex justify-between">
                <Label htmlFor={provider} className="text-slate-300">{label}</Label>
                {provider === "openai" && (
                  <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:text-indigo-300">
                    Get API key →
                  </a>
                )}
                {provider === "google" && (
                  <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:text-indigo-300">
                    Get API key →
                  </a>
                )}
                {provider === "anthropic" && (
                  <a href="https://console.anthropic.com/keys" target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:text-indigo-300">
                    Get API key →
                  </a>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  id={provider}
                  type="password"
                  value={apiKeys[provider]}
                  onChange={(e) => handleInputChange(provider, e.target.value)}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  className="bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20 flex-1"
                />
                <Button 
                  onClick={() => handleSaveKey(provider)}
                  disabled={saveKeyMutation.isPending}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white whitespace-nowrap"
                >
                  {saveKeyMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : existingKeys?.some(k => k.provider === provider) ? (
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                  ) : null}
                  Save
                </Button>
              </div>
              {existingKeys?.some(k => k.provider === provider) && (
                <div className="flex justify-between items-center">
                  <p className="text-xs text-green-400">API key saved</p>
                  {existingKeys.filter(k => k.provider === provider).map(key => (
                    <Button 
                      key={key.id}
                      variant="ghost" 
                      size="sm" 
                      className="h-6 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30"
                      onClick={() => handleDeleteKey(key.id)}
                      disabled={deleteKeyMutation.isPending}
                    >
                      {deleteKeyMutation.isPending ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3 mr-1" />
                      )}
                      Remove
                    </Button>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
} 