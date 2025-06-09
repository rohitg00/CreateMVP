import { ReactNode } from "react";
import { EarlyAccessBanner } from "@/components/ui/early-access-banner";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
  hideFooter?: boolean; 
}

export default function Layout({ children, hideFooter = false }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="sticky top-0 z-51">
        <EarlyAccessBanner />
      </div>
      <div className="flex-1">
        {children}
      </div>
      {!hideFooter && <Footer />}
    </div>
  );
}
