"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const phoneRegex = /^0\d{8,9}$/;

const FormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(255, "Name is too long"),
  identifier: z
    .string()
    .min(1, "Email or phone number is required")
    .refine(
      (val) =>
        z.string().email().safeParse(val).success || phoneRegex.test(val),
      "Must be a valid email or Cambodian phone number"
    ),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must have at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  password_confirmation: z
    .string()
    .min(1, "Password confirmation is required"),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

const SignUpForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { register: registerUser, sendOTP, googleLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      identifier: "",
      password: "",
      password_confirmation: "",
    },
  });

  // Helper function to check if input is email or phone
  const isEmail = (value) => {
    return z.string().email().safeParse(value).success;
  };

  // Helper function to normalize Cambodian phone number
  const normalizePhoneNumber = (phone) => {
    // Remove any spaces, dashes, or other characters except + and digits
    const cleaned = phone.replace(/[^\d+]/g, '');
    
    // If starts with 0, replace with +855
    if (cleaned.startsWith('0')) {
      return '+855' + cleaned.slice(1);
    }
    
    // If starts with +855, keep as is
    if (cleaned.startsWith('+855')) {
      return cleaned;
    }
    
    // If starts with 855, add +
    if (cleaned.startsWith('855')) {
      return '+' + cleaned;
    }
    
    // If just the number without country code, add +855
    if (cleaned.length >= 8 && cleaned.length <= 9 && !cleaned.includes('+')) {
      return '+855' + cleaned;
    }
    
    return cleaned;
  };

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      const identifier = values.identifier.trim();

      if (isEmail(identifier)) {
        // Email registration - register directly
        const registerData = {
          name: values.name.trim(),
          email: identifier.toLowerCase(),
          password: values.password,
          password_confirmation: values.password_confirmation,
        };

        const result = await registerUser(registerData);

        if (result.success) {
          toast({
            title: "Success",
            description: "Account created successfully! You can now sign in.",
            variant: "default",
          });
          router.push("/sign-in");
        } else {
          // Handle validation errors
          if (result.errors) {
            Object.keys(result.errors).forEach((field) => {
              if (field === 'email') {
                form.setError('identifier', {
                  type: "server",
                  message: result.errors[field][0] || result.errors[field],
                });
              } else {
                form.setError(field as "name" | "identifier" | "password" | "password_confirmation" | "root", {
                  type: "server",
                  message: result.errors[field][0] || result.errors[field],
                });
              }
            });
          } else {
            toast({
              title: "Registration Error",
              description: result.error || "Failed to create account",
              variant: "destructive",
            });
          }
        }
      } else {
        // Phone registration - send OTP with password
        const normalizedPhone = normalizePhoneNumber(identifier);
        
        console.log("=== PHONE REGISTRATION DEBUG ===");
        console.log("Original phone:", identifier);
        console.log("Normalized phone:", normalizedPhone);
        console.log("Name:", values.name.trim());
        console.log("Password provided:", !!values.password);
        console.log("===================================");
        
        // Send OTP with password included
        const otpResult = await sendOTP(normalizedPhone, values.name.trim(), values.password);

        if (otpResult.success) {
          toast({
            title: "OTP Sent",
            description: "Please check your phone for the verification code",
            variant: "default",
          });
          
          // Navigate to OTP verification page with user data
          const params = new URLSearchParams({
            phone: normalizedPhone,
            name: values.name.trim(),
          });
          
          // Store password temporarily in sessionStorage for OTP verification (backup method)
          sessionStorage.setItem('temp_registration_password', values.password);
          
          router.push(`/otp?${params.toString()}`);
        } else {
          console.error("OTP send failed:", otpResult);
          toast({
            title: "Error",
            description: otpResult.error || "Failed to send OTP",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    try {
      await googleLogin();
    } catch (error) {
      toast({
        title: "Google Sign Up Error",
        description: "Failed to sign up with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create your account
            </h1>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 md:space-y-6"
            >
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  {...form.register("name")}
                  id="name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="John Doe"
                />
                <p className="text-red-600 text-sm mt-1">
                  {form.formState.errors.name?.message}
                </p>
              </div>

              <div>
                <label
                  htmlFor="identifier"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email or Phone Number
                </label>
                <input
                  type="text"
                  {...form.register("identifier")}
                  id="identifier"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="john@example.com or 012345678"
                />
                <p className="text-red-600 text-sm mt-1">
                  {form.formState.errors.identifier?.message}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Phone numbers will require OTP verification
                </p>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  {...form.register("password")}
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                <p className="text-red-600 text-sm mt-1">
                  {form.formState.errors.password?.message}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Must contain at least 8 characters with uppercase, lowercase, and numbers
                </p>
              </div>

              <div>
                <label
                  htmlFor="password_confirmation"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  {...form.register("password_confirmation")}
                  id="password_confirmation"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                <p className="text-red-600 text-sm mt-1">
                  {form.formState.errors.password_confirmation?.message}
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating account..." : "Create account"}
              </button>

              <div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
                or
              </div>

              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={isGoogleLoading}
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isGoogleLoading ? (
                  "Connecting..."
                ) : (
                  <>
                    <svg
                      className="inline-block mr-2 w-4 h-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                    >
                      <path
                        fill="#FFC107"
                        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      />
                      <path
                        fill="#FF3D00"
                        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                      />
                      <path
                        fill="#4CAF50"
                        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                      />
                      <path
                        fill="#1976D2"
                        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                      />
                    </svg>
                    Sign up with Google
                  </>
                )}
              </button>

              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/sign-in"
                  className="font-medium text-blue-600 hover:underline dark:text-primary-500"
                >
                  Sign in here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUpForm;