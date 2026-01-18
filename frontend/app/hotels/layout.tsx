import Provider from "@/app/provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hotels | WanderMash",
};

export default function RestaurantsLayout({children}: {children: React.ReactNode;}) {
    return (
        <Provider showNavbar pagetype="Hotels" showFooter>
        <main>{children}</main>
        </Provider>
    );
}