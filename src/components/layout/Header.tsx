import React from 'react';
import { Bell, UserCircle } from 'lucide-react'; // Example icons
import { Button } from '@/components/ui/button';

interface HeaderProps {
  title?: string;
  showUserIcon?: boolean;
  showNotificationsIcon?: boolean;
  onUserIconClick?: () => void;
  onNotificationsIconClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title = "My App",
  showUserIcon = true,
  showNotificationsIcon = true,
  onUserIconClick,
  onNotificationsIconClick,
}) => {
  console.log("Rendering Header with title:", title);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            {/* Placeholder for a logo if you have one */}
            {/* <YourLogoIcon className="h-6 w-6" /> */}
            <span className="hidden font-bold sm:inline-block">
              {title}
            </span>
          </a>
          {/* <nav className="flex items-center space-x-6 text-sm font-medium">
            <a className="transition-colors hover:text-foreground/80 text-foreground/60" href="/dashboard">Dashboard</a>
            <a className="transition-colors hover:text-foreground/80 text-foreground/60" href="/settings">Settings</a>
          </nav> */}
        </div>
        {/* Mobile title / or centered title */}
        <div className="flex flex-1 items-center justify-center md:hidden">
            <span className="font-bold text-lg">{title}</span>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {showNotificationsIcon && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onNotificationsIconClick}
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </Button>
          )}
          {showUserIcon && (
             <Button
              variant="ghost"
              size="icon"
              onClick={onUserIconClick}
              aria-label="User Profile"
            >
              <UserCircle className="h-5 w-5" />
            </Button>
          )}
          {/* Mobile Menu Trigger (optional) */}
          {/* <button className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 py-2 mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="radix-:R16u6la:" data-state="closed">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </button> */}
        </div>
      </div>
    </header>
  );
};

export default Header;