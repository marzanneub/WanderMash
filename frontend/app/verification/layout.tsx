import Provider from "../provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verification | WanderMash",
};

export default function ForgotPasswordLayout({children}: {children: React.ReactNode;}) {
    return (
        <Provider showNavbar showFooter>
        {children}
        </Provider>
    );
}