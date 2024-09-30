'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast, useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signUpSchemaValidation } from '../../../../Schema/verifySchema';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

function VerificationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  // Extract username from URL
  const username = params.username || 'User';

  const form = useForm({
    resolver: zodResolver(signUpSchemaValidation),
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const response = await axios.get(`/api/verify-code`, {
        params: {
          username: username,
          code: data.code,
        },
      });

      toast({
        title: 'Success',
        description: response.data.message,
      });

      router.replace('/sign-in');
    } catch (error) {
      console.error('Error verifying in frontend', error);

      toast({
        title: 'Failed',
        description: error.response?.data.message || 'Something went wrong!',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800 flex items-center justify-center">
      <div className="w-full max-w-lg rounded-xl bg-gray-900 bg-opacity-50 px-16 py-12 shadow-lg backdrop-blur-md">
        <div className="text-white">
          <div className="mb-8 flex flex-col items-center">
            <img
              src="https://www.logo.wine/a/logo/Instagram/Instagram-Glyph-Color-Logo.wine.svg"
              width="150"
              alt="Logo"
            />
            <h1 className="mb-2 text-3xl font-bold">Verify Account</h1>
            <span className="text-gray-400">
              Hello, <strong>{username}</strong>! Enter the code sent to your email.
            </span>
          </div>

          {/* Verification Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Display the Username */}
              <div className="text-center text-lg font-medium text-white">
                Username: <span className="font-bold">{username}</span>
              </div>

              {/* Input for Verification Code */}
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <input
                        className="w-full rounded-3xl border-none bg-purple-600 bg-opacity-80 px-6 py-2 text-center text-white placeholder-gray-300 shadow-lg outline-none backdrop-blur-md"
                        type="text"
                        placeholder="Enter Verification Code"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button (Centered) */}
              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-3xl bg-gradient-to-r from-purple-500 to-purple-700 px-8 py-3 text-white shadow-xl transition-colors duration-300 hover:from-purple-600 hover:to-purple-800"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default VerificationPage;
