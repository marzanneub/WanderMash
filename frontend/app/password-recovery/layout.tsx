import Provider from "@/app/provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Password Recovery | WanderMash",
};

export default function ForgotPasswordLayout({children}: {children: React.ReactNode;}) {
    return (
        <Provider showNavbar showFooter>
        {children}
        </Provider>
    );
}