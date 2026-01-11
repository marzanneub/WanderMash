import Provider from "@/app/provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Profile | WanderMash",
};

export default function LoginLayout({children}: {children: React.ReactNode;}) {
    return (
        <Provider showNavbar showFooter>
        <main>{children}</main>
        </Provider>
    );
}