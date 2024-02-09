"use client";

import { LogoutButton } from '@/components/auth/logout-button';

const SettingsPage = () => {

    return (
        <div className="bg-white p-10 rounded-xl">
            <LogoutButton>
                Sign out
            </LogoutButton>
        </div>
    );
};

export default SettingsPage;
