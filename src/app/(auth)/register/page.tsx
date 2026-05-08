"use client";

import { useState } from "react";
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
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft, ArrowRight, User, GraduationCap, Briefcase } from "lucide-react";

import GoogleIcon from "@/assets/images/google.svg";

const registerSchemaStep1 = z.object({
  firstName: z.string().min(2, { message: "First name is required." }),
  lastName: z.string().min(2, { message: "Last name is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"Student" | "Trainee" | null>(null);

  const form = useForm<z.infer<typeof registerSchemaStep1>>({
    resolver: zodResolver(registerSchemaStep1),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  function onStep1Submit(values: z.infer<typeof registerSchemaStep1>) {
    setStep(2);
  }

  async function onFinalSubmit() {
    if (!role) return;
    setIsLoading(true);
    
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    window.location.href = "/profile-setup";
  }

  return (
    <div className="w-full flex flex-col">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-primary-tan tracking-tight mb-3">
          Create Account
        </h1>
        <p className="text-content-grayText font-medium text-sm sm:text-base px-4">
          {step === 1 ? "Enter your details to begin your journey" : "How do you want to use Analogue Shifts?"}
        </p>
      </div>

      <div className="w-full">
      {step === 1 && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onStep1Submit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-sm font-bold text-primary-tan">First Name</FormLabel>
                    <FormControl>
                      <div className="relative flex items-center h-14 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-background-darkYellow focus-within:ring-1 focus-within:ring-background-darkYellow transition-all duration-300 overflow-hidden">
                        <div className="pl-4 pr-3 text-gray-400 flex items-center justify-center">
                          <User className="w-5 h-5" />
                        </div>
                        <Input 
                          placeholder="John" 
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
                name="lastName"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-sm font-bold text-primary-tan">Last Name</FormLabel>
                    <FormControl>
                      <div className="relative flex items-center h-14 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-background-darkYellow focus-within:ring-1 focus-within:ring-background-darkYellow transition-all duration-300 overflow-hidden">
                        <div className="pl-4 pr-3 text-gray-400 flex items-center justify-center">
                          <User className="w-5 h-5" />
                        </div>
                        <Input 
                          placeholder="Doe" 
                          className="border-0 bg-transparent h-full px-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base font-medium placeholder:font-normal placeholder:text-gray-400"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="font-medium text-xs text-red-500 ml-1" />
                  </FormItem>
                )}
              />
            </div>

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
                  <FormMessage className="font-medium text-xs text-red-500 ml-1" />
                </FormItem>
              )}
            />

            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full h-14 rounded-xl font-bold text-base bg-primary-tan hover:bg-gray-900 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group flex items-center gap-2 justify-center" 
              >
                Continue
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            
            <div className="mt-8 relative flex items-center justify-center">
              <div className="absolute inset-x-0 h-px bg-gray-200" />
              <span className="relative bg-white px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Or register with
              </span>
            </div>

            <div className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                className="w-full h-14 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-[#3c4043] font-bold text-[15px] shadow-[0_1px_2px_0_rgba(60,64,67,0.3)] hover:shadow-[0_1px_3px_1px_rgba(60,64,67,0.15)] transition-all flex items-center justify-center gap-3"
              >
                <Image src={GoogleIcon} alt="Google" width={20} height={20} className="shrink-0" />
                <span>Sign up with Google</span>
              </Button>
            </div>
          </form>
        </Form>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="flex flex-col gap-4">
            <button 
              type="button"
              onClick={() => setRole("Student")}
              className={`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all duration-300 text-left w-full ${
                role === "Student"
                  ? "bg-background-darkYellow/5 border-background-darkYellow ring-4 ring-background-darkYellow/10 shadow-md"
                  : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-sm"
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                role === "Student"
                  ? "bg-background-darkYellow text-white shadow-md scale-110"
                  : "bg-gray-50 text-gray-400 border border-gray-200"
              }`}>
                <GraduationCap className="w-6 h-6" />
              </div>
              
              <div className="flex-1 pt-1">
                <h3 className={`font-bold text-lg mb-1 ${
                  role === "Student" ? "text-primary-tan" : "text-gray-700"
                }`}>Student</h3>
                <p className="text-content-grayText text-sm font-medium leading-relaxed pr-2">I want to learn new skills and enroll in premium courses.</p>
              </div>

              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 transition-all ${
                role === "Student" ? "border-background-darkYellow" : "border-gray-300"
              }`}>
                {role === "Student" && <div className="w-2.5 h-2.5 bg-background-darkYellow rounded-full animate-in zoom-in duration-200" />}
              </div>
            </button>
            
            <button 
              type="button"
              onClick={() => setRole("Trainee")}
              className={`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all duration-300 text-left w-full ${
                role === "Trainee"
                  ? "bg-background-darkYellow/5 border-background-darkYellow ring-4 ring-background-darkYellow/10 shadow-md"
                  : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-sm"
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                role === "Trainee"
                  ? "bg-background-darkYellow text-white shadow-md scale-110"
                  : "bg-gray-50 text-gray-400 border border-gray-200"
              }`}>
                <Briefcase className="w-6 h-6" />
              </div>

              <div className="flex-1 pt-1">
                <h3 className={`font-bold text-lg mb-1 ${
                  role === "Trainee" ? "text-primary-tan" : "text-gray-700"
                }`}>Trainee</h3>
                <p className="text-content-grayText text-sm font-medium leading-relaxed pr-2">I am part of a dedicated cohort or apprenticeship program.</p>
              </div>

              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 transition-all ${
                role === "Trainee" ? "border-background-darkYellow" : "border-gray-300"
              }`}>
                {role === "Trainee" && <div className="w-2.5 h-2.5 bg-background-darkYellow rounded-full animate-in zoom-in duration-200" />}
              </div>
            </button>
          </div>
          
          <div className="flex gap-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              className="h-14 px-6 rounded-xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 hover:text-primary-tan transition-colors" 
              onClick={() => setStep(1)}
              disabled={isLoading}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Button 
              type="button" 
              className="flex-1 h-14 rounded-xl font-bold text-base bg-primary-tan hover:bg-gray-900 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-lg hover:-translate-y-0.5" 
              onClick={onFinalSubmit} 
              disabled={!role || isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Complete Registration"
              )}
            </Button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="text-center text-[15px] font-medium text-content-grayText mt-8">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-background-darkYellow hover:text-yellow-600 transition-colors ml-1">
            Sign in
          </Link>
        </div>
      )}
      </div>
    </div>
  );
}
