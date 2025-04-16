import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import * as Si from "react-icons/si";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Tool } from "@/data/tools";

interface ToolCardProps extends Tool {}

export default function ToolCard({ 
  name, 
  description, 
  url, 
  icon, 
  pricing, 
  features, 
  useCase,
  category 
}: ToolCardProps) {
  const IconComponent = Si[icon];

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="h-full">
        <CardContent className="p-6 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-4">
            {IconComponent && (
              <IconComponent className="w-8 h-8 text-primary" />
            )}
            <div>
              <h3 className="text-xl font-semibold">{name}</h3>
              <Badge variant="secondary" className="mt-1">
                {category}
              </Badge>
            </div>
          </div>

          <p className="text-muted-foreground mb-4">{description}</p>

          <div className="flex flex-col gap-3 mb-4 flex-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-sm">
                  <span className="font-semibold">Pricing:</span> {pricing}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Pricing information may vary</p>
              </TooltipContent>
            </Tooltip>

            <div className="text-sm">
              <span className="font-semibold">Use Case:</span>
              <p className="text-muted-foreground">{useCase}</p>
            </div>

            <div className="text-sm">
              <span className="font-semibold">Key Features:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {features.map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full"
            rightIcon={<ExternalLink size={16} className="transition-transform group-hover:translate-x-1" />}
            asChild
          >
            <a href={url} target="_blank" rel="noopener noreferrer">
              Visit Tool
            </a>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}