"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "~/ui/button";
export const SocialLogin = () => {
    return (
        <div className="w-full flex items-center space-y-2 flex-col">
            <Button size="lg" className="w-full" variant="outline" onClick={() => {}}>
                <FcGoogle className="w-5 h-5" />
            </Button>
            <Button size="lg" className="w-full" variant="outline" onClick={() => {}}>
                <FaGithub className="w-5 h-5" />
            </Button>
        </div>
    );
};
