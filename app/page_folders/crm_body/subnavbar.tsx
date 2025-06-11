import React from "react";
import { SubNawbar_client } from "./subnavbar_client";
import { SubNavClassType } from "@/app/app_types/global_types";
const SubNavbar = ({className} : SubNavClassType) => {
    return (
        <section id="subnavbar" className={className}>
            <SubNawbar_client></SubNawbar_client>
        </section>
    );
}

export default SubNavbar;