import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import BottomTabBar from '@/components/layout/BottomTabBar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Shield, Bell, LogOut, TrendingUp, ArrowRightLeft, CreditCard, Palette, FileText, MessageSquare } from 'lucide-react'; // Icons
import { Toaster as SonnerToaster, toast as sonnerToast } from "@/components/ui/sonner";

const ProfileSettingsPage = () => {
  const navigate = useNavigate();
  console.log('ProfileSettingsPage loaded');

  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'user@example.com',
    phone: '+44 7123 456789',
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [securitySettings, setSecuritySettings] = useState({
    mfaEnabled: true,
    faceIdEnabled: false,
  });

  const [notificationPrefs, setNotificationPrefs] = useState({
    transactionAlerts: true,
    promotionalEmails: false,
    securityAlerts: true,
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const saveProfileChanges = () => {
    console.log("Profile changes saved:", profileData);
    setIsEditingProfile(false);
    sonnerToast.success("Profile Updated Successfully!");
  };
  
  const handleLogout = () => {
    sonnerToast.info("Logging out...");
    // Perform actual logout logic (clear tokens, etc.)
    setTimeout(() => navigate('/login'), 1000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header title="Profile & Settings" showUserIcon={false} />
      <ScrollArea className="flex-grow p-4 md:p-6 pb-20">
        <main className="container mx-auto max-w-xl space-y-8">
          
          {/* User Profile Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-2xl">{profileData.name}</CardTitle>
                    <CardDescription>{profileData.email}</CardDescription>
                </div>
                <User className="h-12 w-12 text-muted-foreground" />
            </CardHeader>
          </Card>

          <Accordion type="multiple" defaultValue={['personal-info', 'security']} className="w-full">
            {/* Personal Information Section */}
            <AccordionItem value="personal-info">
              <AccordionTrigger className="text-lg font-medium"><User className="mr-2 h-5 w-5 text-blue-600" /> Personal Information</AccordionTrigger>
              <AccordionContent>
                <Card className="border-none shadow-none">
                  <CardContent className="pt-4 space-y-4">
                    {isEditingProfile ? (
                        <>
                            <div>
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" name="name" value={profileData.name} onChange={handleProfileChange} />
                            </div>
                            <div>
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" name="email" type="email" value={profileData.email} onChange={handleProfileChange} />
                            </div>
                            <div>
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" name="phone" type="tel" value={profileData.phone} onChange={handleProfileChange} />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setIsEditingProfile(false)}>Cancel</Button>
                                <Button onClick={saveProfileChanges}>Save Changes</Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <p><strong>Name:</strong> {profileData.name}</p>
                            <p><strong>Email:</strong> {profileData.email}</p>
                            <p><strong>Phone:</strong> {profileData.phone}</p>
                            <Button variant="outline" onClick={() => setIsEditingProfile(true)}>Edit Profile</Button>
                        </>
                    )}
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Security Settings Section */}
            <AccordionItem value="security">
              <AccordionTrigger className="text-lg font-medium"><Shield className="mr-2 h-5 w-5 text-green-600" /> Security Settings</AccordionTrigger>
              <AccordionContent>
                <Card className="border-none shadow-none">
                  <CardContent className="pt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="change-password">Change Password</Label>
                      <Button variant="outline" size="sm" onClick={() => sonnerToast.info("Password change modal/page not implemented.")}>Change</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="mfa-switch">Two-Factor Authentication (MFA)</Label>
                      <Switch id="mfa-switch" checked={securitySettings.mfaEnabled} onCheckedChange={(checked) => setSecuritySettings(s => ({ ...s, mfaEnabled: checked }))} />
                    </div>
                     <div className="flex items-center justify-between">
                      <Label htmlFor="faceid-switch">Enable Face ID / Biometrics</Label>
                      <Switch id="faceid-switch" checked={securitySettings.faceIdEnabled} onCheckedChange={(checked) => setSecuritySettings(s => ({ ...s, faceIdEnabled: checked }))} />
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Notification Preferences Section */}
            <AccordionItem value="notifications">
              <AccordionTrigger className="text-lg font-medium"><Bell className="mr-2 h-5 w-5 text-orange-500" /> Notification Preferences</AccordionTrigger>
              <AccordionContent>
                <Card className="border-none shadow-none">
                  <CardContent className="pt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="transaction-alerts">Transaction Alerts</Label>
                      <Switch id="transaction-alerts" checked={notificationPrefs.transactionAlerts} onCheckedChange={(checked) => setNotificationPrefs(s => ({ ...s, transactionAlerts: checked }))} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="promotional-emails">Promotional Emails & Offers</Label>
                      <Switch id="promotional-emails" checked={notificationPrefs.promotionalEmails} onCheckedChange={(checked) => setNotificationPrefs(s => ({ ...s, promotionalEmails: checked }))} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="security-alerts">Security Alerts</Label>
                      <Switch id="security-alerts" checked={notificationPrefs.securityAlerts} onCheckedChange={(checked) => setNotificationPrefs(s => ({ ...s, securityAlerts: checked }))} />
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
            
            {/* App Settings Section */}
            <AccordionItem value="app-settings">
              <AccordionTrigger className="text-lg font-medium"><Palette className="mr-2 h-5 w-5 text-purple-500" /> App Settings</AccordionTrigger>
              <AccordionContent>
                 <Card className="border-none shadow-none">
                  <CardContent className="pt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                      <Switch id="dark-mode" onCheckedChange={(checked) => sonnerToast.info(checked ? "Dark mode enabled (simulated)" : "Light mode enabled (simulated)")} />
                    </div>
                     <div className="flex items-center justify-between">
                      <Label htmlFor="language">Language</Label>
                      <Button variant="outline" size="sm" onClick={() => sonnerToast.info("Language selection not implemented.")}>English (UK)</Button>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Legal & Support Section */}
            <AccordionItem value="legal-support">
              <AccordionTrigger className="text-lg font-medium"><FileText className="mr-2 h-5 w-5 text-gray-500" /> Legal & Support</AccordionTrigger>
              <AccordionContent>
                 <Card className="border-none shadow-none">
                  <CardContent className="pt-4 space-y-2">
                    <Button variant="link" className="p-0 h-auto text-blue-600 block" onClick={() => sonnerToast.info("Terms & Conditions page not implemented.")}>Terms & Conditions</Button>
                    <Button variant="link" className="p-0 h-auto text-blue-600 block" onClick={() => sonnerToast.info("Privacy Policy page not implemented.")}>Privacy Policy</Button>
                    <Button variant="link" className="p-0 h-auto text-blue-600 block" onClick={() => sonnerToast.info("Contact Us page/modal not implemented.")}><MessageSquare className="inline mr-1 h-4 w-4"/> Contact Support</Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="pt-6">
            <Button variant="destructive" className="w-full" onClick={handleLogout}>
              <LogOut className="mr-2 h-5 w-5" /> Log Out
            </Button>
          </div>

        </main>
      </ScrollArea>
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

export default ProfileSettingsPage;