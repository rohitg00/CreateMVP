import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { tools, categories, toolsByCategory } from "@/data/tools";
import StepCard from "@/components/StepCard";
import ToolCard from "@/components/ToolCard";
import ToolComparison from "@/components/ToolComparison";
import RequirementUpload from "@/components/RequirementUpload";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { steps } from "@/data/steps";
import { cn } from "@/lib/utils";
import { ArrowRight, Info } from "lucide-react";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Check viewport size for responsive adjustments
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const filteredTools = selectedCategory === "all" 
    ? tools 
    : toolsByCategory[selectedCategory] || [];

  // Responsive class names
  const sectionClasses = "mb-16 sm:mb-20 md:mb-24 px-4 sm:px-6 lg:px-8";
  const containerClasses = "container-fluid mx-auto";
  const headingClasses = "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-balance";
  const gridClasses = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8";

  return (
    <div className="min-h-screen w-full py-8 sm:py-12 md:py-16">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn("text-center", sectionClasses)}
      >
        <h1 className={cn(headingClasses, "bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-4")}>
          Creating MVPs with AI Tools
        </h1>
        <p className="text-slate-300 max-w-3xl mx-auto text-pretty mb-8 text-base sm:text-lg md:text-xl">
          Explore our curated collection of AI-powered tools to help you rapidly
          prototype and build your next project. From idea to MVP in record time.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Start Building
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            leftIcon={<Info className="w-4 h-4" />}
          >
            Learn More
          </Button>
        </div>
      </motion.div>

      {/* Badges Section */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
        <a href="https://www.producthunt.com/posts/createmvp-build-apps-faster-with-ai?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-createmvp-build-apps-faster-with-ai" target="_blank" rel="noopener noreferrer" className="block">
          <img 
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=956027&theme=light&t=1745322386388" 
            alt="CreateMVP: Build Apps Faster with AI - Create MVPs with AI in seconds | Product Hunt" 
            className="w-[250px] h-[54px]"
            width="250" 
            height="54" 
          />
        </a>
        <a href="https://startupfa.me/s/createmvp?utm_source=createmvps.app" target="_blank" rel="noopener noreferrer" className="block">
          <img 
            src="https://startupfa.me/badges/featured-badge.webp" 
            alt="Featured on Startup Fame" 
            className="w-[171px] h-[54px]"
            width="171" 
            height="54" 
          />
        </a>
      </div>

      <section className={sectionClasses}>
        <div className={containerClasses}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className={cn(headingClasses, "mb-4")}>How It Works</h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-pretty text-base sm:text-lg">
              Our streamlined process helps you go from concept to working product
              in just a few steps, leveraging the power of AI.
            </p>
          </motion.div>

          <div className={gridClasses}>
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <StepCard
                  number={index + 1}
                  title={step.title}
                  description={step.description}
                  tools={step.tools}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Tools Section */}
      <section className={sectionClasses}>
        <div className={containerClasses}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className={cn(headingClasses, "mb-4")}>AI Tools</h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-pretty text-base sm:text-lg">
              Discover the best AI-powered tools to accelerate your development
              workflow and bring your ideas to life faster.
            </p>
          </motion.div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 justify-center mb-8 px-4">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size={isMobile ? "sm" : "default"}
              onClick={() => setSelectedCategory("all")}
              className="rounded-full"
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size={isMobile ? "sm" : "default"}
                onClick={() => setSelectedCategory(category)}
                className="rounded-full"
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>

          {/* Tools Grid */}
          <div className={gridClasses}>
            {filteredTools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
              >
                <ToolCard {...tool} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tool Comparison Section */}
      <section className={sectionClasses}>
        <div className={containerClasses}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className={cn(headingClasses, "mb-4")}>Compare Tools</h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-pretty text-base sm:text-lg">
              See how different AI tools stack up against each other to make the
              best choice for your project needs.
            </p>
          </motion.div>

          <ToolComparison />
        </div>
      </section>

      {/* Requirements Upload Section */}
      <section className={sectionClasses}>
        <div className={containerClasses}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className={cn(headingClasses, "mb-4")}>Generate Your Project</h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-pretty text-base sm:text-lg">
              Upload your project requirements and let our AI suggest the best
              tools and generate starter code for your MVP.
            </p>
          </motion.div>

          <RequirementUpload />
        </div>
      </section>
    </div>
  );
}