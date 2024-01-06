import { useSession, signIn, signOut } from 'next-auth/react'

export default function Navbar() {
    const { data: session, status } = useSession()
    console.log(session)
    const handleSignIn = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        signIn('google');
    }
    return (
        <div className="h-16 w-full sticky top-0 z-50 flex justify-end items-center px-4 gap-4 shadow-md
        bg-background
        ">

            {!session ? (
                <>
                    <button onClick={handleSignIn}>signIn</button>
                </>
            ) : (
                <>
                    <button onClick={() => signOut()}>signOut</button>
                </>
            )}
        </div>

    )
}