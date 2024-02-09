import { Navbar } from "@/components/navbar/navbar";


const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex h-full w-full flex-col gap-y-10 items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
            <Navbar />
            {children}
        </div>
    );
};

export default AuthenticatedLayout;
