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
    email: z.string().min(1, { 
        message: 'Email is required'
    }).email({
        message: 'Please enter a valid email'
    }),
    password: z.string().min(1, { 
        message: 'Password is required'
    }),
})

const LoginForm = () => { 
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    })

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                // Store the session and cookie information if needed
                // For example: localStorage.setItem('session', JSON.stringify(result.session));
                router.push("/");
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'An error occurred during login');
            }
        } catch (error) {
            setError('An error occurred during login');
        }
    }

    return ( 
        <Card>
            <CardHeader>
                <CardTitle>
                    Login
                </CardTitle>
                <CardDescription>
                    Log into your account with your credentials
                </CardDescription>
            </CardHeader>

            <CardContent className='space-y-2'>
                {error && <p className="text-red-500">{error}</p>}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-within:ring-offset-0-" placeholder="Enter your email here" {...field} />
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
                                        <Input type="password" className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-within:ring-offset-0-" placeholder="Enter your password here" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button className='w-full' type="submit">
                            Login
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

export default LoginForm;