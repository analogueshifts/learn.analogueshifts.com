"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, AlignLeft, Code, Linkedin, Github, Camera, Loader2, X, GraduationCap, Briefcase } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  bio: z.string().max(500).optional(),
  skills: z.string().optional(),
  linkedin: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
  github: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
});

export default function ProfileSetupPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  // State for the skills tag input
  const [skillInput, setSkillInput] = useState("");
  const [skillsList, setSkillsList] = useState<string[]>([]);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session?.user?.name || "",
      bio: "",
      skills: "",
      linkedin: "",
      github: "",
    },
  });

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <div className="h-28 w-28 rounded-full bg-gray-100 animate-pulse" />
        <div className="h-8 w-48 bg-gray-100 animate-pulse rounded-xl" />
        <div className="h-4 w-64 bg-gray-50 animate-pulse rounded-lg" />
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ',' || e.key === 'Enter') {
      e.preventDefault();
      const val = skillInput.trim().replace(/,$/, '');
      if (val && !skillsList.includes(val)) {
        const newSkills = [...skillsList, val];
        setSkillsList(newSkills);
        form.setValue("skills", newSkills.join(", "));
      }
      setSkillInput("");
    } else if (e.key === 'Backspace' && skillInput === "" && skillsList.length > 0) {
      e.preventDefault();
      const newSkills = skillsList.slice(0, -1);
      setSkillsList(newSkills);
      form.setValue("skills", newSkills.join(", "));
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const newSkills = skillsList.filter(s => s !== skillToRemove);
    setSkillsList(newSkills);
    form.setValue("skills", newSkills.join(", "));
  };

  const [pendingRegistration, setPendingRegistration] = useState<{name: string, email: string, role: string} | null>(null);

  // Initialize from localStorage
  useEffect(() => {
    const data = localStorage.getItem('pendingUserRegistration');
    if (data) {
      const parsed = JSON.parse(data);
      setPendingRegistration(parsed);
      form.setValue("name", parsed.name);
    }
  }, [form]);

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    setIsLoading(true);
    
    // If user is registering as Trainer, create a mock application in localStorage
    if (pendingRegistration?.role === "Trainer") {
      const existingAppsStr = localStorage.getItem("mockTrainerApplications");
      const existingApps = existingAppsStr ? JSON.parse(existingAppsStr) : [];
      
      const newApplication = {
        id: `app_mock_${Date.now()}`,
        name: values.name,
        email: pendingRegistration.email,
        expertise: values.skills?.split(',')[0] || "General Instruction", // first skill as expertise
        experience: values.bio ? "Detailed bio provided" : "New Instructor",
        status: "Pending",
        appliedDate: new Date().toISOString().split('T')[0]
      };
      
      localStorage.setItem("mockTrainerApplications", JSON.stringify([...existingApps, newApplication]));
    }

    // Mock API call to update profile
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Redirect based on role
    if (pendingRegistration?.role === "Trainer") {
      router.push("/trainer/dashboard");
    } else {
      router.push("/");
    }
    setIsLoading(false);
  }

  return (
    <div className="w-full flex flex-col">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-primary-tan tracking-tight mb-3">
          Complete Your Profile
        </h1>
        <p className="text-content-grayText font-medium text-sm sm:text-base px-4">
          Tell us a bit more about yourself to personalize your experience
        </p>
      </div>

      <div className="flex flex-col items-center justify-center space-y-3 pb-6">
        <div className="relative group cursor-pointer" onClick={() => document.getElementById("avatar")?.click()}>
          <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <Avatar className="h-28 w-28 border-4 border-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] bg-gray-50 transition-transform duration-300 group-hover:scale-105">
            <AvatarImage src={avatarPreview || session?.user?.image || undefined} className="object-cover" />
            <AvatarFallback className="text-3xl font-bold text-gray-300 bg-gray-50">
              {form.watch("name")?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="absolute bottom-1 right-1 w-8 h-8 bg-background-darkYellow rounded-full border-2 border-white flex items-center justify-center shadow-lg z-20 group-hover:scale-110 transition-transform">
            <Camera className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-primary-tan">Profile Picture</p>
          <p className="text-[13px] font-medium text-gray-400">Click avatar to upload image</p>
        </div>
        <Input 
          id="avatar" 
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileChange}
        />
      </div>

      <div className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-sm font-bold text-primary-tan">Full Name</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center h-14 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-background-darkYellow focus-within:ring-1 focus-within:ring-background-darkYellow transition-all duration-300 overflow-hidden">
                      <div className="pl-4 pr-3 text-gray-400 flex items-center justify-center">
                        <User className="w-5 h-5" />
                      </div>
                      <Input 
                        placeholder="John Doe" 
                        className="border-0 bg-transparent h-full px-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base font-medium placeholder:font-normal placeholder:text-gray-400"
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="font-medium text-xs text-red-500 ml-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <div className="flex items-center justify-between pb-1">
                    <FormLabel className="text-sm font-bold text-primary-tan">Professional Bio</FormLabel>
                    <span className="text-xs font-medium text-gray-400">{field.value?.length || 0}/500</span>
                  </div>
                  <FormControl>
                    <div className="relative flex items-start bg-gray-50 border border-gray-200 rounded-xl focus-within:border-background-darkYellow focus-within:ring-1 focus-within:ring-background-darkYellow transition-all duration-300 overflow-hidden">
                      <div className="pl-4 pr-3 pt-4 text-gray-400 flex items-center justify-center">
                        <AlignLeft className="w-5 h-5" />
                      </div>
                      <textarea 
                        placeholder="Tell us about your background and goals..." 
                        className="w-full border-0 bg-transparent py-4 px-0 min-h-[100px] resize-none focus-visible:outline-none text-base font-medium placeholder:font-normal placeholder:text-gray-400"
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="font-medium text-xs text-red-500 ml-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skills"
              render={() => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-sm font-bold text-primary-tan">Core Skills</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center min-h-[56px] bg-gray-50 border border-gray-200 rounded-xl focus-within:border-background-darkYellow focus-within:ring-1 focus-within:ring-background-darkYellow transition-all duration-300 overflow-hidden py-1.5 pr-2">
                      <div className="pl-4 pr-3 text-gray-400 flex items-center justify-center self-start mt-2.5">
                        <Code className="w-5 h-5" />
                      </div>
                      <div className="flex-1 flex flex-wrap gap-2 items-center">
                        {skillsList.map((skill, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm animate-in fade-in zoom-in duration-200">
                            <span className="text-sm font-bold text-primary-tan">{skill}</span>
                            <button 
                              type="button" 
                              onClick={() => removeSkill(skill)}
                              className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full p-0.5 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                        <Input 
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyDown={handleSkillKeyDown}
                          placeholder={skillsList.length === 0 ? "Type a skill and press comma..." : ""} 
                          className="border-0 bg-transparent h-10 px-0 min-w-[150px] flex-1 focus-visible:ring-0 focus-visible:ring-offset-0 text-base font-medium placeholder:font-normal placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage className="font-medium text-xs text-red-500 ml-1" />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <FormField
                control={form.control}
                name="linkedin"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-sm font-bold text-primary-tan">LinkedIn</FormLabel>
                    <FormControl>
                      <div className="relative flex items-center h-14 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-[#0077b5] focus-within:ring-1 focus-within:ring-[#0077b5] transition-all duration-300 overflow-hidden">
                        <div className="pl-4 pr-3 text-gray-400 flex items-center justify-center">
                          <Linkedin className="w-5 h-5 group-focus-within:text-[#0077b5]" />
                        </div>
                        <Input 
                          placeholder="https://linkedin.com/in/..." 
                          className="border-0 bg-transparent h-full px-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm font-medium placeholder:font-normal placeholder:text-gray-400"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="font-medium text-xs text-red-500 ml-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="github"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-sm font-bold text-primary-tan">GitHub</FormLabel>
                    <FormControl>
                      <div className="relative flex items-center h-14 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-gray-900 focus-within:ring-1 focus-within:ring-gray-900 transition-all duration-300 overflow-hidden">
                        <div className="pl-4 pr-3 text-gray-400 flex items-center justify-center">
                          <Github className="w-5 h-5" />
                        </div>
                        <Input 
                          placeholder="https://github.com/..." 
                          className="border-0 bg-transparent h-full px-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm font-medium placeholder:font-normal placeholder:text-gray-400"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="font-medium text-xs text-red-500 ml-1" />
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-6">
              <Button 
                type="submit" 
                className="w-full h-14 rounded-xl font-bold text-base bg-primary-tan hover:bg-gray-900 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Saving Profile...</span>
                  </div>
                ) : (
                  "Complete Profile"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
