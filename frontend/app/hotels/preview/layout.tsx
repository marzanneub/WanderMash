import Provider from "@/app/provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preview Hotel | WanderMash",
};

export default function HotelPreviewLayout({children}: {children: React.ReactNode;}) {
    return (
        <main>{children}</main>
    );
}