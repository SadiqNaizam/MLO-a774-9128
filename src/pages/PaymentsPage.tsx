import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import BottomTabBar from '@/components/layout/BottomTabBar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar as CalendarIcon, TrendingUp, ArrowRightLeft, CreditCard, User, PlusCircle, CheckCircle, Repeat, Trash2, Edit3 } from 'lucide-react'; // Icons
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Toaster as SonnerToaster, toast as sonnerToast } from "@/components/ui/sonner";

// For react-hook-form
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const paymentSchema = z.object({
  payeeName: z.string().min(1, "Payee name is required."),
  paymentReference: z.string().min(1, "Payment reference is required."),
  amount: z.coerce.number().positive("Amount must be positive."),
  frequency: z.enum(["once", "monthly", "quarterly", "annually"]),
  startDate: z.date(),
  endDate: z.date().optional(),
}).refine(data => data.frequency === 'once' || (data.frequency !== 'once' && data.endDate && data.endDate > data.startDate), {
  message: "End date must be after start date for recurring payments.",
  path: ["endDate"],
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

const sampleScheduledPayments = [
  { id: 'pay1', payeeName: 'Council Tax', amount: 150.00, frequency: 'monthly', nextPayment: '2024-08-01' },
  { id: 'pay2', payeeName: 'Netflix Subscription', amount: 10.99, frequency: 'monthly', nextPayment: '2024-07-25' },
  { id: 'pay3', payeeName: 'Gym Membership', amount: 35.00, frequency: 'monthly', nextPayment: '2024-08-05' },
];


const PaymentsPage = () => {
  const navigate = useNavigate();
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentFormValues | null>(null);
  const [scheduledPayments, setScheduledPayments] = useState(sampleScheduledPayments);

  console.log('PaymentsPage loaded');
  
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      payeeName: "",
      paymentReference: "",
      amount: 0,
      frequency: "once",
      startDate: new Date(),
    },
  });

  const onSubmit: SubmitHandler<PaymentFormValues> = (data) => {
    console.log('Payment form submitted:', data);
    setPaymentDetails(data);
    setShowReviewDialog(true);
  };

  const handleConfirmPayment = () => {
    console.log('Payment confirmed:', paymentDetails);
    setShowReviewDialog(false);

    if (paymentDetails?.frequency !== 'once') {
        const newScheduledPayment = {
            id: `pay${Date.now()}`,
            payeeName: paymentDetails.payeeName,
            amount: paymentDetails.amount,
            frequency: paymentDetails.frequency,
            nextPayment: format(paymentDetails.startDate, 'yyyy-MM-dd'), // simplified
        };
        setScheduledPayments(prev => [...prev, newScheduledPayment]);
        sonnerToast.success("Standing Order Set Up!", {
            description: `A ${paymentDetails.frequency} payment of £${paymentDetails.amount.toFixed(2)} to ${paymentDetails.payeeName} will start on ${format(paymentDetails.startDate, "PPP")}.`,
        });
    } else {
        sonnerToast.success("Payment Processed!", {
            description: `£${paymentDetails?.amount.toFixed(2)} paid to ${paymentDetails?.payeeName}.`,
        });
    }
    form.reset();
  };

  const handleDeleteScheduledPayment = (paymentId: string) => {
    setScheduledPayments(prev => prev.filter(p => p.id !== paymentId));
    sonnerToast.error("Scheduled Payment Cancelled", {
        description: `The payment with ID ${paymentId} has been cancelled.`,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header title="Payments" onUserIconClick={() => navigate('/profile-settings')} />
      <ScrollArea className="flex-grow p-4 md:p-6 pb-20">
        <main className="container mx-auto max-w-2xl space-y-6">
          <Tabs defaultValue="new-payment" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
              <TabsTrigger value="new-payment"><PlusCircle className="mr-2 h-4 w-4 md:hidden lg:inline-block" />New Payment</TabsTrigger>
              <TabsTrigger value="scheduled-payments"><Repeat className="mr-2 h-4 w-4 md:hidden lg:inline-block" />Scheduled</TabsTrigger>
              <TabsTrigger value="payment-history" disabled><CreditCard className="mr-2 h-4 w-4 md:hidden lg:inline-block" />History (Soon)</TabsTrigger>
            </TabsList>

            <TabsContent value="new-payment">
              <Card>
                <CardHeader>
                  <CardTitle>Make a Payment or Set Up Standing Order</CardTitle>
                  <CardDescription>Pay bills or schedule recurring payments.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField control={form.control} name="payeeName" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payee Name</FormLabel>
                            <FormControl><Input placeholder="e.g., Electricity Bill" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField control={form.control} name="paymentReference" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payment Reference</FormLabel>
                            <FormControl><Input placeholder="Your customer reference" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField control={form.control} name="amount" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount (£)</FormLabel>
                            <FormControl><Input type="number" step="0.01" placeholder="0.00" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField control={form.control} name="frequency" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Frequency</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Select frequency" /></SelectTrigger></FormControl>
                              <SelectContent>
                                <SelectItem value="once">One-time Payment</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="quarterly">Quarterly</SelectItem>
                                <SelectItem value="annually">Annually</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField control={form.control} name="startDate" render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Start Date / Payment Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} initialFocus/>
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {form.watch("frequency") !== "once" && (
                        <FormField control={form.control} name="endDate" render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>End Date (Optional for recurring)</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>
                                      {field.value ? format(field.value, "PPP") : <span>Pick an end date</span>}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < (form.getValues("startDate") || new Date())} />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>Review Payment</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="scheduled-payments">
              <Card>
                <CardHeader>
                  <CardTitle>Your Scheduled Payments</CardTitle>
                  <CardDescription>Manage your upcoming standing orders and recurring payments.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {scheduledPayments.length === 0 && <p className="text-sm text-muted-foreground">You have no scheduled payments.</p>}
                  {scheduledPayments.map(payment => (
                    <Card key={payment.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4">
                        <div>
                            <p className="font-semibold">{payment.payeeName}</p>
                            <p className="text-sm text-muted-foreground">£{payment.amount.toFixed(2)} - {payment.frequency}</p>
                            <p className="text-xs text-muted-foreground">Next payment: {format(new Date(payment.nextPayment), "PPP")}</p>
                        </div>
                        <div className="flex space-x-2 mt-2 sm:mt-0">
                            <Button variant="outline" size="sm" onClick={() => sonnerToast.info("Edit functionality not implemented.")}><Edit3 className="mr-1 h-3 w-3" /> Edit</Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteScheduledPayment(payment.id)}><Trash2 className="mr-1 h-3 w-3" /> Cancel</Button>
                        </div>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </ScrollArea>

      {/* Review Payment Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Your Payment</DialogTitle>
            <DialogDescription>Please check the details before confirming.</DialogDescription>
          </DialogHeader>
          {paymentDetails && (
            <div className="space-y-3 py-4">
              <p><strong>Payee:</strong> {paymentDetails.payeeName}</p>
              <p><strong>Reference:</strong> {paymentDetails.paymentReference}</p>
              <p><strong>Amount:</strong> £{paymentDetails.amount.toFixed(2)}</p>
              <p><strong>Frequency:</strong> {paymentDetails.frequency}</p>
              <p><strong>Start Date:</strong> {format(paymentDetails.startDate, "PPP")}</p>
              {paymentDetails.endDate && <p><strong>End Date:</strong> {format(paymentDetails.endDate, "PPP")}</p>}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReviewDialog(false)}>Edit</Button>
            <Button onClick={handleConfirmPayment}><CheckCircle className="mr-2 h-4 w-4" /> Confirm Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BottomTabBar navItems={[
          { path: '/accounts-dashboard', label: 'Home', icon: TrendingUp },
          { path: '/transfers', label: 'Transfers', icon: ArrowRightLeft },
          { path: '/payments', label: 'Payments', icon: CreditCard },
          { path: '/profile-settings', label: 'Profile', icon: User },
        ]} />
      <SonnerToaster richColors />
    </div>
  );
};

export default PaymentsPage;