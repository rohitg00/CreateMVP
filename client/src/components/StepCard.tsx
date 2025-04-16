import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  tools: string[];
}

export default function StepCard({ number, title, description, tools }: StepCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        delay: number * 0.2,
        duration: 0.5,
        ease: "easeOut"
      }}
    >
      <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow duration-300">
        <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <motion.div 
              className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              {number}
            </motion.div>
            <div className="flex-1 relative">
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-muted-foreground mb-4">{description}</p>
              <motion.div 
                className="flex flex-wrap gap-2"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
              >
                {tools.map((tool, index) => (
                  <motion.div
                    key={index}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                  >
                    <Badge variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                      {tool}
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}