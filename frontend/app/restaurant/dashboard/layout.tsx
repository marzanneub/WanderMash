import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | WanderMash",
};

export default function RestaurantDashboardLayout({children}: {children: React.ReactNode;}) {
    return (
        <main>{children}</main>
    );
}