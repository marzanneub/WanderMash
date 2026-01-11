import Provider from "../provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | WanderMash",
};

export default function LoginLayout({children}: {children: React.ReactNode;}) {
    return (
        <Provider showNavbar showFooter>
        {children}
        </Provider>
    );
}