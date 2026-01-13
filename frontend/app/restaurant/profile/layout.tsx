import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | WanderMash",
};

export default function RestaurantProfileLayout({children}: {children: React.ReactNode;}) {
    return (
        <main>{children}</main>
    );
}