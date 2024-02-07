'use client';

import { Card, CardContent, CardFooter, CardHeader } from '~/ui/card';
import { Header } from '~/auth/header';
import { SocialLogin } from '~/auth/SocialLogin';
import { BackButton } from '~/auth/back-button';

type CardWrapperProps = {
    children: React.ReactNode;
    headerLabel: string;
    backButtonLabel: string;
    backButtonHref: string;
    showSocialLogin?: boolean;
};

export const CardWrapper = ({
    children,
    headerLabel,
    backButtonLabel,
    backButtonHref,
    showSocialLogin,
}: CardWrapperProps) => {
    return (
        <Card className=" w-[400px] shadow-md">
            <CardHeader>
                <Header label={headerLabel} />
            </CardHeader>
            <CardContent>{children}</CardContent>
            {showSocialLogin && (
                <CardFooter>
                    <SocialLogin />
                </CardFooter>
            )}
            <CardFooter>
                <BackButton label={backButtonLabel} href={backButtonHref} />
            </CardFooter>
        </Card>
    );
};
