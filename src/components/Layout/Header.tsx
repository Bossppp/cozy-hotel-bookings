
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();
  };

  return (
    <header className="navbar animate-slide-down">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
            StayEase
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <Link 
            to="/hotels" 
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Hotels
          </Link>
          {isAuthenticated && (
            <Link 
              to="/dashboard" 
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              My Bookings
            </Link>
          )}
          {isAuthenticated && user?.role === "admin" && (
            <Link 
              to="/admin" 
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              Admin
            </Link>
          )}
        </nav>

        {/* Auth Buttons (Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8 hover:ring-2 hover:ring-blue-400 transition-all">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {user ? getInitials(user.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-4 py-3">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer w-full">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="cursor-pointer w-full">
                    My Bookings
                  </Link>
                </DropdownMenuItem>
                {user?.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="cursor-pointer w-full">
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="default" size="sm">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          className="md:hidden rounded-md p-2 text-foreground/70 hover:bg-secondary transition-colors"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-background z-50 flex flex-col animate-fade-in">
            <div className="flex items-center justify-between p-4 border-b">
              <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                  StayEase
                </span>
              </Link>
              <button
                onClick={closeMenu}
                className="rounded-md p-2 text-foreground/70 hover:bg-secondary transition-colors"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex flex-col p-4 space-y-4">
              <Link
                to="/"
                onClick={closeMenu}
                className="text-base font-medium p-2 hover:bg-secondary rounded-md transition-colors"
              >
                Home
              </Link>
              <Link
                to="/hotels"
                onClick={closeMenu}
                className="text-base font-medium p-2 hover:bg-secondary rounded-md transition-colors"
              >
                Hotels
              </Link>
              {isAuthenticated && (
                <Link
                  to="/dashboard"
                  onClick={closeMenu}
                  className="text-base font-medium p-2 hover:bg-secondary rounded-md transition-colors"
                >
                  My Bookings
                </Link>
              )}
              {isAuthenticated && user?.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={closeMenu}
                  className="text-base font-medium p-2 hover:bg-secondary rounded-md transition-colors"
                >
                  Admin
                </Link>
              )}

              <div className="border-t pt-4 mt-2">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-3 p-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {user ? getInitials(user.name) : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                    <div className="space-y-2 mt-4">
                      <Link
                        to="/profile"
                        onClick={closeMenu}
                        className="block text-base font-medium p-2 hover:bg-secondary rounded-md transition-colors"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          closeMenu();
                        }}
                        className="w-full text-left text-base font-medium p-2 hover:bg-destructive/10 text-destructive rounded-md transition-colors"
                      >
                        Log out
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col space-y-3 px-2">
                    <Link to="/login" onClick={closeMenu}>
                      <Button variant="outline" className="w-full">
                        Sign in
                      </Button>
                    </Link>
                    <Link to="/register" onClick={closeMenu}>
                      <Button className="w-full">Register</Button>
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
