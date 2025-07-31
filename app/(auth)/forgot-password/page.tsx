"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    const res = await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.email }),
    });

    const result = await res.json();
    setMessage(result.message);

    if (result.success) {
      // Redirect to verification page after email is sent
      setTimeout(() => {
        router.push("/verify-code");
      }, 1500);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded text-white">
      <h1 className="text-3xl p-3 mb-6 text-center font-mona tracking-wide">
        FORGOT PASSWORD
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter your email"
                    className="text-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Send Verification Code
          </Button>

          <p className="text-center mt-3 font-mona">
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-2 text-sm font-semibold hover:text-blue-500 transition duration-200 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
              <span className="underline underline-offset-4">Back To Sign-In</span>
            </Link>
          </p>

          {message && (
            <p className="text-center text-sm mt-4 text-red-400">{message}</p>
          )}
        </form>
      </Form>
    </div>
  );
}
