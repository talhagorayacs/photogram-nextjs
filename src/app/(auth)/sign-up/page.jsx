'use client';

import { useToast } from '@/hooks/use-toast';
import { signUpSchemaValidation } from '@/Schema/signUpSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Description } from '@radix-ui/react-toast';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDebounceCallback } from 'usehooks-ts';
import * as z from 'zod';
import Spline from "@splinetool/react-spline";
import { Form ,FormField,FormItem,FormLabel,FormControl,FormDescription,FormMessage} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
function page() {
    const [username,setUsername] = useState('')
    const [usernameCheckError, setUsernameCheckError] = useState('')
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const debounced = useDebounceCallback(setUsername, 500)
    const {toast} = useToast()

    const router = useRouter()

    const form = useForm({
        resolver:zodResolver(signUpSchemaValidation),
        defaultValues:{
            username:'',
            email:'',
            password:''
        }
    })

    useEffect(() => {
        
        const  checkUsernameUniqueness = async ()=>{

            if (username) {
                
                setUsernameCheckError('')
                setIsCheckingUsername(true)
                try {
                  const response =   await axios.get(`/api/check-username-unique?username=${username}`)
                  setUsernameCheckError(response.data.message)
                } catch (error) {
                     console.log(error)
                    setUsernameCheckError(error.response?.message ?? "Error checking userName");

                }finally{
                    setIsCheckingUsername(false)
                }
            }
        }
        checkUsernameUniqueness(); 
    
    }, [username])
    

    const onSubmit = async (data) => {
        console.log(data);
        setIsSubmitting(true);
    
        try {
            // Attempt to send form data to the API
            const response = await axios.post('/api/sign-up', data);
    
            // Display a success toast message
            toast({
                title: 'Success',
                description: response.data.message || 'You have successfully signed up!',
            });
    
            // Navigate to the verification page
            router.replace(`/verify/${data.username}`); // Use data.username instead of state variable if username is part of form data
        } catch (error) {
            // Log the error for debugging
            console.error("Error in sign-up frontend:", error);
    
            // Handle the error and show a descriptive toast message
            let errorMessage = error.response?.data?.message || 'An unexpected error occurred. Please try again.';
    
            toast({
                title: "Sign-Up Failed",
                description: errorMessage,
                variant: "destructive", // Assuming "destructive" variant is meant to show a red/error-themed toast
            });
        } finally {
            // Stop the form from being in a loading state
            setIsSubmitting(false);
        }
    };
    
  return (
<div className="h-screen bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800">    {/* <Spline
      scene="https://prod.spline.design/RKa0tbb0EZDNz7AM/scene.splinecode"
      className="absolute inset-0"
    /> */}
    {/* <ParticlesBackground /> */}
    <div className="flex items-center justify-center h-full relative z-10">
      <div className="w-full max-w-lg rounded-xl bg-gray-900 bg-opacity-50 px-16 py-12 shadow-lg backdrop-blur-md max-sm:px-8">
        <div className="text-white">
          <div className="mb-8 flex flex-col items-center">
            <img
              src="https://www.logo.wine/a/logo/Instagram/Instagram-Glyph-Color-Logo.wine.svg"
              width="150"
              alt="Instagram logo"
            />
            <h1 className="mb-2 text-3xl font-bold">Sign Up</h1>
            <span className="text-gray-400">Create an account</span>
          </div>


         {/* form   */}


         <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
        <div>
          <input
            className="w-full rounded-3xl border-none bg-purple-600 bg-opacity-80 px-6 py-2 text-center text-white placeholder-gray-300 shadow-lg outline-none backdrop-blur-md"
            type="text"
            {...field} // Spread field props here
            onChange={(e) => {
              field.onChange(e);
              debounced(e.target.value);
            }}
            placeholder="Full Name"
          />
          {isCheckingUsername && <Loader2 className="animate-spin" />}
          {!isCheckingUsername && usernameCheckError && (
            <p
              className={`text-sm ${
                usernameCheckError === 'Username is unique'
                  ? 'text-green-500'
                  : 'text-red-500'
              }`}
            >
              {usernameCheckError}
            </p>
          )}
        </div>
      </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />

          {/* input 2 */}

          <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
              <input
                  className="w-full rounded-3xl border-none bg-purple-600 bg-opacity-80 px-6 py-2 text-center text-white placeholder-gray-300 shadow-lg outline-none backdrop-blur-md"
                  type="text"
                  name="name"
                 
                  
                  placeholder="Email"

                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

          {/* password */}

          <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
              <input
                  className="w-full rounded-3xl border-none bg-purple-600 bg-opacity-80 px-6 py-2 text-center text-white placeholder-gray-300 shadow-lg outline-none backdrop-blur-md"
                  type="text"
                  name="name"
                  {...field}
                  placeholder="Full Name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

{/* Centered Submit Button */}
<div className="flex justify-center">
  <Button
    type="submit"
    disabled={isSubmitting}
    className="rounded-3xl bg-gradient-to-r from-purple-500 to-purple-700 px-8 py-3 text-white shadow-xl transition-colors duration-300 hover:from-purple-600 hover:to-purple-800"
  >
    {
      isSubmitting ? 
      <>
        <Loader2 className='mr-2 h-4 w-4 animate-spin' /> 
        Please Wait
      </>
      :
      "Sign Up"
    }
  </Button>
</div>

      </form>
    </Form>
    <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-purple-500 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
          {/* Divider */}
          <div className="mt-8 flex items-center justify-center text-gray-400">
            <span className="border-t border-gray-400 w-full"></span>
            <span className="px-4">OR</span>
            <span className="border-t border-gray-400 w-full"></span>
          </div>

          {/* Google & GitHub Login Buttons */}
          <div className="mt-4 flex flex-col items-center gap-4">
            <button
            //   onClick={handleGoogleLogin}
              className="flex items-center justify-center rounded-3xl bg-gradient-to-r from-purple-400 to-purple-600 bg-opacity-80 px-10 py-2 text-white shadow-xl backdrop-blur-md transition-colors duration-300 hover:from-purple-500 hover:to-purple-700 w-full"
            >
              Login with Google
            </button>
            <button
            //   onClick={handleGithubLogin}
              className="flex items-center justify-center rounded-3xl bg-gradient-to-r from-purple-400 to-purple-600 bg-opacity-80 px-10 py-2 text-white shadow-xl backdrop-blur-md transition-colors duration-300 hover:from-purple-500 hover:to-purple-700 w-full"
            >
              Login with GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default page
