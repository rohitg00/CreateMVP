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
    text: "During beta testing, this tool significantly streamlined our planning process. The implementation guidelines provided valuable structure for our team's development approach.",
    name: "Sarah Johnson",
    role: "Beta Tester, TechNova",
    rating: 5,
  },
  {
    text: "As part of the early access program, I've been impressed by how well the tool organizes project requirements into actionable steps. Looking forward to the public launch!",
    name: "Michael Chen",
    role: "Early Access Developer",
    rating: 5,
  },
  {
    text: "The level of detail in the generated implementation plans during the preview phase is promising. It's like having additional technical guidance on your team.",
    name: "Alex Rodriguez",
    role: "Product Manager, Beta Partner",
    rating: 4,
  },
  {
    text: "Our engineering team has been testing this platform during the pre-launch phase. It's helped us standardize our documentation approach across different projects.",
    name: "Priya Patel",
    role: "Pre-launch Partner, FinanceFlow",
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
            Beta Feedback
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Early Access Impressions
          </h2>
          <p className="text-slate-400 text-lg max-w-lg mx-auto">
            Here's what our beta testers and early access participants are saying about their experience with our platform.
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
            <span>4.8/5 average rating from our beta program</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 