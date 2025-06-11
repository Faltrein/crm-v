"use client"
import React from "react";
import { AccountLeaveType, CrmBodyClientTypes } from "../app_types/global_types";
import Image from "react-bootstrap/Image";
import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Col_6 } from "../venca_lib/venca_lib";
import Link from "next/link";
import { useAppSelector } from "../redux-store/hooks";


export const Account_client = ({crm_data} : CrmBodyClientTypes) => {
        const isSubnavOpen = useAppSelector(state => state.account.isSubnavOpen);
    return(
        <Container fluid className={isSubnavOpen ? "margin-pro-redux" : ""}>
            <Row className="g-0">
                <Col xs="12" xl="8">
                    <h1 className="display-1">Account CRM-V uživatele {crm_data?.z_name} {crm_data?.z_surename}</h1>
                </Col>
                <Col xs="12" xl="4">
                    <Profile_card crm_data={crm_data}/>
                </Col>
            </Row>
        </Container>
    );
}

const Profile_card = ({crm_data} : CrmBodyClientTypes) => {
    return (
        <Row className="g-0 rounded-10 border border-dark p-3 text-6 me-3 mt-2">
            <Col xs="12" className="border-bottom border-secondary pb-3 d-flex justify-content-center">
                <Image src="basic-profile.jpg" className=" profile-pic" alt="profilový obrázek"/>
            </Col>
            <Col xs="12" className="py-2 border-bottom border-secondary">
                <h2 className="display-3 text-center">Uživatel</h2>
            </Col>
            <Col_6 className="py-3 border-bottom border-secondary" text_1={`Jméno: ${crm_data?.z_name}`} text_2={`Příjmení: ${crm_data?.z_name}`}/>
            <Col_6 className={`${crm_data?.z_mail_2 ? "pt-3" : "py-3 border-bottom border-secondary"}`} text_1="první email:" text_2={crm_data?.z_mail}/>
            {crm_data?.z_mail_2 && (
                <>
                <Col_6 className="pb-3 border-bottom border-secondary" text_1="Druhý email:" text_2={crm_data?.z_mail_2}/>
                </>
            )}

            {crm_data?.z_phone && (
                <>
                    <Col_6 className={`${crm_data?.z_phone_2 ? "pt-3" : "py-3 border-bottom border-secondary"}`} text_1="První číslo:" text_2={crm_data?.z_phone}/>
                </>
            )}
            
            {crm_data?.z_phone_2 && (
                <>
                    <Col_6 className="pb-3 border-bottom border-secondary" text_1="Druhé číslo:" text_2={crm_data.z_phone_2}/>
                </>
            )}

            {(crm_data?.z_city || crm_data?.z_adress || crm_data?.z_state) && (
                <Col xs="12" className="pt-2">
                    <h2 className="display-3 text-center">Adresní údaje</h2>
                </Col>
            )}
            {crm_data?.z_city && (
                <>
                    <Col_6 text_1="Město:" text_2={crm_data.z_city}/>
                </>
            )}

            {crm_data?.z_adress && (
                <>
                    <Col_6 text_1="Adresa:" text_2={crm_data.z_adress}/>
                </>
            )}
            
            {crm_data?.z_psc && (
                <>
                    <Col_6 text_1="Psč:" text_2={crm_data.z_psc}/>
                </>
            )}

            {crm_data?.z_state && (
               <>
                    <Col_6 text_1="Stát:" text_2={crm_data.z_state}/>
                </> 
            )}

            {crm_data?.z_obcanstvi &&(
                <>
                    <Col_6 className="pb-3 border-bottom border-secondary" text_1="Občanství:" text_2={crm_data.z_obcanstvi}/>
                </> 
            )}

            <Col px="12" className="pt-3 d-flex align-items-center justify-content-center">
                <Account_leave acc_type="firma"/>
            </Col>
        </Row>
    )
}

const Account_leave = ({acc_type} : AccountLeaveType ) => {
    
    switch(acc_type) {
        case acc_type = "firma":
            return (
              <Link className="v-btn" href="/zakaznici" title="přesměrovat na zaměstnance">Zaměstnanci</Link> 
            );
    }
}