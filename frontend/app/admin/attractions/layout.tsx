import Provider from "@/app/provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Attractions | WanderMash",
};


export default function AdminAttractionsLayout({children}: {children: React.ReactNode;}) {
    return (
        <Provider>
        <main>{children}</main>
        </Provider>
    );
}