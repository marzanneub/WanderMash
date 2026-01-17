import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Profile | WanderMash",
};

export default function HotelEditProfileLayout({children}: {children: React.ReactNode;}) {
    return (
        <main>{children}</main>
    );
}