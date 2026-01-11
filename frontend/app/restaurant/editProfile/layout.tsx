import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Profile | WanderMash",
};

export default function RestaurantEditProfileLayout({children}: {children: React.ReactNode;}) {
    return (
        <main>{children}</main>
    );
}