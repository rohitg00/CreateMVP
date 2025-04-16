import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { tools, categories } from "@/data/tools";
import * as Si from "react-icons/si";
import { Badge } from "@/components/ui/badge";

export default function ToolComparison() {
  const [selectedTools, setSelectedTools] = useState<string[]>([]);

  const handleToolSelect = (value: string) => {
    if (selectedTools.length < 3 && !selectedTools.includes(value)) {
      setSelectedTools([...selectedTools, value]);
    }
  };

  const handleToolRemove = (toolName: string) => {
    setSelectedTools(selectedTools.filter(name => name !== toolName));
  };

  const selectedToolsData = selectedTools.map(name => 
    tools.find(tool => tool.name === name)
  ).filter(Boolean);

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Compare AI Tools</h2>
        <Select onValueChange={handleToolSelect}>
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue placeholder="Select a tool to compare" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <div key={category}>
                <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                  {category}
                </div>
                {tools
                  .filter(tool => tool.category === category)
                  .map(tool => (
                    <SelectItem 
                      key={tool.name} 
                      value={tool.name}
                      disabled={selectedTools.includes(tool.name)}
                    >
                      {tool.name}
                    </SelectItem>
                  ))}
              </div>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {selectedToolsData.map(tool => {
          if (!tool) return null;
          const IconComponent = Si[tool.icon];
          
          return (
            <Card key={tool.name} className="relative">
              <button
                onClick={() => handleToolRemove(tool.name)}
                className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
              >
                ×
              </button>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  {IconComponent && <IconComponent className="w-6 h-6" />}
                  <h3 className="font-semibold">{tool.name}</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <span className="font-semibold">Category:</span>
                    <Badge className="ml-2">{tool.category}</Badge>
                  </div>
                  
                  <div>
                    <span className="font-semibold">Pricing:</span>
                    <p className="text-sm text-muted-foreground">{tool.pricing}</p>
                  </div>
                  
                  <div>
                    <span className="font-semibold">Features:</span>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {tool.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <span className="font-semibold">Use Case:</span>
                    <p className="text-sm text-muted-foreground">{tool.useCase}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedTools.length === 0 && (
        <div className="text-center text-muted-foreground mt-8">
          Select tools above to compare their features
        </div>
      )}
    </div>
  );
}
