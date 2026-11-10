"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Clapperboard, LogOut, Menu, Plus, UserCircle2 } from "lucide-react";
import Avatar from "./avatar";
import { canUpload } from "@/lib/access";

export default function Topbar({ onToggleGuide }: { onToggleGuide: () => void }) {
    const { data: session, status } = useSession();

    return (
        <header className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between bg-background pl-4 pr-4 sm:pr-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={onToggleGuide}
                    aria-label="Toggle sidebar"
                    // the expanded guide only exists from lg up
                    className="hidden h-10 w-10 items-center justify-center rounded-full hover:bg-muted lg:flex"
                >
                    <Menu className="h-6 w-6" strokeWidth={1.75} />
                </button>
                <Link href="/" className="flex items-center gap-1.5" aria-label="StreamCraft home">
                    <Clapperboard className="h-7 w-7 text-red-600" strokeWidth={2.25} />
                    <span className="text-xl font-semibold tracking-tighter">StreamCraft</span>
                </Link>
            </div>

            <div className="flex items-center gap-3">
                {/* status can be 'unauthenticated', 'loading' or 'authenticated' */}
                {status === "unauthenticated" && (
                    <button
                        onClick={() => signIn("google")}
                        className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm font-medium text-sky-400 hover:bg-sky-400/10"
                    >
                        <UserCircle2 className="h-6 w-6" strokeWidth={1.5} />
                        Sign in
                    </button>
                )}
                {status === "loading" && <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />}
                {status === "authenticated" && (
                    <>
                        {canUpload(session?.user?.email) && (
                            <Link
                                href="/upload-video"
                                className="flex h-9 items-center gap-1.5 rounded-full bg-muted px-3 text-sm font-medium hover:bg-accent sm:pr-4"
                            >
                                <Plus className="h-6 w-6" strokeWidth={1.75} />
                                <span className="hidden sm:inline">Create</span>
                            </Link>
                        )}
                        {/* native <details> as the account menu: no extra JS or dependency */}
                        <details className="relative">
                            <summary className="flex cursor-pointer list-none items-center rounded-full [&::-webkit-details-marker]:hidden">
                                <Avatar name={session?.user?.name} image={session?.user?.image} size={32} />
                            </summary>
                            <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl bg-popover py-2 shadow-xl ring-1 ring-border">
                                <div className="flex gap-3 border-b border-border px-4 pb-3 pt-1">
                                    <Avatar name={session?.user?.name} image={session?.user?.image} size={40} />
                                    <div className="min-w-0">
                                        <p className="truncate font-medium">{session?.user?.name}</p>
                                        <p className="truncate text-sm text-muted-foreground">{session?.user?.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => signOut()}
                                    className="mt-2 flex w-full items-center gap-4 px-4 py-2 text-sm hover:bg-muted"
                                >
                                    <LogOut className="h-5 w-5" strokeWidth={1.75} />
                                    Sign out
                                </button>
                            </div>
                        </details>
                    </>
                )}
            </div>
        </header>
    );
}
