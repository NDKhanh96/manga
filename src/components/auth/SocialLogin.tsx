'use client';

import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { Button } from '~/ui/button';
import { signIn } from 'next-auth/react';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
export const SocialLogin = () => {
    const socialLogin = (providers: 'google' | 'github') => {
        signIn(providers, { callbackUrl: DEFAULT_LOGIN_REDIRECT });
    };

    return (
        <div className="flex w-full flex-col items-center space-y-2">
            <Button
                size="lg"
                className="w-full"
                variant="outline"
                onClick={() => {
                    socialLogin('google');
                }}>
                <FcGoogle className="h-5 w-5" />
            </Button>
            <Button
                size="lg"
                className="w-full"
                variant="outline"
                onClick={() => {
                    socialLogin('github');
                }}>
                <FaGithub className="h-5 w-5" />
            </Button>
        </div>
    );
};
