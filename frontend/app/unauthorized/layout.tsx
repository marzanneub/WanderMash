import Provider from "../provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unauthorized Access | WanderMash",
};

export default function UnauthorizedLayout({children}: {children: React.ReactNode;}) {
    return (
        <Provider>
        {children}
        </Provider>
    );
}