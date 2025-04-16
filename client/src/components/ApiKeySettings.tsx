import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Key, CheckCircle2, LogIn } from "lucide-react";
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
      // All keys saved through this UI are user-provided
      return apiRequest("POST", "/api/keys", { provider, key, isUserProvided: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/keys"] });
      toast({
        title: "API Key Saved",
        description: "Your API key has been saved successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save API key",
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
    <div className="space-y-6 p-4 overflow-y-auto">
      <div className="text-center mb-6">
        <Key className="h-10 w-10 text-indigo-400 mx-auto mb-2" />
        <h2 className="text-2xl font-bold text-white">API Settings</h2>
        <p className="text-slate-400">
          Add your API keys for different AI providers to use their models in the chat
        </p>
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
              <Label htmlFor={provider} className="text-slate-300">{label}</Label>
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
                <p className="text-xs text-green-400">API key saved</p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
} 