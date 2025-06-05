import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Assuming react-router-dom for navigation
import { Home, Send, CreditCard, User } from 'lucide-react'; // Example icons
import { cn } from '@/lib/utils'; // For conditional class names

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType; // Lucide icon component
}

const defaultNavItems: NavItem[] = [
  { path: '/dashboard', label: 'Home', icon: Home },
  { path: '/transfers', label: 'Transfers', icon: Send },
  { path: '/payments', label: 'Payments', icon: CreditCard },
  { path: '/profile', label: 'Profile', icon: User },
];

interface BottomTabBarProps {
  navItems?: NavItem[];
}

const BottomTabBar: React.FC<BottomTabBarProps> = ({ navItems = defaultNavItems }) => {
  const location = useLocation();
  console.log("Rendering BottomTabBar, current path:", location.pathname);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="container flex h-16 items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          const IconComponent = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 p-2 rounded-md transition-colors",
                isActive
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <IconComponent className="h-6 w-6" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomTabBar;