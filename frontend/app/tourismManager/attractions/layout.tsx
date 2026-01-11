import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Attractions | WanderMash",
};

export default function TourismManagerAttractionsLayout({children}: {children: React.ReactNode;}) {
    return (
        <main>{children}</main>
    );
}