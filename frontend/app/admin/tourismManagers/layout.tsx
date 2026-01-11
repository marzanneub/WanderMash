import Provider from "@/app/provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tourism Managers | WanderMash",
};


export default function TourismManagersLayout({children}: {children: React.ReactNode;}) {
    return (
        <Provider>
        <main>{children}</main>
        </Provider>
    );
}