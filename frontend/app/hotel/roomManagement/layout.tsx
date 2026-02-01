import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Room Management | WanderMash",
};

export default function HotelRoomManagementLayout({children}: {children: React.ReactNode;}) {
    return (
        <main>{children}</main>
    );
}