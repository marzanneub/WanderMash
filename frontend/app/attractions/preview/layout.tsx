import Provider from "@/app/provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preview Attraction | WanderMash",
};

export default function RestaurantPreviewLayout({children}: {children: React.ReactNode;}) {
    return (
        <main>{children}</main>
    );
}