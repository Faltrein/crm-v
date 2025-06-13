"use client";
import React, {useRef, useEffect, useState} from "react";
import {  useDispatch } from 'react-redux';
import { setSubnavOpen } from '../redux-store/accountSlice';
import { useAppSelector, useAppDispatch } from 'app/redux-store/hooks';
import { Container, Row, Col, Accordion, Tabs, Tab } from 'react-bootstrap';
import { Col_6FloatInput } from "../venca_lib/venca_lib";


export const ZakazniciPage = () => {
  const isSubnavOpen = useAppSelector(state => state.account.isSubnavOpen);
  /*const activeKey = useAppSelector(state => state.accordion.activeKey);
  const dispatch = useAppDispatch();

  const diffAcc = useAppSelector(state => state.accordion.difKeyTest);
  const difAccordionRef = useRef<HTMLDivElement>(null);
  const toggle = () => {
    dispatch(toggleAccordion());
  };

   useEffect(() => {
    if (diffAcc === "0" && difAccordionRef.current) {
      difAccordionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [diffAcc]);*/

  return (
  <Container fluid className={isSubnavOpen ? "margin-pro-redux" : ""}>
    <Row className="g-0">
      <Col xs="9" className="pe-3">
        <Tabs defaultActiveKey="zak-add" id="zakaznici-tab" className="mb-3">
          <Tab eventKey="zak-add" title="Přidat zákazníka">
            <Pridat_zakaznika/>
          </Tab>
          <Tab eventKey="zak-edit" title="Editovat zákazníka">
            <p>Toto je obsah záložky Profil.</p>
          </Tab>
          <Tab eventKey="zak-podrizeni" title="Přidat zaměstnance">
            <p>Toto je obsah záložky Kontakt.</p>
          </Tab>
          <Tab eventKey="zak-del" title="Smazat zákazníka">
            <p>Toto je obsah záložky Kontakt.</p>
          </Tab>
        </Tabs>
      </Col>
      <Col xs="3">
        zde bude tabulka aktivních zákazníků
      </Col>
    </Row>
  </Container>
  );
};

const Pridat_zakaznika = () => {
  const [name, setName] = useState("");
  const [surName, setSurName] = useState ("");

  return (
    <Row className="g-0">
      <Col xs="12">
        <h1 className="display-3 text-center">Přidání zákazníka Admin</h1>
      </Col>
      <Col xs="12">
        <strong>Jméno příjmení</strong>
      </Col>
      <Col_6FloatInput className="pb-3 mt-2" firstId="name" firstLabel="Jméno zákaznika" firstType="text" 
        firstValue={name} firstSetter={setName} secondId="prijmeni" secondType="text"
        secondLabel="Příjmení zákazníka" secondSetter={setSurName} secondValue={surName}
      />
      <Col xs="12" className="pb-3">
        <strong>Adresní informace</strong>
      </Col>

    </Row>
  );
}