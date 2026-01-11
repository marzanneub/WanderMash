import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery | WanderMash",
};

export default function RestaurantGalleryLayout({children}: {children: React.ReactNode;}) {
    return (
        <main>{children}</main>
    );
}