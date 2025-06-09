import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  fallbackPath?: string;
}

export function ProtectedRoute({ 
  children, 
  fallbackPath = "/login" 
}: ProtectedRouteProps) {
  return <>{children}</>;
}

export default ProtectedRoute;
