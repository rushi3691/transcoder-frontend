"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils";


const routes = [
    {
        name: "Home",
        path: "/",
        current: false,
    },
    {
        name: "My Videos",
        path: "/my-videos",
        current: false,
    },
    {
        name: "Upload Video",
        path: "/upload-video",
        current: false,
    },
]

export default function Sidebar() {
    const currentPath = usePathname()
    console.log(currentPath)

    return (
        <div className="border-gray-500 w-52 h-full flex flex-col items-center gap-1 fixed">
            {routes.map((route, index) => (
                <Link
                    href={route.path}
                    key={index}
                    className={cn(
                        "hover:bg-muted w-full flex justify-center text-center items-center h-12 cursor-pointer rounded-xl",
                        currentPath === route.path && "text-blue-500 bg-muted"
                    )}
                >
                    {route.name}
                </Link>
            ))}
        </div >
    )
}