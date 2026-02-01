import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Room Gallery | WanderMash",
};

export default function RoomGalleryLayout({children}: {children: React.ReactNode;}) {
    return (
        <main>{children}</main>
    );
}