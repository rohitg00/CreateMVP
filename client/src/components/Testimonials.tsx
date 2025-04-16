import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

interface TestimonialProps {
  text: string;
  name: string;
  role: string;
  rating?: number;
}

const testimonials: TestimonialProps[] = [
  {
    text: "This AI tool saved me so much time planning my startup's MVP. The implementation plan was comprehensive and helped us launch faster than anticipated.",
    name: "Sarah Johnson",
    role: "Founder, TechNova",
    rating: 5,
  },
  {
    text: "As a solo developer, No AI tool is helping me to generate landing pages in a single prompt. This tool generates everything I need to structure my project and build my landing page.",
    name: "Michael Chen",
    role: "Indie Developer",
    rating: 5,
  },
  {
    text: "The level of detail in the generated implementation plans is impressive. It's like having a technical co-founder helping you map out every aspect of your project.",
    name: "Alex Rodriguez",
    role: "Product Manager",
    rating: 4,
  },
  {
    text: "Our team uses this for all our new features. It creates consistent documentation and helps us align on technical requirements before writing a single line of code.",
    name: "Priya Patel",
    role: "CTO, FinanceFlow",
    rating: 5,
  },
];

const Testimonial = ({ text, name, role, rating = 5 }: TestimonialProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: "-100px" }}
      className="group flex flex-col h-full p-6 bg-gradient-to-b from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl border border-slate-700/30 shadow-lg hover:shadow-indigo-500/10 hover:border-slate-600/50 transition-all duration-300"
    >
      <div className="mb-4 flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < (rating || 5)
                ? "text-yellow-400 fill-yellow-400"
                : "text-slate-400"
            } mr-1`}
          />
        ))}
      </div>
      
      <div className="relative mb-4 flex-grow">
        <Quote className="absolute top-0 left-0 w-10 h-10 text-indigo-500/20 -mt-1 -ml-2" />
        <p className="text-slate-300 relative z-10 text-base lg:text-lg leading-relaxed pl-4">
          {text}
        </p>
      </div>
      
      <div className="flex items-center mt-auto">
        <div className="h-10 w-10 mr-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
          {name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <div className="font-medium text-white">{name}</div>
          <div className="text-slate-400 text-sm">{role}</div>
        </div>
      </div>
    </motion.div>
  );
};

export default function Testimonials() {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-slate-950"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f0a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f0a_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto text-center mb-12">
          <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold text-indigo-400 bg-indigo-950/60 rounded-full backdrop-blur-sm border border-indigo-800/30">
            User Experiences
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            What our community is saying
          </h2>
          <p className="text-slate-400 text-lg max-w-lg mx-auto">
            Join thousands of developers and founders who use our AI-powered platform to streamline their MVP development.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((testimonial, index) => (
            <Testimonial key={index} {...testimonial} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-300 bg-indigo-950/30 rounded-full backdrop-blur-sm border border-indigo-800/20 hover:bg-indigo-900/40 hover:text-indigo-200 transition-all duration-200"
          >
            <Star className="w-4 h-4 mr-2 fill-yellow-400 text-yellow-400" />
            <span>4.9/5 average rating from 200+ users</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 