import Provider from "@/app/provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | WanderMash",
};


export default function RestaurantDashboardLayout({children}: {children: React.ReactNode;}) {
    return (
        <Provider>
        <main>{children}</main>
        </Provider>
    );
}