"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
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
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, User } from "lucide-react";

const registerSchemaStep1 = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<"Student" | "Trainer" | null>(null);

  const form = useForm<z.infer<typeof registerSchemaStep1>>({
    resolver: zodResolver(registerSchemaStep1),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onStep1Submit(values: z.infer<typeof registerSchemaStep1>) {
    setStep(2);
  }

  async function onFinalSubmit() {
    if (!role) return;
    setIsLoading(true);
    
    // In a real app, post to /api/register here
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    window.location.href = "/profile-setup";
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
        <p className="text-gray-500 text-sm">
          {step === 1 ? "Enter your details to get started" : "Select your account type"}
        </p>
      </div>

      {step === 1 && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onStep1Submit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Continue
            </Button>
          </form>
        </Form>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card 
              className={`cursor-pointer transition-all ${role === "Student" ? "border-primary ring-2 ring-primary" : "hover:border-primary/50"}`}
              onClick={() => setRole("Student")}
            >
              <CardHeader className="text-center p-4">
                <BookOpen className="w-8 h-8 mx-auto mb-2 text-primary" />
                <CardTitle className="text-lg">Student</CardTitle>
                <CardDescription className="text-xs mt-1">I want to learn</CardDescription>
              </CardHeader>
            </Card>
            <Card 
              className={`cursor-pointer transition-all ${role === "Trainer" ? "border-primary ring-2 ring-primary" : "hover:border-primary/50"}`}
              onClick={() => setRole("Trainer")}
            >
              <CardHeader className="text-center p-4">
                <User className="w-8 h-8 mx-auto mb-2 text-primary" />
                <CardTitle className="text-lg">Trainer</CardTitle>
                <CardDescription className="text-xs mt-1">I want to teach</CardDescription>
              </CardHeader>
            </Card>
          </div>
          
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" className="w-full" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button 
              type="button" 
              className="w-full" 
              onClick={onFinalSubmit} 
              disabled={!role || isLoading}
            >
              {isLoading ? "Creating..." : "Complete"}
            </Button>
          </div>
        </div>
      )}

      {step === 1 && (
        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      )}
    </div>
  );
}
