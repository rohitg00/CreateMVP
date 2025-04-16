import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "wouter";

// FAQ data
const faqItems = [
  {
    question: "What is CreateMVP?",
    answer: "CreateMVP is a platform that helps developers and entrepreneurs create comprehensive documentation and implementation plans for their Minimum Viable Products using AI technology. Our platform analyzes your requirements and generates detailed technical specifications, architecture diagrams, and implementation roadmaps."
  },
  {
    question: "Do I need coding experience to use this platform?",
    answer: "No, you don't need coding experience to use our platform. Our AI-powered tools are designed to help both technical and non-technical users create detailed MVP plans. The documentation we generate can be used to communicate your vision to developers or to guide your own implementation efforts."
  },
  {
    question: "How accurate are the AI-generated plans?",
    answer: "Our AI-generated plans are highly accurate and comprehensive. We've trained our models on thousands of successful MVP implementations across various industries. However, we recommend reviewing the generated plans and making adjustments based on your specific requirements and constraints."
  },
  {
    question: "Can I customize the generated documentation?",
    answer: "Yes, all generated documentation can be fully customized. After our AI creates the initial plans, you can edit, add, or remove any sections to match your specific needs. The platform provides an intuitive editor for making these adjustments."
  },
  {
    question: "What types of projects can I create documentation for?",
    answer: "Our platform supports a wide range of project types, including web applications, mobile apps, desktop software, APIs, browser extensions, and more. The AI adapts its recommendations based on the type of project you're building."
  },
  {
    question: "How do I get started?",
    answer: "Getting started is easy! Simply sign up for an account, describe your project idea or upload your requirements document, and our AI will analyze it and generate comprehensive documentation. You can then review, customize, and download the documentation for your implementation."
  }
];

interface FaqSectionProps {
  isVisible: boolean;
}

export default function FaqSection({ isVisible }: FaqSectionProps) {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-40 left-20 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Find answers to common questions about our AI-powered MVP documentation platform
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700/30 px-6 overflow-hidden"
              >
                <AccordionTrigger className="text-white text-lg font-medium py-5 hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-300 pb-5">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-slate-400">
            Still have questions? <Link href="/contact"><span className="text-indigo-400 hover:text-indigo-300">Contact our support team</span></Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
} 