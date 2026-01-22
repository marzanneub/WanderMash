"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

export default function useQueryToast() {
    const searchParams = useSearchParams();

    useEffect(() => {
        const message  = searchParams.get("message");
        let successmessage  = searchParams.get("successmessage");
        const warnmessage  = searchParams.get("warnmessage");
        const errormessage  = searchParams.get("errormessage");
        if(message) successmessage = message;

        if (successmessage) toast.success(successmessage, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
        if (warnmessage) toast.warn(warnmessage, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
        if (errormessage) toast.error(errormessage, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    }, [searchParams]);

    return null;
}
