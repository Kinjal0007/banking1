'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from './ui/button';
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from './ui/form';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signIn, signUp } from '@/lib/actions/user.actions';
import PlaidLink from './PlaidLink';
import CustomInput from './CustomInput';
import { authformSchema } from '@/lib/utils';

const AuthForm = ({ type }: { type: string }) => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const formSchema = authformSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      dateOfBirth: '',
      ssn: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (type === 'sign-up') {
        const userData = {
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            address1: data.address || '',
            city: data.city || '',
            state: data.state || '',
            postalCode: data.postalCode || '',
            dateOfBirth: data.dateOfBirth || '',
            ssn: data.ssn || '',
            email: data.email || '',
            password: data.password || '',
          };
          

        const newUser = await signUp(userData);

        if (!newUser) {
          throw new Error('Sign-up failed');
        }

        setUser(newUser);
        console.log('New user:', newUser);
      }

      if (type === 'sign-in') {
        const response = await signIn({
          email: data.email || '',
          password: data.password || '',
        });
        if (response) {
          router.push('/');
        } else {
          throw new Error('Sign-in failed');
        }
      }
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className="cursor-pointer items-center gap-1">
          <Image
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="Horizon Logo"
          />
          <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
            Horizon
          </h1>
        </Link>
        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {user
              ? 'Link Account'
              : type === 'sign-in'
              ? 'Sign In'
              : 'Sign Up'}
          </h1>
          <p className="text-16 font-normal text-gray-600">
            {user
              ? 'Link your account to get started'
              : 'Please enter your details'}
          </p>
        </div>
      </header>

      {errorMessage && (
        <p className="text-red-500 text-center mb-4">{errorMessage}</p>
      )}

      {user ? (
        <div className="flex flex-col gap-4">
          <PlaidLink user={user} variant="primary" />
        </div>
      ) : (
        <>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              {type === 'sign-up' && (
                <>
                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name="firstName"
                      label="First Name"
                      placeholder="Enter your first name"
                      autoComplete="given-name"
                    />
                    <CustomInput
                      control={form.control}
                      name="lastName"
                      label="Last Name"
                      placeholder="Enter your last name"
                      autoComplete="family-name"
                    />
                  </div>
                  <CustomInput
                    control={form.control}
                    name="address"
                    label="Address"
                    placeholder="Enter your specific address"
                    autoComplete="street-address"
                  />
                  <CustomInput
                    control={form.control}
                    name="city"
                    label="City"
                    placeholder="Enter your city"
                    autoComplete="address-level2"
                  />
                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name="state"
                      label="State (2-letter abbreviation)"
                      placeholder="e.g., NY"
                      autoComplete="address-level1"
                    />
                    <CustomInput
                      control={form.control}
                      name="postalCode"
                      label="Postal Code"
                      placeholder="e.g., 10001"
                      autoComplete="postal-code"
                    />
                  </div>
                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name="dateOfBirth"
                      label="Date of Birth"
                      placeholder="YYYY-MM-DD"
                      autoComplete="bday"
                    />
                    <CustomInput
                      control={form.control}
                      name="ssn"
                      label="SSN"
                      placeholder="000-00-0000"
                      autoComplete="off"
                    />
                  </div>
                </>
              )}

              <CustomInput
                control={form.control}
                name="email"
                label="Email"
                placeholder="Enter your email"
                autoComplete="username"
              />

              <CustomInput
                control={form.control}
                name="password"
                label="Password"
                placeholder="Enter your password"
                autoComplete={
                  type === 'sign-in' ? 'current-password' : 'new-password'
                }
              />
              <div className="flex flex-col gap-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="form-btn"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> &nbsp;
                      Loading...
                    </>
                  ) : type === 'sign-in' ? 'Sign In' : 'Sign Up'}
                </Button>
              </div>
            </form>
          </Form>
          <footer className="flex justify-center gap-1">
            <p className="text-14 font-normal text-gray-600">
              {type === 'sign-in'
                ? "Don't have an account?"
                : 'Already have an account?'}
            </p>
            <Link
              href={type === 'sign-in' ? '/sign-up' : '/sign-in'}
              className="form-link"
            >
              {type === 'sign-in' ? 'Sign Up' : 'Sign In'}
            </Link>
          </footer>
        </>
      )}
    </section>
  );
};

export default AuthForm;
