import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import BottomTabBar from '@/components/layout/BottomTabBar';
import AccountSummaryCard from '@/components/AccountSummaryCard';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, ArrowRightLeft, CreditCard } from 'lucide-react'; // Icons
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

// Sample data for accounts
const sampleAccounts = [
  { id: 'acc123', name: 'Current Account', type: 'Checking', balance: 5250.75, currency: 'GBP', lastUpdated: 'Today, 10:45 AM' },
  { id: 'acc456', name: 'Savings Plus', type: 'Savings', balance: 12800.00, currency: 'GBP', lastUpdated: 'Yesterday, 3:20 PM' },
  { id: 'acc789', name: 'Holiday Fund', type: 'Savings', balance: 750.50, currency: 'GBP', lastUpdated: 'Today, 09:15 AM' },
];

// Sample data for chart
const chartData = [
  { month: "January", income: 1860, expenses: 800 },
  { month: "February", income: 2050, expenses: 950 },
  { month: "March", income: 2370, expenses: 1200 },
  { month: "April", income: 1980, expenses: 1000 },
  { month: "May", income: 2500, expenses: 1500 },
  { month: "June", income: 2120, expenses: 1100 },
];

const chartConfig = {
  income: { label: "Income", color: "hsl(var(--chart-1))" },
  expenses: { label: "Expenses", color: "hsl(var(--chart-2))" },
};


const AccountsDashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('AccountsDashboardPage loaded');
    // Simulate data fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleViewAccountDetails = (accountId: string) => {
    console.log('View details for account:', accountId);
    // navigate(`/accounts/${accountId}`); // Example navigation
    alert(`Navigate to details for account ${accountId}`);
  };

  const handleViewTransactions = (accountId: string) => {
    console.log('View transactions for account:', accountId);
    // navigate(`/accounts/${accountId}/transactions`); // Example navigation
    alert(`Navigate to transactions for account ${accountId}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header title="Dashboard" onUserIconClick={() => navigate('/profile-settings')} />
      <ScrollArea className="flex-grow p-4 md:p-6 pb-20"> {/* Added pb-20 for BottomTabBar */}
        <main className="container mx-auto max-w-4xl space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">My Accounts</h2>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <Card className="w-full animate-pulse" key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4 rounded" />
                      <Skeleton className="h-4 w-1/2 mt-1 rounded" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-10 w-1/2 mb-2 rounded" />
                      <Skeleton className="h-4 w-1/3 rounded" />
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2">
                      <Skeleton className="h-9 w-24 rounded" />
                      <Skeleton className="h-9 w-24 rounded" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sampleAccounts.map(account => (
                  <AccountSummaryCard
                    key={account.id}
                    accountId={account.id}
                    accountName={account.name}
                    accountType={account.type}
                    balance={account.balance}
                    currencySymbol="£"
                    lastUpdated={account.lastUpdated}
                    onViewDetails={handleViewAccountDetails}
                    onViewTransactions={handleViewTransactions}
                  />
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Button size="lg" className="w-full justify-start text-left bg-white text-gray-700 border border-gray-300 hover:bg-gray-100" onClick={() => navigate('/transfers')}>
                <ArrowRightLeft className="mr-3 h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-semibold">Make a Transfer</p>
                  <p className="text-xs text-gray-500">Send money to anyone</p>
                </div>
              </Button>
              <Button size="lg" className="w-full justify-start text-left bg-white text-gray-700 border border-gray-300 hover:bg-gray-100" onClick={() => navigate('/payments')}>
                <CreditCard className="mr-3 h-5 w-5 text-green-600" />
                 <div>
                  <p className="font-semibold">Pay a Bill</p>
                  <p className="text-xs text-gray-500">Manage your payments</p>
                </div>
              </Button>
               <Button size="lg" className="w-full justify-start text-left bg-white text-gray-700 border border-gray-300 hover:bg-gray-100" onClick={() => alert('Feature coming soon!')}>
                <TrendingUp className="mr-3 h-5 w-5 text-purple-600" />
                 <div>
                  <p className="font-semibold">Spending Overview</p>
                  <p className="text-xs text-gray-500">Track your expenses</p>
                </div>
              </Button>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Cashflow Summary (Last 6 Months)</h2>
            <Card>
              <CardContent className="pt-6">
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-64 w-full" />
                </div>
              ) : (
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                      <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `£${value / 1000}k`} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Bar dataKey="income" fill="var(--color-income)" radius={4} />
                      <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
              </CardContent>
            </Card>
          </section>
        </main>
      </ScrollArea>
      <BottomTabBar navItems={[
          { path: '/accounts-dashboard', label: 'Home', icon: TrendingUp },
          { path: '/transfers', label: 'Transfers', icon: ArrowRightLeft },
          { path: '/payments', label: 'Payments', icon: CreditCard },
          { path: '/profile-settings', label: 'Profile', icon: User },
        ]} />
    </div>
  );
};

export default AccountsDashboardPage;