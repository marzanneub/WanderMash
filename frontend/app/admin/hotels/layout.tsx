import Provider from "@/app/provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hotels | WanderMash",
};


export default function AdminHotelsLayout({children}: {children: React.ReactNode;}) {
    return (
        <Provider>
        <main>{children}</main>
        </Provider>
    );
}