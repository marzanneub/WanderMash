import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | WanderMash",
};

export default function HotelDashboardLayout({children}: {children: React.ReactNode;}) {
    return (
        <main>{children}</main>
    );
}