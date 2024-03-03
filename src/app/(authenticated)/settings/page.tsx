'use client';

import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/ui/form';
import { Input } from '~/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '~/ui/card';
import { Switch } from '~/ui/switch';
import { useForm } from 'react-hook-form';
import { settingsSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCurrentUser } from '@/custom-hooks/use-current-user';
import { useTransition, useState } from 'react';
import { Button } from '~/ui/button';
import { settings } from '@/actions/settings';
import { FormError } from '~/form-error';
import { FormSuccess } from '~/form-success';
import { useSession } from 'next-auth/react';

const SettingsPage = () => {
    const { update } = useSession();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const user = useCurrentUser();

    const form = useForm<z.infer<typeof settingsSchema>>(({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            name: user?.name || undefined,
            email: user?.email || undefined,
            newPassword: undefined,
            confirmNewPassword: undefined,
            isTwoFactorEnabled: user?.isTwoFactorEnabled,
        }
    }));

    const onSubmit = (values: z.infer<typeof settingsSchema>) => {
        startTransition(async () => {
            try {
                const res = await settings(values);

                update();

                if (res.error) {
                    setError(res.error);
                } else if (res.success) {
                    setSuccess(res.success);
                }
            } catch {
                setError('Something went wrong');
            }
        });
    };

    return (
        <Card className="w-[600px] shadow-md">
            <CardHeader className="flex flex-row justify-center">
                <CardTitle>⚙️ Settings</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input 
                                                {...field}
                                                placeholder="Name"
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {!user?.isOAuth && (
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
                                                        placeholder="Email"
                                                        disabled={isPending}
                                                        type="email"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="newPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>New Password</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        {...field}
                                                        placeholder="New Password"
                                                        disabled={isPending}
                                                        type="password"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="confirmNewPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm New Password</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        {...field}
                                                        placeholder="Confirm New Password"
                                                        disabled={isPending}
                                                        type="password"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="isTwoFactorEnabled"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row justify-between items-center rounded-lg border p-3 shadow-sm">
                                                <div className="space-y-0.5">
                                                    <FormLabel>Two Factor Authentication</FormLabel>
                                                    <FormDescription>
                                            Enable two factor authentication for your account
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch 
                                                        disabled={isPending}
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}
                        </div>
                        <FormError message={error} />
                        <FormSuccess message={success} />
                        <div className="flex flex-row justify-center">
                            <Button
                                disabled={isPending}
                                type="submit"
                            >
                                Save
                            </Button>
                        </div>
                    </form> 
                </Form>
            </CardContent>
        </Card>
    );
};

export default SettingsPage;
