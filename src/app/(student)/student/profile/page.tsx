"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Phone, MapPin, Shield, Key, BellRing, Save } from "lucide-react";
import toast from "react-hot-toast";

export default function StudentProfilePage() {
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Student User",
    email: "student@example.com",
    phone: "+1 (555) 000-0000",
    location: "New York, USA",
    bio: "Passionate learner looking to transition into tech."
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('pendingUserRegistration');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.name) {
          setProfileData(prev => ({ ...prev, name: parsed.name, email: parsed.email || prev.email }));
        }
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Profile updated successfully!");
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-10 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0F2942] dark:text-white">Profile Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account information and preferences.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-border/50 shadow-sm overflow-hidden relative">
            <div className="h-24 bg-gradient-to-r from-[#0F2942] to-gray-800" />
            <div className="px-6 pb-6 relative">
              <div className="flex flex-col items-center -mt-12 mb-4">
                <Avatar className="w-24 h-24 border-4 border-white shadow-md">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${profileData.name}`} />
                  <AvatarFallback className="text-2xl font-bold">{profileData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold text-foreground mt-3">{profileData.name}</h3>
                <p className="text-sm text-muted-foreground font-medium">Student • Learner</p>
              </div>
              <Button variant="outline" className="w-full font-bold border-gray-200">
                Change Avatar
              </Button>
            </div>
          </Card>

          <Card className="border-border/50 shadow-sm">
            <CardHeader className="bg-muted/10 border-b border-border/50 p-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#FFBB0A]" />
                Account Security
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">Two-Factor Authentication</p>
                <p className="text-xs text-muted-foreground mb-3">Add an extra layer of security to your account.</p>
                <Button variant="outline" size="sm" className="w-full text-xs font-bold text-[#0F2942] border-[#0F2942]/20 hover:bg-[#0F2942]/5">
                  Enable 2FA
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Settings Area */}
        <div className="lg:col-span-8">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="bg-muted/20 p-1 mb-6 rounded-xl overflow-x-auto flex flex-nowrap w-max sm:w-full">
              <TabsTrigger value="general" className="rounded-lg font-bold data-[state=active]:bg-white px-6">Personal Info</TabsTrigger>
              <TabsTrigger value="security" className="rounded-lg font-bold data-[state=active]:bg-white px-6">Security & Password</TabsTrigger>
              <TabsTrigger value="notifications" className="rounded-lg font-bold data-[state=active]:bg-white px-6">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <Card className="border-border/50 shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-border/50 p-6 bg-muted/5">
                  <CardTitle className="text-lg font-bold">Personal Information</CardTitle>
                  <CardDescription>Update your basic profile details.</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold flex items-center gap-2"><User className="w-4 h-4 text-muted-foreground" /> Full Name</Label>
                      <Input name="name" value={profileData.name} onChange={handleChange} className="h-12 bg-muted/20 focus-visible:ring-[#0F2942] rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-bold flex items-center gap-2"><Mail className="w-4 h-4 text-muted-foreground" /> Email Address</Label>
                      <Input name="email" value={profileData.email} onChange={handleChange} className="h-12 bg-muted/20 focus-visible:ring-[#0F2942] rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-bold flex items-center gap-2"><Phone className="w-4 h-4 text-muted-foreground" /> Phone Number</Label>
                      <Input name="phone" value={profileData.phone} onChange={handleChange} className="h-12 bg-muted/20 focus-visible:ring-[#0F2942] rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-bold flex items-center gap-2"><MapPin className="w-4 h-4 text-muted-foreground" /> Location</Label>
                      <Input name="location" value={profileData.location} onChange={handleChange} className="h-12 bg-muted/20 focus-visible:ring-[#0F2942] rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold">Short Bio</Label>
                    <textarea 
                      name="bio"
                      value={profileData.bio}
                      onChange={handleChange}
                      rows={4}
                      className="w-full rounded-xl border border-input bg-muted/20 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F2942] resize-none"
                    />
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/5 border-t border-border/50 p-6 flex justify-end">
                  <Button 
                    className="bg-[#0F2942] hover:bg-[#0F2942]/90 text-white font-bold h-11 px-8 rounded-xl shadow-md transition-all hover:-translate-y-0.5"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card className="border-border/50 shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-border/50 p-6 bg-muted/5">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Key className="w-5 h-5 text-muted-foreground" /> Password Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold">Current Password</Label>
                    <Input type="password" placeholder="••••••••" className="h-12 bg-muted/20 focus-visible:ring-[#0F2942] rounded-xl max-w-md" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold">New Password</Label>
                    <Input type="password" placeholder="••••••••" className="h-12 bg-muted/20 focus-visible:ring-[#0F2942] rounded-xl max-w-md" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold">Confirm New Password</Label>
                    <Input type="password" placeholder="••••••••" className="h-12 bg-muted/20 focus-visible:ring-[#0F2942] rounded-xl max-w-md" />
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/5 border-t border-border/50 p-6 flex justify-start">
                  <Button className="bg-[#0F2942] hover:bg-[#0F2942]/90 text-white font-bold h-11 px-6 rounded-xl">
                    Update Password
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card className="border-border/50 shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-border/50 p-6 bg-muted/5">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <BellRing className="w-5 h-5 text-muted-foreground" /> Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Email Notifications */}
                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">Email Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-sm">Course Announcements</p>
                          <p className="text-xs text-muted-foreground">Receive updates from instructors.</p>
                        </div>
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-[#0F2942] focus:ring-[#0F2942]" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-sm">Live Session Reminders</p>
                          <p className="text-xs text-muted-foreground">Get notified before a session starts.</p>
                        </div>
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-[#0F2942] focus:ring-[#0F2942]" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-sm">Marketing & Promotions</p>
                          <p className="text-xs text-muted-foreground">Discounts on new courses.</p>
                        </div>
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#0F2942] focus:ring-[#0F2942]" />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/5 border-t border-border/50 p-6 flex justify-end">
                  <Button className="font-bold h-11 px-8 rounded-xl" variant="outline">
                    Save Preferences
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

          </Tabs>
        </div>
      </div>
    </div>
  );
}
