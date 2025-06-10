"use client"
import React from "react";
import { CrmLinksType } from "@/app/app_types/global_types";
import { ActiveLink } from "@/app/venca_lib/venca_lib";

export const Crm_link = ({z_type} : CrmLinksType) => {

    switch(z_type) {
        case z_type = "admin":
            return (
                <>
                    <ActiveLink href="/home">Domovská stránka</ActiveLink>
                    <ActiveLink href="/zakaznici">Zákazníci</ActiveLink>
                    <ActiveLink href="/firma">Moje firma</ActiveLink>
                    <ActiveLink href="/dane">Daně</ActiveLink>
                    <ActiveLink href="/to-do">To do list</ActiveLink>
                    <ActiveLink href="/zamestnanci">Zaměstnanci</ActiveLink>
                </>
            );
        case z_type = "2":
            return (
                <>
                    <ActiveLink href="/home">Domovská stránka</ActiveLink>
                </>
            );
        case z_type = "login":
            return (
                <>
                    <ActiveLink href="/">Domovská stránka</ActiveLink>
                </>
            );
        
            
    }
}