"use client"
import {Temp_cleaner } from "@/app/venca_lib/venca_lib";
import React from "react";
import { CrmBodyClientTypes } from "@/app/app_types/global_types";
import { Image } from "react-bootstrap";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Crm_link } from "./crm_links";

export const Crm_body_client = ({crm_data} : CrmBodyClientTypes) => {
    return (
    <Navbar expand="xl" className="nav-border vh-100 d-xl-block d-xl-flex align-items-start justify-content-start">
        <Container fluid className="p-0">
            <Navbar.Brand className="d-flex d-xl-none display-3 p-3 align-items-center" href="/account">
                <Image src="basic-profile.jpg" className="ms-3 profile-pic" alt="profilový obrázek"/>
                CRM-V {crm_data?.z_name} {crm_data?.z_surename}</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="flex-row flex-xl-column w-100">
                    <Navbar.Brand className="d-none d-xl-flex display-3 mb-4 p-3 align-items-center justify-content-center ms-3" href="/account">
                        CRM-V {crm_data?.z_name} {crm_data?.z_surename}
                        <Image src="basic-profile.jpg" className="ms-3 profile-pic" alt="profilový obrázek"/>
                    </Navbar.Brand>
                    <Crm_link z_type={crm_data?.z_type ?? "login"}/>
                    <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                    
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