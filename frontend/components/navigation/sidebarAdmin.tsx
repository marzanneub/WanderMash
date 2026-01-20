"use client";
import React, {useState} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";
import { 
    AiFillEnvironment,
    AiOutlineBarChart,
    AiOutlineFileText,
    AiOutlineMail,
    AiOutlineSetting,
} from "react-icons/ai";
import { 
    BsArrowLeftShort,
    BsChevronDown,
    BsFillImageFill,
    BsReverseLayoutTextSidebarReverse,
    BsPerson, 
    BsSearch,
} from "react-icons/bs";
import { FaUserEdit, FaUsers } from "react-icons/fa";
import { LiaUserEditSolid } from "react-icons/lia";
import { RiAdminLine, RiDashboardFill, RiLogoutBoxRLine  } from "react-icons/ri";

interface Props {
  pagetype: string;
}

const SidebarAdmin: React.FC<Props> = (props) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [submenuOpen, setSubmenuOpen] = useState(false);
    const Menus = [
        // { title: "Dashboard", submenu: false, submenuItems: [] },
        // { title: "Pages", submenu: false, submenuItems: [], icon: <AiOutlineFileText /> },
        // { title: "Media", submenu: false, submenuItems: [], spacing:true, icon: <BsFillImageFill /> },
        // { title: "Analysis", submenu: false, submenuItems: [], icon: <AiOutlineBarChart /> },
        // { title: "Inbox", submenu: false, submenuItems: [], icon: <AiOutlineMail /> },
        // { title: "Profile", href: "profile", spacing: true, icon: <BsPerson /> },
        // { title: "Edit Profile", href: "editProfile", icon: <LiaUserEditSolid /> },
        { title: "Dashboard", href: "dashboard", icon: <RiAdminLine /> },
        {
            title: "Users",
            icon: <FaUsers />,
            submenu: true,
            submenuItems: [
                { title: "Tourism Managers",  href: "tourismManagers" },
                { title: "Submenu 2" },
                { title: "Submenu 3" },
            ],
        },
        { title: "Settings", href: "settings", spacing: true, icon: <AiOutlineSetting /> },
        { title: "Logout", action: "logout", icon: <RiLogoutBoxRLine /> },
    ];

    const  handleLogout = async () => {
        await fetch("/api/logout", {
            method: "POST",
            credentials: "include",
        });
        
        router.push("/");
    }

    return ( 
        <div className={`bg-indigo-950 p-5 pt-8 ${
                open?"w-72":"w-20"
            } duration-300 relative sticky top-[64px] h-[calc(100vh-64px)] z-40`}>
            <IoArrowBack className={`bg-white text-black text-3xl rounded-full
                absolute -right-3 top-9 border 
                border-indigo-950 cursor-pointer ${
                    !open && "rotate-180"} duration-300`} 
                onClick={() => setOpen(!open)}/>

            <div className="inline-flex">
                    {/* <AiFillEnvironment 
                        className={`bg-amber-300 text-4xl rounded 
                        cursor-pointer block float-left mr-2 duration-500 ${
                        open && "rotate-360"
                    }`}/> */}
                    <img
                        src={`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/images/logo.JPG`}
                        className={`w-10 h-10 rounded
                            cursor-pointer mr-2 transition-transform duration-500
                            ${open ? "rotate-360" : ""}
                        `}
                    />

                <h1 
                    className={`text-white origin-left font-medium text-xl 
                    duration-300 ${
                        !open && "scale-0"
                    }`
                }>WanderMash</h1>
            </div>
            
            {/* <div className={`flex items-center rounded-md bg-white/10
            mt-6 ${!open ? "px-2.5" : "px-4"} py-2`}>
                <BsSearch className={`text-white text-lg block
                float-left cursor-pointer ${open && "mr-2"}`}/>

                <input type={"search"} placeholder="Search"className=
                {`text-base bg-transparent w-full text-white
                focus:outline-none ${!open && "hidden"}`} />
            </div> */}


            <ul>
                {Menus.map((menu, index) => (
                    <div key={index}>
                        {menu.action === "logout" ? (
                            <li
                            onClick={handleLogout}
                            className={`text-gray-300 text-sm flex
                            items-center gap-x-4 cursor-pointer p-2 ${props.pagetype===menu.title && "bg-white/10"}
                            hover:bg-white/10 rounded-md ${menu.spacing ? "mt-9" : "mt-2"}`}>
                                <span className="text-2xl block float-left">
                                    {menu.icon ? menu.icon : <RiDashboardFill />}
                                </span>
                                <span 
                                    className={`text-base font-medium flex-1 
                                    duration-200 ${
                                        !open && "hidden"
                                    }`}>{menu.title}
                                </span>
                            </li>
                        ) : (
                        <Link href={menu.href ?? "#"}>
                            <li
                            className={`text-gray-300 text-sm flex
                            items-center gap-x-4 cursor-pointer p-2 ${props.pagetype===menu.title && "bg-white/10"}
                            hover:bg-white/10 rounded-md ${menu.spacing ? "mt-9" : "mt-2"}`}>
                                <span className="text-2xl block float-left">
                                    {menu.icon ? menu.icon : <RiDashboardFill />}
                                </span>
                                <span 
                                    className={`text-base font-medium flex-1 
                                    duration-200 ${
                                        !open && "hidden"
                                    }`}>{menu.title}
                                </span>
                                {menu.submenu && (
                                    <BsChevronDown className={`${submenuOpen &&
                                    "rotate-180"} duration-300`} onClick={() => 
                                    setSubmenuOpen(!submenuOpen)} />
                                )}
                            </li>
                            {menu.submenu && submenuOpen && open && (
                                <ul>
                                    {menu.submenuItems.map((submenuItem, index) =>(
                                        <div  key={index}>
                                            <Link href={submenuItem.href ?? "#"}>
                                            <li className="text-gray-300
                                            text-sm flex items-center gap-x-4 
                                            cursor-pointer p-2 px-5 hover:bg-white/10 
                                            rounded-md">
                                                {submenuItem.title}
                                            </li>
                                            </Link>
                                        </div>
                                    ))}
                                </ul>
                            )}
                        </Link>)}
                    </div>
                ))}
            </ul>

        </div>
    )
}

export default SidebarAdmin;