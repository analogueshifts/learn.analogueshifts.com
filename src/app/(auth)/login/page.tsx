"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import Image from "next/image";
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
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

import GoogleIcon from "@/assets/images/google.svg";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    
    if (result?.error) {
      form.setError("root", { message: "Invalid email or password" });
    } else {
      window.location.href = "/";
    }
    
    setIsLoading(false);
  }

  return (
    <div className="w-full flex flex-col">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-primary-tan tracking-tight mb-3">
          Welcome Back
        </h1>
        <p className="text-content-grayText font-medium text-sm sm:text-base px-4">
          Enter your credentials to continue your learning journey
        </p>
      </div>

      <div className="w-full">
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-sm font-bold text-primary-tan">Email Address</FormLabel>
                <FormControl>
                  <div className="relative flex items-center h-14 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-background-darkYellow focus-within:ring-1 focus-within:ring-background-darkYellow transition-all duration-300 overflow-hidden">
                    <div className="pl-4 pr-3 text-gray-400 flex items-center justify-center">
                      <Mail className="w-5 h-5" />
                    </div>
                    <Input 
                      placeholder="name@example.com" 
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
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-sm font-bold text-primary-tan">Password</FormLabel>
                <FormControl>
                  <div className="relative flex items-center h-14 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-background-darkYellow focus-within:ring-1 focus-within:ring-background-darkYellow transition-all duration-300 overflow-hidden">
                    <div className="pl-4 pr-3 text-gray-400 flex items-center justify-center">
                      <Lock className="w-5 h-5" />
                    </div>
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      className="border-0 bg-transparent h-full px-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base font-medium placeholder:font-normal placeholder:text-gray-400"
                      {...field} 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="pr-4 pl-3 text-gray-400 hover:text-primary-tan transition-colors flex items-center justify-center outline-none"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </FormControl>
                <div className="flex justify-end w-full pt-1">
                  <Link href="/forgot-password" className="text-[13px] font-bold text-background-darkYellow hover:text-yellow-600 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <FormMessage className="font-medium text-xs text-red-500 ml-1" />
              </FormItem>
            )}
          />

          {form.formState.errors.root && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm font-semibold border border-red-100 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              {form.formState.errors.root.message}
            </div>
          )}

          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full h-14 rounded-xl font-bold text-base bg-primary-tan hover:bg-gray-900 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign in"
              )}
            </Button>
          </div>
        </form>
      </Form>

      <div className="mt-8 relative flex items-center justify-center">
        <div className="absolute inset-x-0 h-px bg-gray-200" />
        <span className="relative bg-white px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
          Or continue with
        </span>
      </div>

      <div className="mt-8">
        <Button 
          type="button" 
          variant="outline" 
          className="w-full h-14 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-[#3c4043] font-bold text-[15px] shadow-[0_1px_2px_0_rgba(60,64,67,0.3)] hover:shadow-[0_1px_3px_1px_rgba(60,64,67,0.15)] transition-all flex items-center justify-center gap-3"
        >
          <Image src={GoogleIcon} alt="Google" width={20} height={20} className="shrink-0" />
          <span>Sign in with Google</span>
        </Button>
      </div>

        <div className="text-center text-[15px] font-medium text-content-grayText mt-10">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-bold text-background-darkYellow hover:text-yellow-600 transition-colors ml-1">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
