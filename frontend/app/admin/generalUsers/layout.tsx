import Provider from "@/app/provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "General Users | WanderMash",
};


export default function AdminGeneralUsersLayout({children}: {children: React.ReactNode;}) {
    return (
        <Provider>
        <main>{children}</main>
        </Provider>
    );
}