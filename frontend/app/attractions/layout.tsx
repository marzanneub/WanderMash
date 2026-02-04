import Provider from "@/app/provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Attractions | WanderMash",
};

export default function AttractionsLayout({children}: {children: React.ReactNode;}) {
    return (
        <Provider showNavbar pagetype="Attractions" showFooter>
        <main>{children}</main>
        </Provider>
    );
}