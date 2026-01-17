import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Attraction Gallery | WanderMash",
};

export default function AttractionGalleryLayout({children}: {children: React.ReactNode;}) {
    return (
        <main>{children}</main>
    );
}