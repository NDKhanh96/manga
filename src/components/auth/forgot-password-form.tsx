'use client';

import * as zod from 'zod';
import { forgotPasswordSchema } from '@/schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '~/ui/form';
import { CardWrapper } from '~/auth/card-wrapper';
import { Input } from '~/ui/input';
import { Button } from '~/ui/button';
import { FormError } from '~/form-error';
import { forgotPassword } from '@/actions/forgot-password';
import { useState, useTransition } from 'react';
import { FormSuccess } from '@/components/form-success';

export const ForgotPasswordForm = () => {
    const [error, setError] = useState<string | undefined>('');
    const [success, setSuccess] = useState<string | undefined>('');
    const [isPending, startTransition] = useTransition();
    const form = useForm<zod.infer<typeof forgotPasswordSchema>>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = (values: zod.infer<typeof forgotPasswordSchema>) => {
        setError('');

        startTransition(() => {
            forgotPassword(values)
                .then(data => {
                    setError(data?.error);
                    setSuccess(data?.success);
                })
                .catch(error => {
                    setError(error?.message || error);
                });
        });
    };

    return (
        <CardWrapper
            headerLabel="Forgot your password?"
            backButtonLabel="Back to login"
            backButtonHref="/auth/login">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6">
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
                            )}></FormField>
                    </div>
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Button
                        disabled={isPending}
                        type="submit"
                        className="w-full">
                        Send reset email
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
};
