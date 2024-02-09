"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from '~/ui/avatar';
import { FaUser } from "react-icons/fa";
import { useCurrentUser } from "@/custom-hooks/use-current-user";
import { DropdownButton } from "@/components/auth/dropdown-button";
import { ExitIcon } from "@radix-ui/react-icons";
import { GearIcon } from "@radix-ui/react-icons";
import { signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';

export const UserButton = () => {
    const user = useCurrentUser();
    const router = useRouter();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage src={user?.image || ""} />
                        <AvatarFallback className="bg-sky-500">
                            <FaUser className="text-white" />
                        </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end">
                <DropdownButton
                    click={() => signOut()}
                >
                    <DropdownMenuItem>
                        <ExitIcon className="mr-2 h-4 w-4" />
                        Sign out
                    </DropdownMenuItem>
                </DropdownButton>
                <DropdownButton
                    click={() => router.push('/settings')}
                >
                    <DropdownMenuItem>
                        <GearIcon className="mr-2 h-4 w-4" />
                        Settings
                    </DropdownMenuItem>
                </DropdownButton>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}