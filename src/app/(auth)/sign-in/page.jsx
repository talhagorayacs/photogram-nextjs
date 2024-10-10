"use client";

import { useToast } from "@/hooks/use-toast";
import { signInSchemaValidation } from "@/Schema/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

import { useEffect } from "react";

function SignInPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const userName = session?.user?.username;

  const form = useForm({
    resolver: zodResolver(signInSchemaValidation),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    console.log("Sign In Result:", result);

    setIsSubmitting(false);

    if (result?.error) {
      console.error("Sign in error:", result.error);
      toast({
        title: "Login Failed",
        description: "Incorrect username or password",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (userName) {
      console.log(
        "Successfully signed in, redirecting to dashboard for:",
        userName
      );
      router.replace(`/`);
      toast({
        title: "Login Successful",
        description: "Welcome, " + userName,
      });
    }
  }, [userName, router, toast]);

  return (
    <div className="h-screen bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800">
      <div className="flex items-center justify-center h-full relative z-10">
        <div className="w-full max-w-lg rounded-xl bg-gray-900 bg-opacity-50 px-16 py-12 shadow-lg backdrop-blur-md max-sm:px-8">
          <div className="text-white">
            <div className="mb-8 flex flex-col items-center">
              <img
                src="https://www.logo.wine/a/logo/Instagram/Instagram-Glyph-Color-Logo.wine.svg"
                width="150"
                alt="Instagram logo"
              />
              <h1 className="mb-2 text-3xl font-bold">Sign In</h1>
              <span className="text-gray-400">
                Welcome back! Please sign in to continue.
              </span>
            </div>

            {/* Form */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* Username/Email Field */}
                <FormField
                  control={form.control}
                  name="identifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username/Email</FormLabel>
                      <FormControl>
                        <input
                          className="w-full rounded-3xl border-none bg-purple-600 bg-opacity-80 px-6 py-2 text-center text-white placeholder-gray-300 shadow-lg outline-none backdrop-blur-md"
                          type="text"
                          {...field}
                          placeholder="Username/Email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <input
                          className="w-full rounded-3xl border-none bg-purple-600 bg-opacity-80 px-6 py-2 text-center text-white placeholder-gray-300 shadow-lg outline-none backdrop-blur-md"
                          type="password"
                          {...field}
                          placeholder="Password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <div className="flex justify-center">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-3xl bg-gradient-to-r from-purple-500 to-purple-700 px-8 py-3 text-white shadow-xl transition-colors duration-300 hover:from-purple-600 hover:to-purple-800"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Please Wait
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </div>
              </form>
            </Form>

            {/* Sign Up Link */}
            <div className="text-center mt-4">
              <p>
                Not a member yet?{" "}
                <Link
                  href="/sign-up"
                  className="text-purple-500 hover:text-blue-800"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
