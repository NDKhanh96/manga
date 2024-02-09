import { Navbar } from "@/app/(authenticated)/_components/navbar";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

const AuthenticatedLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth();
    return (
        <SessionProvider session={session}>
            <div className="flex h-full w-full flex-col gap-y-10 items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
                <Navbar />
                {children}
            </div>
        </SessionProvider>
    );
};

export default AuthenticatedLayout;