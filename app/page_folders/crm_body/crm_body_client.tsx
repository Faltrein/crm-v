"use client"
import { Temp_cleaner } from "@/app/venca_lib/venca_lib";
import React from "react";
import Link from "next/link";
export const Crm_body_client = () => {
    return (
        <>
            <Temp_cleaner />
            <Link href="/zakaznici" title="zakaznici">Zákaznící</Link>        
        </>
    )
}