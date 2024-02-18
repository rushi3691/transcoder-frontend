import { useSession, signIn, signOut } from 'next-auth/react'

export default function Topbar() {
    const { data: session, status } = useSession()
    console.log(session)
    const handleSignIn = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        signIn('google');
    }
    return (
        <div className="h-16 w-full sticky top-0 z-50 flex justify-end items-center px-4 gap-4 bg-background">

            {/* {status === "unauthenticated"
             ? (
                <>
                    <button onClick={handleSignIn}>signIn</button>
                </>
            ) : (
                <>
                    <button onClick={() => signOut()}>signOut</button>
                </>
            )} */}

            {/* status can be 'unauthenticated', 'loading' or 'authenticated' */}
            {status === "unauthenticated" && (
                <button onClick={handleSignIn}>Sign in</button>
            )}
            {status === "loading" && (
                <div>Loading...</div>
            )}
            {status === "authenticated" && (
                <>
                    <button onClick={() => signOut()}>Sign out</button>
                    <div>{session?.user?.name}</div>
                </>
            )}


        </div>

    )
}