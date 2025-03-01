import React from "react";
import { cn } from "@/lib/utils";
import { User, LogOut } from "lucide-react";
import { useUser, useClerk, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out successfully",
      description: "You have been signed out of your account",
    });
    navigate("/sign-in");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="app-container pb-8">
        <header className="mb-8 pt-2 bg-custom-primary xl p-4 shadow-md">
          <div className="flex justify-between items-center py-2">
            {/* Logo on the left */}
            <div className="flex items-center">
              <h1 className="text-3xl font-medium">
                {/* <span className="text-white">Glow</span>
                <span className="text-custom-secondary">Wax</span> */}
              </h1>
            </div>

            {/* User info and actions on the right */}
            <div className="flex items-center gap-2">
              <SignedIn>
                <span className="text-sm font-medium text-white hidden sm:inline">
                  {user?.firstName || user?.username || "User"}
                </span>
                <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                  {user?.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <User size={18} />
                  )}
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-white hover:text-custom-secondary transition-colors ml-2"
                >
                  <LogOut size={18} />
                </button>
              </SignedIn>
              <SignedOut>
                <Link
                  to="/sign-in"
                  className="text-white hover:text-custom-secondary transition-colors"
                >
                  Sign In
                </Link>
              </SignedOut>
            </div>
          </div>
        </header>
        <main className={cn("rounded-xl px-2", className)}>{children}</main>
        <footer className="text-center text-xs text-muted-foreground mt-12 pb-6">
          <p></p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
