"use client";

import * as zod from "zod";
import { loginSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/ui/form";
import { CardWrapper } from "~/auth/card-wrapper";
import { Input } from "~/ui/input";
import { Button } from "~/ui/button";
import { FormError } from "~/form-error";
import { login } from "@/actions/login";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export const LoginForm = () => {
    const searchParams = useSearchParams();
    const urlError = searchParams.get("error") === 'OAuthAccountNotLinked' ? 'Email already in use with difference provider' : '';
    const [showTwoFactor, setShowTwoFactor] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>('');
    const [isPending, startTransition] = useTransition();
    const form = useForm <zod.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const onSubmit = (values: zod.infer<typeof loginSchema>) => {
        setError('');

        startTransition(() => {
            login(values)
                .then((data) => {
                    if (data?.error) {
                        form.reset();
                        setError(data?.error);
                    }

                    if (data?.twoFactor) {
                        setShowTwoFactor(true);
                    }
                })
                .catch((error) => {
                    setError(error?.message || 'something went wrong');
                });
        });
    };

    return (
        <CardWrapper
            headerLabel="Login"
            backButtonLabel="Don't have an account"
            backButtonHref="/auth/register"
            showSocialLogin
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        {showTwoFactor && (
                            <FormField 
                                control={form.control} 
                                name="code" 
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Two Factor Code</FormLabel>
                                        <FormControl>
                                            <Input 
                                                {...field}
                                                disabled={isPending}
                                                placeholder="Enter your two factor code"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {!showTwoFactor && (
                            <>
                                <FormField 
                                    control={form.control} 
                                    name="email" 
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    {...field}
                                                    disabled={isPending}
                                                    placeholder="Enter your email"
                                                    type="email"
                                                />
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
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    {...field}
                                                    disabled={isPending}
                                                    placeholder="Enter your password"
                                                    type="password"
                                                />
                                            </FormControl>
                                            <Button size="sm" variant="link" asChild className="px-0 font-normal">
                                                <Link href="/auth/forgot-password"
                                                >
                                            Forgot Password?
                                                </Link>
                                            </Button>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}
                    </div>
                    <FormError message={error || urlError} />
                    <Button
                        disabled={isPending}
                        type="submit"
                        className="w-full"
                    >
                        {showTwoFactor ? 'Verify' : 'Login'}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
};
