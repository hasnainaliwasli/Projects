"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { loadUser } from "@/lib/slices/authSlice";

export function AuthLoader() {
    const dispatch = useAppDispatch();
    const loadedRef = useRef(false);

    useEffect(() => {
        if (!loadedRef.current) {
            loadedRef.current = true;
            dispatch(loadUser());
        }
    }, [dispatch]);

    return null;
}
