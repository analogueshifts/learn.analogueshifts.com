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
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    setIsLoading(true);
    // Mock API call to send reset email
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitted(true);
    setIsLoading(false);
  }

  return (
    <div className="w-full flex flex-col">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-primary-tan tracking-tight mb-3">
          Reset Password
        </h1>
        <p className="text-content-grayText font-medium text-sm sm:text-base px-4">
          Enter your email address and we&apos;ll send you a link to securely reset your password
        </p>
      </div>

      {isSubmitted ? (
        <div className="bg-green-50 border border-green-100 rounded-2xl p-8 flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-green-900 mb-2">Check your email</h3>
          <p className="text-green-700 font-medium text-sm mb-8">
            We&apos;ve sent a password reset link to <br/>
            <span className="font-bold">{form.getValues().email}</span>
          </p>
          
          <Link href="/login" className="w-full">
            <Button type="button" className="w-full h-14 rounded-xl font-bold text-base bg-green-600 hover:bg-green-700 text-white shadow-lg transition-all duration-300">
              Return to Sign In
            </Button>
          </Link>
        </div>
      ) : (
        <div className="w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full h-14 rounded-xl font-bold text-base bg-primary-tan hover:bg-gray-900 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sending Link...</span>
                    </div>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </div>
            </form>
          </Form>

          <div className="mt-8 flex justify-center">
            <Link 
              href="/login" 
              className="inline-flex items-center gap-2 text-sm font-bold text-content-grayText hover:text-primary-tan transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Sign in
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
