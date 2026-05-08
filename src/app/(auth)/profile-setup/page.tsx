"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
        <div className="h-24 w-24 rounded-full bg-gray-200 animate-pulse" />
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded" />
        <div className="h-4 w-64 bg-gray-200 animate-pulse rounded" />
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

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    setIsLoading(true);
    // Mock API call to update profile
    await new Promise(resolve => setTimeout(resolve, 1500));
    router.push("/"); // Redirect to main app/dashboard
    setIsLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Complete your profile</h1>
        <p className="text-gray-500 text-sm">Tell us a bit more about yourself to get started</p>
      </div>

      <div className="flex flex-col items-center justify-center space-y-4 pb-4">
        <Avatar className="h-24 w-24 border">
          <AvatarImage src={avatarPreview || session?.user?.image || undefined} />
          <AvatarFallback>{form.watch("name")?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div>
          <Input 
            id="avatar" 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileChange}
          />
          <Button variant="outline" size="sm" onClick={() => document.getElementById("avatar")?.click()}>
            Upload Picture
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <textarea 
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="I am a software developer..." 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>Max 500 characters</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Skills</FormLabel>
                <FormControl>
                  <Input placeholder="React, TypeScript, DevOps (comma separated)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://linkedin.com/in/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="github"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://github.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
