import React from "react";
import { ZakazniciPage } from "./zakaznici_client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getPredvolby, getStaty } from "../api/crm_body_search/crm_acount";
const Crm_zakaznici = async () => {
    const cookieStore = await cookies();

    const zak_id = cookieStore.get("zak_id");
    if(!zak_id) {
        redirect("/");
    }

    const staty = await getStaty();
    const predvolby = await getPredvolby();
    return (
        <section id="zakaznici" className="p-3">
                <ZakazniciPage predvolby={predvolby} staty={staty}/>
        </section>
    )
} 

export default Crm_zakaznici;