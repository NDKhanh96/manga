"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from '~/ui/avatar';
import { FaUser } from "react-icons/fa";
import { useCurrentUser } from "@/custom-hooks/use-current-user";
import { LogoutButton } from "~/auth/logout-button";
import { ExitIcon } from "@radix-ui/react-icons";

export const UserButton = () => {
    const user = useCurrentUser();

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
                <LogoutButton>
                    <DropdownMenuItem>
                        <ExitIcon className="mr-2 h-4 w-4" />
                        Sign out
                    </DropdownMenuItem>
                </LogoutButton>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}