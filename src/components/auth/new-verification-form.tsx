'use client';

import { CardWrapper } from '~/auth/card-wrapper';
import { BeatLoader } from 'react-spinners';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { newVerification } from '@/actions/new-verification';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';

export const NewVerificationForm = () => {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const onSubmit = useCallback(() => {
        if (!token) {
            setError('Token not found');

            return;
        }

        newVerification(token)
            .then(data => {
                if (data.success) {
                    setSuccess(data.success);
                } else {
                    setError(data.error);
                }
            })
            .catch(error => {
                setError(error?.message || error || 'Something went wrong!');
            });
    }, [token]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);

    return (
        <CardWrapper
            headerLabel={'Confirm your verification'}
            backButtonLabel={'Back to login'}
            backButtonHref={'/auth/login'}>
            <div className="flex w-full items-center justify-center">
                {!success && !error && <BeatLoader />}
                <FormSuccess message={success} />
                {!success && <FormError message={error} />}
            </div>
        </CardWrapper>
    );
};
