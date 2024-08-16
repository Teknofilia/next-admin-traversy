'use client'

import * as z from 'zod'
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from 'react';

const formSchema = z.object({
    fullName: z.string().min(1, {
        message: 'Full name is required'
    }),
    email: z.string().min(1, { 
        message: 'Email is required'
    }).email({
        message: 'Please enter a valid email'
    }),
    password: z.string().min(6, { 
        message: 'Password must be at least 6 characters long'
    }),
})

const RegisterForm = () => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
        }
    })

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                router.push("/");
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'An unknown error occurred');
            }
        } catch (error) {
            setError('An unknown error occurred');
        }
    }

    return ( 
        <Card>
            <CardHeader>
                <CardTitle>Register</CardTitle>
                <CardDescription>Create your account</CardDescription>
            </CardHeader>

            <CardContent className='space-y-2'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                                        Full Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-within:ring-offset-0" placeholder="Enter your full name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-within:ring-offset-0" placeholder="Enter your email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                                        Password
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="password" className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-within:ring-offset-0" placeholder="Enter your password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <Button type="submit" className='w-full'>
                            Register
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
 
export default RegisterForm;