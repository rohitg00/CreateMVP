import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Send, Settings, Bot, User } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Switch } from "@/components/ui/switch";

interface Message {
  role: "user" | "assistant";
  content: string;
  model: string;
  timestamp?: string; // Add timestamp for message ordering
}

interface ApiKey {
  id: number;
  provider: string;
  createdAt: string;
}

// Provider logos for model identification
const providerLogos = {
  openai: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/OpenAI_Logo.svg/1024px-OpenAI_Logo.svg.png",
  google: "https://storage.googleapis.com/web-dev-uploads/image/NJdAV9UgKuN8AhoaPBquL7giZQo1/LhoI2FFKOlbq642M6k8o.png",
  anthropic: "https://framerusercontent.com/images/nXLzUoLeko3J21YKJiWRCKzBLE.png",
  deepseek: "https://avatars.githubusercontent.com/u/145917633",
  meta: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/1280px-Meta_Platforms_Inc._logo.svg.png",
  chatglm: "https://cdn.tse4-mm.cn.bing.net/th/id/OIP-C.3J7B3GAsLdQ-caoA4NN9wAHaHa",
  alibaba: "https://logowik.com/content/uploads/images/alibaba-group2933.jpg",
  athene: "https://pbs.twimg.com/profile_images/1751975661099257856/83PSMX6w_400x400.jpg",
  xai: "https://grok.x.ai/assets/images/logo/logo.svg",
  yi: "https://www.01.ai/assets/logo.svg",
  default: "https://cdn-icons-png.flaticon.com/512/4616/4616734.png" // Default logo for unknown providers
};

const models = [
  // Anthropic Models
  { value: "claude-3-5-sonnet-20241022", label: "Claude 3.5 Sonnet (20241022)", provider: "anthropic" },
  { value: "claude-3-5-sonnet-20240620", label: "Claude 3.5 Sonnet (20240620)", provider: "anthropic" },

  // OpenAI Models
  { value: "gpt-4o-latest-20241120", label: "ChatGPT-4o Latest (2024-11-20)", provider: "openai" },
  { value: "gpt-4o-20240513", label: "GPT-4o (2024-05-13)", provider: "openai" },
  { value: "gpt-4o-mini-20240718", label: "GPT-4o Mini (2024-07-18)", provider: "openai" },
  { value: "o1-preview", label: "O1 Preview", provider: "openai" },
  { value: "o1-pro", label: "O1 Pro", provider: "openai" },
  { value: "o1-mini", label: "O1 Mini", provider: "openai" },
  { value: "o3-mini-high", label: "O3 Mini High", provider: "openai" },
  { value: "o3-mini", label: "O3 Mini", provider: "openai" },

  // Google Models
  { value: "gemini-2-flash-thinking-exp-0121", label: "Gemini 2.0 Flash Thinking Exp (01-21)", provider: "google" },
  { value: "gemini-2-pro-exp-0205", label: "Gemini 2.0 Pro Exp (02-05)", provider: "google" },
  { value: "gemini-2-flash-001", label: "Gemini 2.0 Flash 001", provider: "google" },
  { value: "gemini-2-flash-lite-preview-0205", label: "Gemini 2.0 Flash Lite Preview (02-05)", provider: "google" },
  { value: "gemini-1-5-pro-002", label: "Gemini 1.5 Pro 002", provider: "google" },
  { value: "gemini-1-5-flash-002", label: "Gemini 1.5 Flash 002", provider: "google" },

  // xAI Models
  { value: "grok-2-0813", label: "Grok 2 (08-13)", provider: "xai" },
  { value: "grok-2-mini-0813", label: "Grok 2 Mini (08-13)", provider: "xai" },

  // DeepSeek Models
  { value: "deepseek-r1", label: "DeepSeek R1", provider: "deepseek" },
  { value: "deepseek-v3", label: "DeepSeek V3", provider: "deepseek" },
  { value: "deepseek-v2-5-1210", label: "Deepseek v2.5 (1210)", provider: "deepseek" },

  // Alibaba Models
  { value: "qwen2-5-max", label: "Qwen2.5 Max", provider: "alibaba" },
  { value: "qwen2-5-plus-1127", label: "Qwen2.5 Plus (1127)", provider: "alibaba" },

  // ChatGLM Models
  { value: "glm-4-plus-0111", label: "GLM-4 Plus (0111)", provider: "chatglm" },
  { value: "glm-4-plus", label: "GLM-4 Plus", provider: "chatglm" },

  // Yi Models
  { value: "yi-lightning", label: "Yi Lightning", provider: "yi" },

  // Other Models
  { value: "athene-v2-chat-72b", label: "Athene v2 Chat 72B", provider: "athene" },
  { value: "llama-3-1-nemotron-70b", label: "Llama 3.1 Nemotron 70B", provider: "meta" },
  { value: "meta-llama-3-1-405b-instruct-bf16", label: "Meta Llama 3.1 405B Instruct BF16", provider: "meta" },
  { value: "meta-llama-3-1-405b-instruct-fp8", label: "Meta Llama 3.1 405B Instruct FP8", provider: "meta" },
];

export default function Chat() {
  const [message, setMessage] = useState("");
  const [selectedModel, setSelectedModel] = useState(models[0].value);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [preserveContext, setPreserveContext] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Get chat history from API
  const { data: historyData = [], isLoading: isHistoryLoading } = useQuery<Message[]>({
    queryKey: ["/api/chat/history"],
    onSuccess: (data) => {
      if (data.length > 0) {
        // Ensure messages have timestamps
        const messagesWithTimestamps = data.map(msg => ({
          ...msg,
          timestamp: msg.timestamp || new Date().toISOString()
        }));
        setChatMessages(messagesWithTimestamps);
      }
    }
  });

  // Get API keys
  const { data: apiKeys = [] } = useQuery<ApiKey[]>({
    queryKey: ["/api/keys"],
  });

  // Scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  // Send message mutation
  const { mutate: sendMessage, isPending: isSending } = useMutation({
    mutationFn: async (content: string) => {
      // Get recent messages for context (last 10 messages)
      // When preserveContext is true, we want messages regardless of the model
      // When false, we only want messages from the current model
      const contextMessages = preserveContext
        ? chatMessages.slice(-10)
        : chatMessages.filter(msg => msg.model === selectedModel).slice(-10);
      
      // Add current message to context
      const userMessage: Message = {
        role: "user",
        content,
        model: selectedModel,
        timestamp: new Date().toISOString()
      };
      
      // Format messages for API - only send the required fields
      const fullContext = [...contextMessages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      console.log(`Sending message to model: ${selectedModel} with ${fullContext.length} context messages`);
      console.log("API Request:", { model: selectedModel, messages: fullContext, preserveContext });
      
      // Call API with context
      const response = await apiRequest("POST", "/api/chat", {
        model: selectedModel,
        messages: fullContext,
        preserveContext
      });
      
      return response;
    },
    onSuccess: (data) => {
      // Add the assistant's response to chat
      setChatMessages(prev => {
        // Replace the "typing" indicator with the real response
        if (prev.length > 0 && prev[prev.length - 1].content === "...") {
          const updated = [...prev];
          updated[prev.length - 1] = {
            role: "assistant",
            content: data.response,
            model: selectedModel,
            timestamp: new Date().toISOString()
          };
          return updated;
        }
        
        // Otherwise just add the new message
        return [...prev, {
          role: "assistant",
          content: data.response,
          model: selectedModel,
          timestamp: new Date().toISOString()
        }];
      });
      
      setIsTyping(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to get a response from the AI",
        variant: "destructive",
      });
      
      // Remove the "typing" indicator if there was an error
      setChatMessages(prev => {
        if (prev.length > 0 && prev[prev.length - 1].content === "...") {
          return prev.slice(0, -1);
        }
        return prev;
      });
      
      setIsTyping(false);
    }
  });

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Check if user has an API key for the selected model's provider
    const modelInfo = models.find(m => m.value === selectedModel);
    const provider = modelInfo?.provider || "";
    const hasApiKey = apiKeys.some(key => key.provider === provider);
    
    if (!hasApiKey) {
      toast({
        title: "API Key Required",
        description: `You need to add an API key for ${provider} to use this model`,
        variant: "destructive",
      });
      setIsSettingsOpen(true);
      return;
    }
    
    // Add user message to chat
    setChatMessages(prev => [...prev, {
      role: "user",
      content: message,
      model: selectedModel,
      timestamp: new Date().toISOString()
    }]);
    
    // Add typing indicator
    setChatMessages(prev => [...prev, {
      role: "assistant",
      content: "...",
      model: selectedModel,
      timestamp: new Date().toISOString()
    }]);
    
    setIsTyping(true);
    
    // Send message to API
    sendMessage(message);
    
    // Clear input
    setMessage("");
  };

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Get provider logo for a model
  const getProviderLogo = (modelId: string) => {
    const modelInfo = models.find(m => m.value === modelId);
    const provider = modelInfo?.provider || "default";
    return providerLogos[provider] || providerLogos.default;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-slate-900/70 border-slate-800 shadow-xl overflow-hidden">
        <div className="flex bg-slate-800 p-3 items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-medium text-white">AI Chat</h3>
            
            {/* Model selector with logo */}
            <div className="flex items-center gap-2">
              <Select
                value={selectedModel}
                onValueChange={setSelectedModel}
              >
                <SelectTrigger className="w-[220px] bg-slate-900 border-slate-700 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full overflow-hidden bg-slate-800 flex-shrink-0">
                      <img 
                        src={getProviderLogo(selectedModel)}
                        alt="Model provider"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = providerLogos.default;
                        }}
                      />
                    </div>
                    <SelectValue placeholder="Select a model" />
                  </div>
                </SelectTrigger>
                <SelectContent className="max-h-80 bg-slate-900 border-slate-700">
                  {Object.entries(providerLogos).filter(([key]) => key !== 'default').map(([provider, logo]) => (
                    <SelectGroup key={provider}>
                      <SelectLabel className="text-slate-400">{provider.charAt(0).toUpperCase() + provider.slice(1)}</SelectLabel>
                      {models.filter(model => model.provider === provider).map(model => (
                        <SelectItem key={model.value} value={model.value} className="pl-8 relative">
                          <div className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full overflow-hidden">
                            <img 
                              src={logo}
                              alt={provider}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = providerLogos.default;
                              }}
                            />
                          </div>
                          {model.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Context preservation toggle */}
              <div className="flex items-center gap-2">
                <Switch 
                  id="context-toggle"
                  checked={preserveContext}
                  onCheckedChange={setPreserveContext}
                  className="data-[state=checked]:bg-indigo-600"
                />
                <Label htmlFor="context-toggle" className="text-xs text-slate-300">
                  Preserve Context
                </Label>
              </div>
            </div>
          </div>
          
          <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="border-slate-700 bg-slate-900">
                <Settings className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-slate-900 border-slate-700">
              <SheetHeader>
                <SheetTitle className="text-white">API Settings</SheetTitle>
                <SheetDescription className="text-slate-400">
                  Add your API keys to use different AI models
                </SheetDescription>
              </SheetHeader>
              
              <div className="mt-6 space-y-4">
                {/* API key settings UI would go here */}
                <div className="text-slate-300">
                  API key management interface
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        <CardContent className="p-0">
          {/* Chat messages */}
          <div className="h-[600px] overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-900 to-indigo-950/50">
            {chatMessages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-slate-500">
                <div className="text-center">
                  <Bot className="h-12 w-12 mx-auto text-slate-600 mb-3" />
                  <p>No messages yet. Start a conversation!</p>
                </div>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {chatMessages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.role === "user"
                          ? "bg-indigo-600/20 border border-indigo-500/30 text-white"
                          : "bg-slate-800 border border-slate-700/70 text-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {msg.role === "user" ? (
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center">
                              <User className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-xs font-medium text-indigo-300">You</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center">
                              <img 
                                src={getProviderLogo(msg.model)}
                                alt="AI"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = providerLogos.default;
                                }}
                              />
                            </div>
                            <span className="text-xs font-medium text-slate-400">
                              {models.find(m => m.value === msg.model)?.label || msg.model}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {msg.content === "..." ? (
                        <div className="flex space-x-1 items-center py-1">
                          <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                          <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                          <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                        </div>
                      ) : (
                        <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input area */}
          <div className="p-4 border-t border-slate-800 bg-slate-900">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="bg-slate-800 border-slate-700 text-white"
                disabled={isTyping || isSending}
              />
              <Button 
                type="submit" 
                disabled={!message.trim() || isTyping || isSending}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {isTyping || isSending ? (
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}