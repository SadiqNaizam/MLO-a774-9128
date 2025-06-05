import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import BottomTabBar from '@/components/layout/BottomTabBar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar as CalendarIcon, ArrowRightLeft, CreditCard, User, PlusCircle, CheckCircle } from 'lucide-react'; // Icons
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast"; // Using shadcn toast
import { Toaster as SonnerToaster, toast as sonnerToast } from "@/components/ui/sonner"; // Using sonner

// For react-hook-form
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const transferSchema = z.object({
  beneficiary: z.string().min(1, "Please select or add a beneficiary."),
  accountNumber: z.string().regex(/^\d{8}$/, "Enter a valid 8-digit account number."),
  sortCode: z.string().regex(/^\d{2}-\d{2}-\d{2}$/, "Enter a valid sort code (e.g., 20-30-40)."),
  amount: z.coerce.number().positive("Amount must be positive."),
  reference: z.string().max(50, "Reference too long.").optional(),
  transferDate: z.date().optional(),
});

type TransferFormValues = z.infer<typeof transferSchema>;

const savedBeneficiaries = [
  { id: 'ben1', name: 'John Doe', accountNumber: '12345678', sortCode: '20-00-00' },
  { id: 'ben2', name: 'Jane Smith (Rent)', accountNumber: '87654321', sortCode: '30-00-00' },
];

const TransfersPage = () => {
  const navigate = useNavigate();
  const { toast: shadcnToast } = useToast(); // For shadcn toast example (not used in this impl, sonner is used)
  const [showNewBeneficiaryDialog, setShowNewBeneficiaryDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [transferDetails, setTransferDetails] = useState<TransferFormValues | null>(null);

  console.log('TransfersPage loaded');

  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      beneficiary: "",
      accountNumber: "",
      sortCode: "",
      amount: 0,
      reference: "",
      transferDate: new Date(),
    },
  });

  const onSubmit: SubmitHandler<TransferFormValues> = (data) => {
    console.log('Transfer form submitted:', data);
    setTransferDetails(data);
    setShowReviewDialog(true);
  };
  
  const handleConfirmTransfer = () => {
    console.log('Transfer confirmed:', transferDetails);
    setShowReviewDialog(false);
    sonnerToast.success("Transfer Successful!", {
      description: `£${transferDetails?.amount.toFixed(2)} sent to ${transferDetails?.beneficiary === 'new' ? transferDetails?.accountNumber : savedBeneficiaries.find(b => b.id === transferDetails?.beneficiary)?.name}.`,
      action: {
        label: "View Dashboard",
        onClick: () => navigate('/accounts-dashboard'),
      },
    });
    form.reset(); // Reset form after successful transfer
  };

  const handleAddNewBeneficiary = () => {
    // Logic to actually save new beneficiary
    console.log("New beneficiary 'saved'");
    setShowNewBeneficiaryDialog(false);
    sonnerToast.info("New Beneficiary Added (Simulated)", { description: "You can now select them from the list." });
  };

  const selectedBeneficiaryId = form.watch("beneficiary");
  React.useEffect(() => {
    if (selectedBeneficiaryId && selectedBeneficiaryId !== "new") {
      const ben = savedBeneficiaries.find(b => b.id === selectedBeneficiaryId);
      if (ben) {
        form.setValue("accountNumber", ben.accountNumber);
        form.setValue("sortCode", ben.sortCode);
      }
    } else if (selectedBeneficiaryId === "new") {
        form.setValue("accountNumber", "");
        form.setValue("sortCode", "");
    }
  }, [selectedBeneficiaryId, form]);


  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header title="Transfers" onUserIconClick={() => navigate('/profile-settings')} />
      <ScrollArea className="flex-grow p-4 md:p-6 pb-20">
        <main className="container mx-auto max-w-lg space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">New Money Transfer</CardTitle>
              <CardDescription>Send funds securely to any UK bank account.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="beneficiary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>To</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a beneficiary or add new" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {savedBeneficiaries.map(ben => (
                              <SelectItem key={ben.id} value={ben.id}>{ben.name} ({ben.sortCode} / {ben.accountNumber.slice(-4)})</SelectItem>
                            ))}
                            <SelectItem value="new">
                              <div className="flex items-center">
                                <PlusCircle className="mr-2 h-4 w-4" /> Add New Beneficiary
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch("beneficiary") === "new" && (
                    <>
                     <FormField
                        control={form.control}
                        name="beneficiaryName" // Temporary field for new beneficiary name
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Beneficiary Name</FormLabel>
                            <FormControl><Input placeholder="Full Name" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl><Input placeholder="8-digit account number" {...field} disabled={selectedBeneficiaryId !== 'new' && !!selectedBeneficiaryId} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sortCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sort Code</FormLabel>
                        <FormControl><Input placeholder="e.g., 20-30-40" {...field} disabled={selectedBeneficiaryId !== 'new' && !!selectedBeneficiaryId} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount (£)</FormLabel>
                        <FormControl><Input type="number" step="0.01" placeholder="0.00" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="reference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reference (Optional)</FormLabel>
                        <FormControl><Input placeholder="e.g., Invoice payment" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="transferDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Transfer Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) } // Disable past dates
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                    Review Transfer
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </main>
      </ScrollArea>

      {/* Review Transfer Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Your Transfer</DialogTitle>
            <DialogDescription>Please check the details below before confirming.</DialogDescription>
          </DialogHeader>
          {transferDetails && (
            <div className="space-y-3 py-4">
              <p><strong>To:</strong> {transferDetails.beneficiary === 'new' ? `${form.getValues("beneficiaryName")} (New)` : savedBeneficiaries.find(b=>b.id === transferDetails.beneficiary)?.name}</p>
              <p><strong>Account Number:</strong> {transferDetails.accountNumber}</p>
              <p><strong>Sort Code:</strong> {transferDetails.sortCode}</p>
              <p><strong>Amount:</strong> £{transferDetails.amount.toFixed(2)}</p>
              {transferDetails.reference && <p><strong>Reference:</strong> {transferDetails.reference}</p>}
              <p><strong>Date:</strong> {format(transferDetails.transferDate || new Date(), "PPP")}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReviewDialog(false)}>Edit</Button>
            <Button onClick={handleConfirmTransfer}><CheckCircle className="mr-2 h-4 w-4" /> Confirm Transfer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* New Beneficiary Dialog (Example - not fully functional for saving) */}
      <Dialog open={showNewBeneficiaryDialog} onOpenChange={setShowNewBeneficiaryDialog}>
          <DialogTrigger asChild>
              {/* This button is hidden, dialog controlled by state */}
              <button className="hidden">Open Add Beneficiary</button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Beneficiary</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
                <Label htmlFor="new-ben-name">Beneficiary Name</Label>
                <Input id="new-ben-name" placeholder="Full Name" />
                <Label htmlFor="new-ben-acc">Account Number</Label>
                <Input id="new-ben-acc" placeholder="8-digit account number" />
                <Label htmlFor="new-ben-sc">Sort Code</Label>
                <Input id="new-ben-sc" placeholder="e.g., 20-30-40" />
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewBeneficiaryDialog(false)}>Cancel</Button>
                <Button onClick={handleAddNewBeneficiary}>Save Beneficiary</Button>
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

export default TransfersPage;