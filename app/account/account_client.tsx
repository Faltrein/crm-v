"use client"
import React from "react";
import { AccountLeaveType, CrmBodyClientTypes } from "../app_types/global_types";
import { Accordion, Image, Container,Row, Col, FloatingLabel, Form } from "react-bootstrap";
import { Col_6 } from "../venca_lib/venca_lib";
import Link from "next/link";
import { useAppSelector } from "../redux-store/hooks";
import { useDispatch } from "react-redux";
import { toggleAdresa, toggleHesla, toggleKontakt } from "../redux-store/accountSlice";

export const AccountSubnavClient = () => {
    const dispatch = useDispatch()

    const handleHesla = () => {
        dispatch(toggleHesla());
    }

    const handleAdresa = () => {
        dispatch(toggleAdresa());
    }

    const handleKontakt = () => {
        dispatch(toggleKontakt());
    }

    const activeHesla = useAppSelector(state => state.account.hesla);
    const activeKontakt = useAppSelector(state => state.account.kontakt);
    const activeAdresa = useAppSelector(state => state.account.adresa);

    return (
        <div className="d-flex align-items-center justify-content-start">
            <button type="button" className={`text-dark me-4 ${activeHesla ? 'text-shadow' : ''}`} onClick={handleHesla}>Hesla</button>
            <button type="button" className={`text-dark me-4 ${activeKontakt ? 'text-shadow' : ''}`} onClick={handleKontakt}>Kontakt</button>
            <button type="button" className={`text-dark ${activeAdresa ? 'text-shadow' : ''}`} onClick={handleAdresa}>Adresa</button>
        </div>
    );
}

export const Account_client = ({crm_data} : CrmBodyClientTypes) => {
    //toto načítá server zde propojujeme react componenty
    const isSubnavOpen = useAppSelector(state => state.account.isSubnavOpen);
    const activeHesla = useAppSelector(state => state.account.hesla);
    const activeKontakt = useAppSelector(state => state.account.kontakt);
    const activeAdresa = useAppSelector(state => state.account.adresa);

    return(
        <Container fluid className={isSubnavOpen ? "margin-pro-redux" : ""}>
            <Row className="g-0">
                <Col xs="12" xl="8">
                    <h1 className="display-1">Account CRM-V uživatele {crm_data?.z_name} {crm_data?.z_surename}</h1>
                    <Hesla crm_data={crm_data} activeKey={activeHesla}/>
                    <Kontakty crm_data={crm_data} activeKey={activeKontakt}/>
                    <Adresa_client crm_data={crm_data} activeKey={activeAdresa}/>
                </Col>
                <Col xs="12" xl="4">
                    <Profile_card crm_data={crm_data}/>
                </Col>
            </Row>
        </Container>
    );
}

const Hesla = ({crm_data, activeKey} : CrmBodyClientTypes) => {
    const dispatch = useDispatch();

    const toggleHeslaAcc = () => {
        dispatch(toggleHesla());
    }
    return (
        <Row className="pe-4">
            <Col xs="12">
                <Accordion activeKey={activeKey}>
                    <Accordion.Item eventKey="0" >
                        <Accordion.Header onClick={toggleHeslaAcc}>Heslo</Accordion.Header>
                        <Accordion.Body>
                            <Row xs="12">
                                <Col xs="12">
                                     <FloatingLabel controlId="heslo-puvodni" label="Původní heslo">
                                        <Form.Control type="password" placeholder="Původní heslo" />
                                    </FloatingLabel>
                                </Col>
                                <Col xs="12" lg="6" className="mt-3">
                                    <FloatingLabel controlId="nove-heslo" label="Nové heslo">
                                        <Form.Control type="password" placeholder="Nové heslo" />
                                    </FloatingLabel>
                                </Col>
                                <Col xs="12" lg="6" className="mt-3">
                                    <FloatingLabel controlId="nove-heslo-kontrola" label="Nové heslo">
                                        <Form.Control type="password" placeholder="Nové heslo" />
                                    </FloatingLabel>
                                </Col>
                            </Row>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Col>
        </Row>
    );
}

const Kontakty = ({crm_data, activeKey} : CrmBodyClientTypes) => {
    const dispatch = useDispatch();

    const toggleKontaktAcc = () => {
        dispatch(toggleKontakt());
    }
    return (
        <Row className="pe-4 mt-3">
            <Col xs="12">
                <Accordion activeKey={activeKey}>
                    <Accordion.Item eventKey="0" >
                        <Accordion.Header onClick={toggleKontaktAcc}>Kontaktní informace</Accordion.Header>
                        <Accordion.Body>
                            <Row xs="12">
                                <Col xs="12" lg="6">
                                     <FloatingLabel controlId="prvni-email" label="První e-mail">
                                        <Form.Control type="email" placeholder="První email" />
                                    </FloatingLabel>
                                </Col>
                                <Col xs="12" lg="6">
                                     <FloatingLabel controlId="druhy-email" label="Druhý e-mail">
                                        <Form.Control type="email" placeholder="Druhý e-mail" />
                                    </FloatingLabel>
                                </Col>
                                <Col xs="12" lg="6" className="mt-3">
                                    <FloatingLabel controlId="prvni-tel" label="První telefon">
                                        <Form.Control type="text" placeholder="První telefon" />
                                    </FloatingLabel>
                                </Col>
                                <Col xs="12" lg="6" className="mt-3">
                                    <FloatingLabel controlId="druhy-tel" label="Druhý telefon">
                                        <Form.Control type="text" placeholder="Druhý telefon" />
                                    </FloatingLabel>
                                </Col>
                            </Row>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Col>
        </Row>
    );
}

const Adresa_client = ({crm_data, activeKey} : CrmBodyClientTypes) => {

    const dispatch = useDispatch();

    const toggleAdresaAcc = () => {
        dispatch(toggleKontakt());
    }
    return(
        <Row className="pe-4 mt-3">
            <Col xs="12">
                <Accordion activeKey={activeKey}>
                    <Accordion.Item eventKey="0" >
                        <Accordion.Header onClick={toggleAdresaAcc}>Adresní informace</Accordion.Header>
                        <Accordion.Body>
                            <Row xs="12">
                                <Col xs="12" lg="6">
                                     <FloatingLabel controlId="mesto" label="Trvalé bydliště">
                                        <Form.Control type="text" placeholder="Trvalé bydliště" />
                                    </FloatingLabel>
                                </Col>
                                <Col xs="12" lg="6">
                                     <FloatingLabel controlId="ulice" label="Ulice">
                                        <Form.Control type="text" placeholder="Ulice" />
                                    </FloatingLabel>
                                </Col>
                                <Col xs="12" lg="6" className="mt-3">
                                    <FloatingLabel controlId="psc" label="Psč">
                                        <Form.Control type="text" placeholder="Psč" />
                                    </FloatingLabel>
                                </Col>
                                <Col xs="12" lg="6" className="mt-3">
                                    <FloatingLabel controlId="stat" label="Stát">
                                        <Form.Select aria-label="Zvol stát">
                                        <option value="">Vyber stát</option>
                                        <option value="cz">Česká republika</option>
                                        <option value="sk">Slovensko</option>
                                        <option value="de">Německo</option>
                                        <option value="pl">Polsko</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                            </Row>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Col>
        </Row>
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