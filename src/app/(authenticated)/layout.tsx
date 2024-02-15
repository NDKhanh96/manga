

const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex h-full w-full flex-col gap-y-10 items-center justify-center">
            {children}
        </div>
    );
};

export default AuthenticatedLayout;
