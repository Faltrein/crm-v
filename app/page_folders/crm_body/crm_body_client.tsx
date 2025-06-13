"use client"
import {deleteCookie, Temp_cleaner } from "@/app/venca_lib/venca_lib";
import React from "react";
import { CrmBodyClientTypes } from "@/app/app_types/global_types";
import { Image } from "react-bootstrap";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Crm_link } from "./crm_links";
import Link from "next/link";

export const Crm_body_client = ({crm_data} : CrmBodyClientTypes) => {

     const logout = () => {
        deleteCookie("zak_id");
        window.location.reload();
      };
    return (
    <Navbar expand="xl" className="nav-border vh-100 d-xl-block d-xl-flex align-items-start justify-content-start  w-100">
        <Container fluid className="p-0 ">
            
                <Navbar.Brand className="d-flex d-xl-none display-3 align-items-center">
                    <Link href="/account" title="Váš uživatelský účet" className="d-flex d-xl-none align-items-center text-dark">
                        <Image src={crm_data?.z_pic} className="ms-3 bg-dark profile-pic" alt="profilový obrázek"/>
                        CRM-V {crm_data?.z_name} {crm_data?.z_surename}
                    </Link>
                </Navbar.Brand>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="d-flex flex-xl-column v-bg w-100">
                    <Navbar.Brand className="d-none d-xl-flex display-3 mb-4 p-3 ms-3">
                        <Link href="/account" title="Váš uživatelský účet" className="d-none d-xl-flex align-items-center justify-content-center text-dark">
                            CRM-V {crm_data?.z_name} {crm_data?.z_surename}
                            <Image src={crm_data?.z_pic} className="ms-3 profile-pic" alt="profilový obrázek"/>
                        </Link>
                    </Navbar.Brand>
                    <Crm_link z_type={crm_data?.z_type ?? "login"}/>
                    <div className="w-90 border-bottom border-white pt-2"></div>
                    
                    <button className="text-white mt-3" onClick={() => logout()}>Odhlásit se</button>
                    <NavDropdown title="Dropdown text-white" id="basic-nav-dropdown">
                    
                    <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                    <Temp_cleaner/>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
    )
}