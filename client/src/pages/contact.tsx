import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mail, User, MessageSquare } from "lucide-react";
import GradientOverlay from "@/components/GradientOverlay";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would be implemented to handle the form submission
    console.log("Form submitted:", formData);
    alert("Message sent! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 py-16">
      {/* Background elements */}
      <div className="absolute inset-0 bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/30 to-slate-950/60" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-30" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30" />
        
        {/* Decorative circles */}
        <div className="absolute top-20 right-[10%] w-[400px] h-[400px] rounded-full bg-indigo-600/10 blur-3xl"></div>
        <div className="absolute bottom-20 left-[10%] w-[300px] h-[300px] rounded-full bg-purple-600/10 blur-3xl"></div>
      </div>
      
      <div className="container relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-block px-3 py-1.5 mb-4 text-sm font-medium text-indigo-300 bg-indigo-950/60 border border-indigo-800/40 rounded-full">
            Get in Touch With Us
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500 mb-4">
            Contact Us
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto text-lg">
            Have questions or need help with your MVP? Our team is here to assist you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 rounded-2xl border border-slate-800/50 shadow-xl backdrop-blur-sm overflow-hidden"
        >
          <div className="p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-white font-medium mb-2">
                  Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your name"
                    className="bg-slate-800/50 border-slate-700 text-white pl-10 focus:border-indigo-500 focus:ring-indigo-500/20"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-white font-medium mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className="bg-slate-800/50 border-slate-700 text-white pl-10 focus:border-indigo-500 focus:ring-indigo-500/20"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-white font-medium mb-2">
                  Message
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <MessageSquare className="h-5 w-5 text-slate-400" />
                  </div>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="How can we help you?"
                    className="min-h-[150px] bg-slate-800/50 border-slate-700 text-white pl-10 focus:border-indigo-500 focus:ring-indigo-500/20"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <Button 
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-3 text-base font-medium"
              >
                Send Message
                <Send className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 