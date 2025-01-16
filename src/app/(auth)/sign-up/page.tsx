'use client';

import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast"

const phoneRegex = /^0\d{8,9}$/;

const FormSchema = z
  .object({
    username: z.string().min(1, 'Username is required').max(100),
    identifier: z
      .string()
      .min(1, 'Email or phone number is required')
      .refine((val) => phoneRegex.test(val) || /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val), {
        message: 'Please provide a valid email or phone number',
      }),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

const SignUpForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      identifier: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const response = await fetch('/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: values.username,
        identifier: values.identifier,
        password: values.password,
      }),
    });

    if (response.ok) {
      router.push('/sign-in');
    } else {
      toast({
        title: "Error",
        description: "Ops something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-md shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Create an account</h2>

        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="kim thona"
            {...form.register('username')}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
          {form.formState.errors.username && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.username.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
            Email or Phone Number
          </label>
          <input
            id="identifier"
            type="text"
            placeholder="kimthona@gmail.com or 012345678"
            {...form.register('identifier')}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
          {form.formState.errors.identifier && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.identifier.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            {...form.register('password')}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
          {form.formState.errors.password && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Re-enter your password"
            {...form.register('confirmPassword')}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
          {form.formState.errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md"
        >
          Create an account
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <Link href="/sign-in" className="text-blue-500 hover:underline">
            sign in here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUpForm;
