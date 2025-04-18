
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Gamepad2, LogOut } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';

const Navbar = () => {
  const { signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gaming-muted/30 bg-gaming-card/90 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Gamepad2 className="h-6 w-6 text-gaming-primary" />
          <span className="text-xl font-bold">GameTrack</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm text-gaming-foreground hover:text-gaming-primary">Dashboard</Link>
          <a href="#" className="text-sm text-gaming-foreground hover:text-gaming-primary">Explore</a>
          <a href="#" className="text-sm text-gaming-foreground hover:text-gaming-primary">Deals</a>
        </nav>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={signOut}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
