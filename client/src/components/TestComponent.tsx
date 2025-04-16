import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function TestComponent() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-8 bg-slate-800 rounded-lg m-4 text-center">
      <h2 className="text-2xl font-bold text-white mb-4">Test Component</h2>
      <p className="text-slate-300 mb-4">Count: {count}</p>
      <Button 
        onClick={() => setCount(count + 1)}
        className="bg-indigo-600 hover:bg-indigo-700"
      >
        Increment
      </Button>
    </div>
  );
} 