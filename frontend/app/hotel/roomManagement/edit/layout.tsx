import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Room | WanderMash",
};

export default function HotelRoomsEditLayout({children}: {children: React.ReactNode;}) {
    return (
        <main>{children}</main>
    );
}