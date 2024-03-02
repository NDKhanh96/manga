"use client";

type DropdownButtonProps = {
  children: React.ReactNode;
  click: () => void;
};

export const DropdownButton: React.FC<DropdownButtonProps> = ({ children, click }) => {
    const onClick = () => {
        click();
    };

    return (
        <span onClick={onClick} className="cursor-pointer">
            {children}
        </span>
    );
};