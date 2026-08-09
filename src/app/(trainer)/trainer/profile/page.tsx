"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Save, User, Mail, Shield, CheckCircle, Linkedin, Twitter, Github, Key, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { uploadToCloudinaryClient } from "@/lib/cloudinary-client";

interface Profile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  bio: string | null;
  skills: string[];
  linkedin: string | null;
  twitter: string | null;
  github: string | null;
  createdAt: string;
}

interface CourseSummary {
  studentCount: number;
  avgRating: number;
}

export default function TrainerProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState({ name: "", bio: "", skills: "", linkedin: "", twitter: "", github: "" });
  const [totalStudents, setTotalStudents] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "" });

  useEffect(() => {
    Promise.all([
      fetch("/api/user/me").then((res) => res.json()),
      fetch("/api/trainer/courses").then((res) => res.json()),
    ])
      .then(([profileBody, coursesBody]) => {
        if (profileBody.success) {
          const p: Profile = profileBody.data;
          setProfile(p);
          setForm({
            name: p.name,
            bio: p.bio ?? "",
            skills: p.skills.join(", "),
            linkedin: p.linkedin ?? "",
            twitter: p.twitter ?? "",
            github: p.github ?? "",
          });
        }
        if (coursesBody.success) {
          const courses: CourseSummary[] = coursesBody.data;
          const students = courses.reduce((sum, c) => sum + c.studentCount, 0);
          const rated = courses.filter((c) => c.avgRating > 0);
          setTotalStudents(students);
          setAvgRating(rated.length ? rated.reduce((sum, c) => sum + c.avgRating, 0) / rated.length : 0);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarFile = async (file: File) => {
    setIsUploading(true);
    try {
      const url = await uploadToCloudinaryClient(file, "avatar");
      const response = await fetch("/api/user/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: url }),
      });
      const body = await response.json();
      if (body.success) {
        setProfile(body.data);
        toast.success("Profile photo updated");
      } else {
        toast.error(body.error ?? "Failed to update profile photo");
      }
    } catch {
      toast.error("Photo upload failed. Check your Cloudinary configuration.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const response = await fetch("/api/user/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        bio: form.bio || undefined,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
        linkedin: form.linkedin || undefined,
        twitter: form.twitter || undefined,
        github: form.github || undefined,
      }),
    });
    const body = await response.json();
    setIsSaving(false);
    if (body.success) {
      setProfile(body.data);
      toast.success("Profile updated successfully!");
    } else {
      toast.error(body.error ?? "Failed to update profile");
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.next !== passwordForm.confirm) {
      toast.error("New passwords don't match");
      return;
    }
    const response = await fetch("/api/user/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: passwordForm.current, newPassword: passwordForm.next }),
    });
    const body = await response.json();
    if (body.success) {
      toast.success("Password successfully updated!");
      setIsChangingPassword(false);
      setPasswordForm({ current: "", next: "", confirm: "" });
    } else {
      toast.error(body.error ?? "Failed to update password");
    }
  };

  if (isLoading || !profile) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <Loader2 className="w-6 h-6 mr-2 animate-spin" /> Loading profile...
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto space-y-8 pb-20">

      <div className="relative overflow-hidden bg-[#0F2942] rounded-3xl p-8 lg:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-[#0F2942]/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFBB0A]/10 blur-[100px] rounded-full pointer-events-none" />
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

        <div className="xl:col-span-4 space-y-8">
          <Card className="border-border/50 shadow-sm overflow-hidden rounded-3xl">
            <div className="h-32 bg-muted/40 w-full relative" />
            <CardContent className="px-6 pb-8 pt-0 flex flex-col items-center text-center -mt-16 relative z-10">
              <input
                type="file"
                className="hidden"
                id="avatar-input"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleAvatarFile(e.target.files[0])}
              />
              <label htmlFor="avatar-input" className="relative group cursor-pointer mb-5 block">
                <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                  <AvatarImage src={profile.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.name}`} />
                  <AvatarFallback className="text-3xl font-bold bg-[#0F2942] text-white">{profile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-1 backdrop-blur-sm">
                  {isUploading ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Camera className="w-6 h-6 text-white" />}
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">{isUploading ? "Uploading" : "Change"}</span>
                </div>
              </label>

              <h2 className="text-2xl font-black text-foreground">{profile.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0F2942]/10 text-[#0F2942] dark:bg-[#FFBB0A]/20 dark:text-[#FFBB0A]">
                  <Shield className="w-3 h-3 mr-1" />
                  {profile.role}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </span>
              </div>

              <div className="w-full mt-8 bg-muted/30 rounded-2xl p-5 border border-border/50 text-left space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Member Since</span>
                  <span className="text-sm font-semibold text-foreground">{new Date(profile.createdAt).toLocaleDateString(undefined, { month: "short", year: "numeric" })}</span>
                </div>
                <div className="w-full h-px bg-border/50" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Students</span>
                  <span className="text-sm font-semibold text-foreground">{totalStudents.toLocaleString()}</span>
                </div>
                <div className="w-full h-px bg-border/50" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Avg. Rating</span>
                  <span className="text-sm font-semibold text-foreground flex items-center"><span className="text-[#FFBB0A] mr-1">★</span> {avgRating.toFixed(1)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-8 space-y-8">

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
                    <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="pl-11 h-12 bg-muted/20 border-border/50 focus-visible:ring-[#0F2942] dark:focus-visible:ring-[#FFBB0A] rounded-xl text-base font-medium" />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-bold text-foreground">Contact Email</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
                    <Input id="email" type="email" value={profile.email} disabled className="pl-11 h-12 bg-muted/40 border-border/50 rounded-xl text-base font-medium opacity-70" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="bio" className="text-sm font-bold text-foreground">Professional Bio</Label>
                  <span className="text-xs font-medium text-muted-foreground">{form.bio.length}/1000</span>
                </div>
                <textarea
                  id="bio"
                  rows={4}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  maxLength={1000}
                  className="w-full rounded-xl border border-border/50 bg-muted/20 px-4 py-3 text-base font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F2942] dark:focus-visible:ring-[#FFBB0A] transition-all resize-none"
                  placeholder="Tell students about your experience, achievements, and teaching style..."
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="skills" className="text-sm font-bold text-foreground">Core Expertise</Label>
                <Input
                  id="skills"
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  placeholder="e.g. UX Design, Digital Marketing, Python"
                  className="h-12 bg-muted/20 border-border/50 focus-visible:ring-[#0F2942] dark:focus-visible:ring-[#FFBB0A] rounded-xl text-base font-medium"
                />
                <p className="text-xs font-medium text-muted-foreground mt-1">Separate skills with commas.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-muted/10 border-b border-border/50 p-6 lg:p-8">
              <CardTitle className="text-xl font-extrabold">Social Profiles</CardTitle>
              <CardDescription>Connect your social media accounts to build trust with potential students.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 lg:p-8 space-y-6">
              <div className="space-y-3">
                <Label htmlFor="linkedin" className="text-sm font-bold text-foreground">LinkedIn URL</Label>
                <div className="relative group flex items-center">
                  <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center bg-muted/50 border-r border-border/50 rounded-l-xl">
                    <Linkedin className="h-5 w-5 text-[#0077B5]" />
                  </div>
                  <Input id="linkedin" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} placeholder="https://linkedin.com/in/username" className="pl-16 h-12 bg-muted/20 border-border/50 focus-visible:ring-[#0F2942] dark:focus-visible:ring-[#FFBB0A] rounded-xl text-base font-medium" />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="twitter" className="text-sm font-bold text-foreground">Twitter (X) URL</Label>
                <div className="relative group flex items-center">
                  <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center bg-muted/50 border-r border-border/50 rounded-l-xl">
                    <Twitter className="h-5 w-5 text-[#1DA1F2]" />
                  </div>
                  <Input id="twitter" value={form.twitter} onChange={(e) => setForm({ ...form, twitter: e.target.value })} placeholder="https://twitter.com/username" className="pl-16 h-12 bg-muted/20 border-border/50 focus-visible:ring-[#0F2942] dark:focus-visible:ring-[#FFBB0A] rounded-xl text-base font-medium" />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="github" className="text-sm font-bold text-foreground">GitHub URL</Label>
                <div className="relative group flex items-center">
                  <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center bg-muted/50 border-r border-border/50 rounded-l-xl">
                    <Github className="h-5 w-5 text-gray-700" />
                  </div>
                  <Input id="github" value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} placeholder="https://github.com/username" className="pl-16 h-12 bg-muted/20 border-border/50 focus-visible:ring-[#0F2942] dark:focus-visible:ring-[#FFBB0A] rounded-xl text-base font-medium" />
                </div>
              </div>
            </CardContent>
          </Card>

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
                  <Button variant="outline" className="shrink-0 h-11 px-6 rounded-xl font-bold border-border/50" onClick={() => setIsChangingPassword(true)}>
                    Change Password
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-foreground">Current Password</Label>
                    <Input type="password" value={passwordForm.current} onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })} className="h-12 bg-muted/20 border-border/50 focus-visible:ring-[#0F2942] dark:focus-visible:ring-[#FFBB0A] rounded-xl text-base" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label className="text-sm font-bold text-foreground">New Password</Label>
                      <Input type="password" value={passwordForm.next} onChange={(e) => setPasswordForm({ ...passwordForm, next: e.target.value })} className="h-12 bg-muted/20 border-border/50 focus-visible:ring-[#0F2942] dark:focus-visible:ring-[#FFBB0A] rounded-xl text-base" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-bold text-foreground">Confirm New Password</Label>
                      <Input type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })} className="h-12 bg-muted/20 border-border/50 focus-visible:ring-[#0F2942] dark:focus-visible:ring-[#FFBB0A] rounded-xl text-base" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-4">
                    <Button className="bg-[#0F2942] hover:bg-[#0F2942]/90 text-white font-bold h-11 px-6 rounded-xl" onClick={handleChangePassword}>
                      Update Password
                    </Button>
                    <Button variant="ghost" className="h-11 px-6 rounded-xl font-bold" onClick={() => setIsChangingPassword(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
}
