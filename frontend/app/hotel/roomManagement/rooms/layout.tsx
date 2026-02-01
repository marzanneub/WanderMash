import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rooms | WanderMash",
};

export default function HotelRoomsLayout({children}: {children: React.ReactNode;}) {
    return (
        <main>{children}</main>
    );
}