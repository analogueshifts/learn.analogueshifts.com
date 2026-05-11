"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Save, User, Mail, Shield, CheckCircle, Linkedin, Twitter, Globe, AlertTriangle, Trash2, Key } from "lucide-react";
import toast from "react-hot-toast";

export default function TrainerProfilePage() {
  const [profileData, setProfileData] = useState({
    name: "Alex",
    email: "alex@example.com",
    role: "Trainer",
    bio: "Passionate educator with 10 years of experience in software development.",
    skills: "React, Next.js, Node.js",
    linkedin: "",
    twitter: "",
    website: ""
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Read dynamic user from localStorage
    const storedUser = localStorage.getItem('pendingUserRegistration');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.name) {
          setProfileData(prev => ({
            ...prev,
            name: parsed.name,
            email: parsed.email || prev.email,
            role: parsed.role || prev.role
          }));
        }
        if (parsed.avatar) {
          setCustomAvatar(parsed.avatar);
        }
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomAvatar(reader.result as string);
        toast.success("Profile image updated! Don't forget to save changes.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      // Mock saving to backend/localstorage
      localStorage.setItem('pendingUserRegistration', JSON.stringify({
        name: profileData.name,
        email: profileData.email,
        role: profileData.role,
        avatar: customAvatar
      }));
      setIsSaving(false);
      toast.success("Profile updated successfully!");
    }, 1000);
  };

  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto space-y-8 pb-20">
      
      {/* Premium Hero */}
      <div className="relative overflow-hidden bg-[#0F2942] rounded-3xl p-8 lg:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-[#0F2942]/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFBB0A]/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

        <div className="relative z-10">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">Trainer Settings</h1>
          <p className="text-gray-300 mt-2 text-sm lg:text-base max-w-xl">Manage your public identity, connect social profiles, and control your account preferences.</p>
        </div>
        
        <Button 
          className="relative z-10 bg-[#FFBB0A] hover:bg-[#FFBB0A]/90 text-[#0F2942] font-bold shadow-lg shadow-[#FFBB0A]/20 px-8 h-12 rounded-xl transition-all hover:-translate-y-0.5"
          onClick={handleSave}
          disabled={isSaving}
        >
          <Save className="mr-2 h-5 w-5" /> 
          {isSaving ? "Saving..." : "Save All Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Column: Avatar & Quick Info */}
        <div className="xl:col-span-4 space-y-8">
          <Card className="border-border/50 shadow-sm overflow-hidden rounded-3xl">
            {/* Banner */}
            <div className="h-32 bg-muted/40 w-full relative">
               <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            </div>
            <CardContent className="px-6 pb-8 pt-0 flex flex-col items-center text-center -mt-16 relative z-10">
              <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
              />
              <div 
                className="relative group cursor-pointer mb-5"
                onClick={() => fileInputRef.current?.click()}
              >
                <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                  <AvatarImage src={customAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${profileData.name}`} />
                  <AvatarFallback className="text-3xl font-bold bg-[#0F2942] text-white">{profileData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-1 backdrop-blur-sm">
                  <Camera className="w-6 h-6 text-white" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">Change</span>
                </div>
              </div>
              
              <h2 className="text-2xl font-black text-foreground">{profileData.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0F2942]/10 text-[#0F2942] dark:bg-[#FFBB0A]/20 dark:text-[#FFBB0A]">
                  <Shield className="w-3 h-3 mr-1" />
                  {profileData.role}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </span>
              </div>

              <div className="w-full mt-8 bg-muted/30 rounded-2xl p-5 border border-border/50 text-left space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Member Since</span>
                  <span className="text-sm font-semibold text-foreground">Oct 2023</span>
                </div>
                <div className="w-full h-px bg-border/50" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Students</span>
                  <span className="text-sm font-semibold text-foreground">2,044</span>
                </div>
                <div className="w-full h-px bg-border/50" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Avg. Rating</span>
                  <span className="text-sm font-semibold text-foreground flex items-center"><span className="text-[#FFBB0A] mr-1">★</span> 4.8</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Edit Forms */}
        <div className="xl:col-span-8 space-y-8">
          
          {/* Public Identity */}
          <Card className="border-border/50 shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-muted/10 border-b border-border/50 p-6 lg:p-8">
              <CardTitle className="text-xl font-extrabold flex items-center gap-2">
                <User className="w-5 h-5 text-[#0F2942] dark:text-[#FFBB0A]" />
                Public Identity
              </CardTitle>
              <CardDescription>Update your personal details. This information will be visible to your students on your course pages.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 lg:p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-sm font-bold text-foreground">Full Name</Label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-[#0F2942] dark:group-focus-within:text-[#FFBB0A]" />
                    <Input 
                      id="name" 
                      name="name"
                      value={profileData.name}
                      onChange={handleChange}
                      className="pl-11 h-12 bg-muted/20 border-border/50 focus-visible:ring-[#0F2942] dark:focus-visible:ring-[#FFBB0A] rounded-xl text-base font-medium" 
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-bold text-foreground">Contact Email</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-[#0F2942] dark:group-focus-within:text-[#FFBB0A]" />
                    <Input 
                      id="email" 
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleChange}
                      className="pl-11 h-12 bg-muted/20 border-border/50 focus-visible:ring-[#0F2942] dark:focus-visible:ring-[#FFBB0A] rounded-xl text-base font-medium" 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="bio" className="text-sm font-bold text-foreground">Professional Bio</Label>
                  <span className="text-xs font-medium text-muted-foreground">{profileData.bio.length}/500</span>
                </div>
                <textarea 
                  id="bio" 
                  name="bio"
                  rows={4}
                  value={profileData.bio}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border/50 bg-muted/20 px-4 py-3 text-base font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F2942] dark:focus-visible:ring-[#FFBB0A] transition-all resize-none"
                  placeholder="Tell students about your experience, achievements, and teaching style..."
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="skills" className="text-sm font-bold text-foreground">Core Expertise</Label>
                <Input 
                  id="skills" 
                  name="skills"
                  value={profileData.skills}
                  onChange={handleChange}
                  placeholder="e.g. UX Design, Digital Marketing, Python"
                  className="h-12 bg-muted/20 border-border/50 focus-visible:ring-[#0F2942] dark:focus-visible:ring-[#FFBB0A] rounded-xl text-base font-medium" 
                />
                <p className="text-xs font-medium text-muted-foreground mt-1">Separate skills with commas. These are used as search keywords.</p>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card className="border-border/50 shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-muted/10 border-b border-border/50 p-6 lg:p-8">
              <CardTitle className="text-xl font-extrabold flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#0F2942] dark:text-[#FFBB0A]" />
                Social Profiles
              </CardTitle>
              <CardDescription>Connect your social media accounts to build trust with potential students.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 lg:p-8 space-y-6">
              
              <div className="space-y-3">
                <Label htmlFor="linkedin" className="text-sm font-bold text-foreground">LinkedIn URL</Label>
                <div className="relative group flex items-center">
                  <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center bg-muted/50 border-r border-border/50 rounded-l-xl">
                    <Linkedin className="h-5 w-5 text-[#0077B5]" />
                  </div>
                  <Input 
                    id="linkedin" 
                    name="linkedin"
                    value={profileData.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/username"
                    className="pl-16 h-12 bg-muted/20 border-border/50 focus-visible:ring-[#0F2942] dark:focus-visible:ring-[#FFBB0A] rounded-xl text-base font-medium" 
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="twitter" className="text-sm font-bold text-foreground">Twitter (X) URL</Label>
                <div className="relative group flex items-center">
                  <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center bg-muted/50 border-r border-border/50 rounded-l-xl">
                    <Twitter className="h-5 w-5 text-[#1DA1F2]" />
                  </div>
                  <Input 
                    id="twitter" 
                    name="twitter"
                    value={profileData.twitter}
                    onChange={handleChange}
                    placeholder="https://twitter.com/username"
                    className="pl-16 h-12 bg-muted/20 border-border/50 focus-visible:ring-[#0F2942] dark:focus-visible:ring-[#FFBB0A] rounded-xl text-base font-medium" 
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="website" className="text-sm font-bold text-foreground">Personal Website</Label>
                <div className="relative group flex items-center">
                  <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center bg-muted/50 border-r border-border/50 rounded-l-xl">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input 
                    id="website" 
                    name="website"
                    value={profileData.website}
                    onChange={handleChange}
                    placeholder="https://yourwebsite.com"
                    className="pl-16 h-12 bg-muted/20 border-border/50 focus-visible:ring-[#0F2942] dark:focus-visible:ring-[#FFBB0A] rounded-xl text-base font-medium" 
                  />
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Security */}
          <Card className="border-border/50 shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-muted/10 border-b border-border/50 p-6 lg:p-8">
              <CardTitle className="text-xl font-extrabold flex items-center gap-2">
                <Key className="w-5 h-5 text-[#0F2942] dark:text-[#FFBB0A]" />
                Security
              </CardTitle>
              <CardDescription>Manage your password and secure your account.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 lg:p-8">
              {!isChangingPassword ? (
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <h4 className="text-base font-bold text-foreground">Password Update</h4>
                    <p className="text-sm text-muted-foreground mt-1 max-w-md">Update your password regularly to keep your instructor account secure.</p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="shrink-0 h-11 px-6 rounded-xl font-bold border-border/50"
                    onClick={() => setIsChangingPassword(true)}
                  >
                    Change Password
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-foreground">Current Password</Label>
                    <Input 
                      type="password"
                      className="h-12 bg-muted/20 border-border/50 focus-visible:ring-[#0F2942] dark:focus-visible:ring-[#FFBB0A] rounded-xl text-base" 
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label className="text-sm font-bold text-foreground">New Password</Label>
                      <Input 
                        type="password"
                        className="h-12 bg-muted/20 border-border/50 focus-visible:ring-[#0F2942] dark:focus-visible:ring-[#FFBB0A] rounded-xl text-base" 
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-bold text-foreground">Confirm New Password</Label>
                      <Input 
                        type="password"
                        className="h-12 bg-muted/20 border-border/50 focus-visible:ring-[#0F2942] dark:focus-visible:ring-[#FFBB0A] rounded-xl text-base" 
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-4">
                    <Button 
                      className="bg-[#0F2942] hover:bg-[#0F2942]/90 text-white font-bold h-11 px-6 rounded-xl"
                      onClick={() => {
                        toast.success("Password successfully updated!");
                        setIsChangingPassword(false);
                      }}
                    >
                      Update Password
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="h-11 px-6 rounded-xl font-bold"
                      onClick={() => setIsChangingPassword(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-500/20 shadow-sm rounded-3xl overflow-hidden bg-red-50/50 dark:bg-red-950/10">
            <CardHeader className="border-b border-red-500/10 p-6 lg:p-8">
              <CardTitle className="text-xl font-extrabold flex items-center gap-2 text-red-600 dark:text-red-500">
                <AlertTriangle className="w-5 h-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 lg:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h4 className="text-base font-bold text-foreground">Deactivate Account</h4>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">Once you delete your account, there is no going back. All your courses, earnings, and data will be permanently wiped.</p>
              </div>
              <Button variant="destructive" className="shrink-0 h-11 px-6 rounded-xl font-bold shadow-md shadow-red-500/20">
                <Trash2 className="w-4 h-4 mr-2" />
                Deactivate Account
              </Button>
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
}
