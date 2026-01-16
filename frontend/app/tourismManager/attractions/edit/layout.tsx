import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Attraction | WanderMash",
};

export default function TourismManagerEditAttractionsLayout({children}: {children: React.ReactNode;}) {
    return (
        <main>{children}</main>
    );
}