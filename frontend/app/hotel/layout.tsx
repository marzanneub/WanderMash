import Provider from "@/app/provider";

export default function HotelLayout({children}: {children: React.ReactNode;}) {
    return (
        <Provider showNavbar showFooter>
        <main>{children}</main>
        </Provider>
    );
}