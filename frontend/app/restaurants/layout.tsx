import Provider from "@/app/provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Restaurants | WanderMash",
};

export default function RestaurantsLayout({children}: {children: React.ReactNode;}) {
    return (
        <Provider showNavbar pagetype="Restaurants" showFooter>
        <main>{children}</main>
        </Provider>
    );
}