import React from "react";
import { Crm_body_client } from "./crm_body_client";
import { ZakanikId } from "@/app/app_types/global_types";
import { loggedZak } from "@/app/api/crm_body_search/crm_body_search";
import { redirect } from "next/navigation";


export const Crm_body = async ({zak_id} : ZakanikId) => {
    if (!zak_id) {
        redirect("/");
    }
    const crm_data = await loggedZak(zak_id.value);
    return (
        <section id="crm-body">
            <Crm_body_client crm_data={crm_data}/>
        </section>
    )
}