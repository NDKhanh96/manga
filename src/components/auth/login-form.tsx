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
import { FormSuccess } from "~/form-success";
import { login } from "@/actions/login";
import { useState, useTransition } from "react";

export const LoginForm = () => {
    const [error, setError] = useState<string | undefined>('');
    const [success, setSuccess] = useState<string | undefined>('');
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
        setSuccess('');

        startTransition(() => {
            login(values)
                .then((data) => {
                    setError(data.error);
                    setSuccess(data.success);
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
                            )}>
                        </FormField>
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
                                    <FormMessage />
                                </FormItem>
                            )}>
                        </FormField>
                    </div>
                    {error && <FormError message={error} />}
                    {success && <FormSuccess message={success} />}
                    <Button
                        disabled={isPending}
                        type="submit"
                        className="w-full"
                    >
                        Login
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
};
