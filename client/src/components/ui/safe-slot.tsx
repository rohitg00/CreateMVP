import React from 'react';
import { Slot } from "@radix-ui/react-slot";

/**
 * A wrapper for the Radix UI Slot component that safely handles the Children.only requirement
 * by ensuring there's only a single child passed to it.
 * 
 * This helps fix the common "React.Children.only expected to receive a single React element child" error
 * that occurs when there are whitespace nodes between JSX elements.
 */
export function SafeSlot({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Slot>) {
  // Ensure we're only passing a single React element to the Slot component
  const child = React.Children.toArray(children)[0];
  
  if (!React.isValidElement(child)) {
    return null;
  }
  
  return (
    <Slot {...props}>
      {child}
    </Slot>
  );
}