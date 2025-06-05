import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, TrendingUp } from 'lucide-react'; // Example icons

interface AccountSummaryCardProps {
  accountId: string;
  accountName: string;
  accountType?: string; // e.g., "Savings", "Current"
  balance: number;
  currencySymbol?: string;
  lastUpdated?: string; // e.g., "Today, 10:30 AM" or a Date object
  onViewDetails?: (accountId: string) => void;
  onViewTransactions?: (accountId: string) => void;
  isLoading?: boolean; // To show placeholders or skeleton
}

const AccountSummaryCard: React.FC<AccountSummaryCardProps> = ({
  accountId,
  accountName,
  accountType,
  balance,
  currencySymbol = "$",
  lastUpdated,
  onViewDetails,
  onViewTransactions,
  isLoading = false,
}) => {
  console.log("Rendering AccountSummaryCard for account:", accountName, "isLoading:", isLoading);

  const formattedBalance = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currencySymbol === '$' ? 'USD' : currencySymbol, // Basic currency handling
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(balance);

  if (isLoading) {
    // Basic skeleton representation - could use shadcn Skeleton for more complex layouts
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-3/4"></div>
          {accountType && <div className="h-4 bg-muted rounded w-1/2 mt-1"></div>}
        </CardHeader>
        <CardContent>
          <div className="h-10 bg-muted rounded w-1/2 mb-2"></div>
          {lastUpdated && <div className="h-4 bg-muted rounded w-1/3"></div>}
        </CardContent>
        {(onViewDetails || onViewTransactions) && (
          <CardFooter className="flex justify-end space-x-2">
            <div className="h-9 w-20 bg-muted rounded"></div>
            <div className="h-9 w-20 bg-muted rounded"></div>
          </CardFooter>
        )}
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{accountName}</CardTitle>
        {accountType && <p className="text-sm text-muted-foreground">{accountType}</p>}
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-primary">{formattedBalance}</p>
        {lastUpdated && (
          <p className="text-xs text-muted-foreground mt-1">
            Last updated: {typeof lastUpdated === 'string' ? lastUpdated : lastUpdated?.toLocaleTimeString()}
          </p>
        )}
      </CardContent>
      {(onViewDetails || onViewTransactions) && (
        <CardFooter className="flex flex-col sm:flex-row sm:justify-end sm:space-x-2 space-y-2 sm:space-y-0">
          {onViewTransactions && (
            <Button variant="outline" size="sm" onClick={() => onViewTransactions(accountId)} className="w-full sm:w-auto">
              <TrendingUp className="mr-2 h-4 w-4" /> Transactions
            </Button>
          )}
          {onViewDetails && (
            <Button variant="default" size="sm" onClick={() => onViewDetails(accountId)} className="w-full sm:w-auto">
              <Eye className="mr-2 h-4 w-4" /> View Details
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default AccountSummaryCard;