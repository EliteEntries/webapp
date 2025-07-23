import { useRouter } from "next/router";
import { useEffect } from "react";

export default function FO4() {
    const router = useRouter()
    useEffect(() => {
        router.replace('/')
    })
    return null
}