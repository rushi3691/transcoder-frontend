"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ListVideo, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { canUpload } from "@/lib/access";

const routes = [
    { name: "Home", path: "/", icon: Home },
    { name: "My videos", path: "/my-videos", icon: ListVideo, auth_required: true },
    { name: "Upload", path: "/upload-video", icon: Upload, auth_required: true },
];

/**
 * Collapsed: 72px icon rail with labels under the icons.
 * Expanded (lg+ only, toggled from the top bar): 240px guide with labels beside the icons.
 */
export default function SideNav({ expanded }: { expanded: boolean }) {
    return (
        <nav
            className={cn(
                "fixed bottom-0 left-0 top-14 z-40 flex w-[72px] flex-col gap-1 overflow-y-auto bg-background px-1 py-1",
                expanded && "lg:w-60 lg:px-3"
            )}
        >
            {/* the pathname is only known per request; prerender the links unhighlighted */}
            <Suspense fallback={<NavLinks activePath={null} expanded={expanded} />}>
                <ActiveNavLinks expanded={expanded} />
            </Suspense>
        </nav>
    );
}

function ActiveNavLinks({ expanded }: { expanded: boolean }) {
    return <NavLinks activePath={usePathname()} expanded={expanded} />;
}

function NavLinks({ activePath, expanded }: { activePath: string | null; expanded: boolean }) {
    const { status, data } = useSession();
    const isUploader = status === "authenticated" && canUpload(data?.user?.email);

    return (
        <>
            {routes.map((route) => {
                if (route.auth_required && !isUploader) return null;
                const active = activePath === route.path;
                const Icon = route.icon;
                return (
                    <Link
                        href={route.path}
                        key={route.path}
                        className={cn(
                            "flex flex-col items-center gap-1.5 rounded-lg py-4 text-[10px] hover:bg-muted",
                            expanded && "lg:flex-row lg:gap-6 lg:px-3 lg:py-2.5 lg:text-sm",
                            active && "font-medium",
                            active && expanded && "lg:bg-muted"
                        )}
                    >
                        <Icon className="h-6 w-6 shrink-0" strokeWidth={active ? 2.5 : 1.75} />
                        {route.name}
                    </Link>
                );
            })}
        </>
    );
}
