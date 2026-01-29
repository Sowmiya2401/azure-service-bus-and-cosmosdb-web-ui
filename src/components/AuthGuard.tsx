"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            console.log("AuthGuard: Unauthenticated, redirecting to /login");
            // Force a hard navigation to ensure we clear any state
            window.location.href = "/login";
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-400">Checking session...</span>
            </div>
        );
    }

    if (status === "unauthenticated") {
        return null; // Will redirect via useEffect
    }

    return <>{children}</>;
}
