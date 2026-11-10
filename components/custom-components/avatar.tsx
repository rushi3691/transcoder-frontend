import Image from "next/image";

/** Round profile picture, or the first letter of the name when there is no picture. */
export default function Avatar({
    name,
    image,
    size = 36,
}: {
    name?: string | null;
    image?: string | null;
    size?: number;
}) {
    if (image) {
        return (
            <Image
                src={image}
                alt={name ?? "avatar"}
                width={size}
                height={size}
                // tiny Google profile images; skip the optimizer so no extra image domain config is needed
                unoptimized
                referrerPolicy="no-referrer"
                // inline size: Tailwind's img { height: auto } plus flex stretch would distort it
                style={{ width: size, height: size }}
                className="shrink-0 rounded-full object-cover"
            />
        );
    }
    return (
        <div
            style={{ width: size, height: size }}
            className="flex shrink-0 items-center justify-center rounded-full bg-purple-700 text-sm font-medium text-white"
        >
            {(name || "?").charAt(0).toUpperCase()}
        </div>
    );
}
