import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loggedZak } from "../api/crm_body_search/crm_body_search";
import { Account_client } from "./account_client";

const Account = async () => {
    const cookieStore = await cookies();
    const zak_id = cookieStore.get("zak_id");

    if(!zak_id) {
        redirect("/");
    }

    const user_data = await loggedZak(zak_id.value)
    return (
        <section className="p-3 container-fluid" id="account">
            <Account_client crm_data={user_data} />
        </section>
    );
}

export default Account;