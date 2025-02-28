
import React from "react";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="app-container p-4 pb-8">
        <header className="mb-8 pt-2">
          <div className="flex justify-between items-center mb-4">
            {/* Logo on the left */}
            <div className="flex items-center">
              <h1 className="text-3xl font-medium">
                <span className="text-wax-800">Glow</span>
                <span className="text-wax-500">Wax</span>
              </h1>
            </div>
            
            {/* User name and icon on the right */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-wax-700 hidden sm:inline">Jane Doe</span>
              <div className="h-8 w-8 rounded-full bg-wax-100 flex items-center justify-center text-wax-500">
                <User size={18} />
              </div>
            </div>
          </div>
          
          <div className="animate-fade-in">
            <div className="text-center mb-2">
              <div className="inline-block bg-wax-100 text-wax-700 text-xs px-3 py-1 rounded-full font-medium">
                Premium Waxing Services
              </div>
            </div>
          </div>
        </header>
        <main className={cn("rounded-xl px-2", className)}>
          {children}
        </main>
        <footer className="text-center text-xs text-muted-foreground mt-12 pb-6">
          <p>© 2023 GlowWax. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
