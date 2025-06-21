"use client";
import React, {useRef, useEffect, useState} from "react";
import {  useDispatch } from 'react-redux';
import { useAppSelector, useAppDispatch } from 'app/redux-store/hooks';
import { Container, Row, Col, Accordion, Tabs, Tab, FloatingLabel, Form, InputGroup } from 'react-bootstrap';
import { Col_6FloatInput, GenericDropdown, getCookie, MaxDropdown, PhonePrefixSelect, V_btn } from "../venca_lib/venca_lib";
import { ZakazniciPageType } from "../app_types/global_types";
import { patri_pod_data,  pozice_data, z_type } from "../shortcuts/shortcuts";
import { redirect } from "next/navigation";
import axios from "axios";

export const ZakazniciPage = ({predvolby, staty} : ZakazniciPageType) => {
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
            <Pridat_zakaznika predvolby={predvolby} staty={staty}/>
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

const Pridat_zakaznika = ({predvolby, staty} : ZakazniciPageType) => {
  const [name, setName] = useState("");
  const [surName, setSurName] = useState ("");
  const [mail, setMail] = useState("");
  const [secondMail, setSecondMail] = useState("");
  const [phone, setPhone] = useState("");
  const [secondPhone, setSecondPhone] = useState("");
  const [prefix, setPrefix] = useState("+420");
  const [secondPrefix, setSecondPrefix] = useState("+420");
  const [city, setCity] = useState("");
  const [adress, setAdress] = useState("");
  const [stateVal, setStateVal] = useState("10");
  const [owner, setOwner] = useState("");
  const [web, setWeb] = useState("");
  const [obcanstviVal, setObcanstviVal] = useState("10");
  const [psc, setPsc] = useState("");
  const [accType, setAccType] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUsername] = useState("");
  const [zamestnanec, setZamestnanec] = useState(false);
  const [pozice, setPozice] = useState("");
  const [patriPod, setPatriPod] = useState("");
  const [successVal, setSuccessVal] = useState(false);
  const [waitingVal, setWaitingVal] = useState(false); 

  const handleStateChange = (value: string | null) => {
    if (value !== null) {
      setStateVal(value);
    }
  };

  const handleObcanstviVal = (value: string | null) => {
    if (value !== null) {
      setObcanstviVal(value);
    }
  };

  const generatePassword = () => {
    const length = Math.floor(Math.random() * 4) + 7; 
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let password = upper[Math.floor(Math.random() * upper.length)];
    for (let i = 1; i < length; i++) {
      const allChars = chars + upper;
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    const passwordSetup = password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
      setPassword(passwordSetup);
  }

  const handlePhoneChange = (value: string | null) => {
    if (value !== null) {
      setPrefix(value);
    }
  };

  const handleSecondPhonePref = (value: string | null) => {
    if (value !== null) {
      setSecondPrefix(value);
    }
  };

  const ulozZakaznika = async () => {
    //zde bude kolekce dat odesílaných axiosem na api
    setWaitingVal(true);
    setSuccessVal(true);

    const zak_id = getCookie("zak_id");
    if (!zak_id) redirect("/");

    
    try {
      const response = await axios.post("api/account_router", {
        action: "ulozZakaznika",
        v_created: true,
        jmeno: name,
        surename: surName,
        userName: userName,
        mail: mail,
        secondMail: secondMail,
        prefix: prefix,
        phone: phone,
        secondPrefix: secondPrefix,
        secondPhone: secondPhone,
        city: city,
        adress: adress, 
        owner: owner,
        web: web,
        obcanstviVal: obcanstviVal,
        psc: psc,
        accType: accType,
        password: password,
        pozice: pozice,
        patri_pod: patriPod,
      });

      const data = response.data;

      if (data.succes) {
        setSuccessVal(true);
        setWaitingVal(false);
      }
    } catch {
      setSuccessVal(false);
    }
  }

  const accTypeOptions = z_type.map(({id, typ}) => ({id, label: typ}));
  const patriPodOptions = patri_pod_data.map(({id, typ}) => ({id, label: typ}));
  const poziceOptions = pozice_data.map(({id, typ}) => ({id, label: typ}));
  return (
    <Row className="g-0">
      <Col xs="12">
        <h1 className="display-3 text-center">Přidání zákazníka Admin</h1>
      </Col>
      <Col xs="12">
        <strong>Základní údaje</strong>
      </Col>
      <Col_6FloatInput className="pb-3 mt-2" firstId="name" firstLabel="Jméno zákaznika" firstType="text" 
        firstValue={name} firstSetter={setName} secondId="prijmeni" secondType="text"
        secondLabel="Příjmení zákazníka" secondSetter={setSurName} secondValue={surName}
      />
      <Col xs="12" md="6" className="pb-3 pe-3">
        <FloatingLabel controlId="user-name" label="UserName">
          <Form.Control value={userName} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="UserName" />
        </FloatingLabel>
      </Col>
      <Col xs="12" md="6" className="pb-3">
        <InputGroup>
          <FloatingLabel controlId="pass" label="Heslo">
            <Form.Control
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="text"
              placeholder="Heslo"
            />
          </FloatingLabel>
          <InputGroup.Text onClick={generatePassword} className="cursor-pointer right-group">
            <i className="bi bi-pencil-square fs-3 text-purple "></i>
          </InputGroup.Text>
        </InputGroup>
      </Col>
      <Col xs="12" className="pb-2">
        <strong>Kontaktní informace</strong>
      </Col>
      <Col_6FloatInput className="pb-3" firstId="prvni-mail" firstLabel="První e-mail" firstType="text"
        firstSetter={setMail} firstValue={mail} secondId="druhý-mail" secondLabel="Druhý e-mail" secondType="text"
        secondSetter={setSecondMail} secondValue={secondMail}/>
      <Col xs="12" lg="6" className="pb-3 pe-3">
        <div className="input-group">
          <PhonePrefixSelect value={prefix} onChange={handlePhoneChange} predvolby={predvolby}/>
          <FloatingLabel controlId="prvni-tel" label="První telefon" className="flex-grow-1">
            <Form.Control type="tel" placeholder="První telefon" className="rounded-start-0" onChange={(e) => setPhone(e.target.value)}value={phone}/>
          </FloatingLabel>
        </div>
      </Col>
      <Col xs="12" lg="6" className="pb-3">
        <div className="input-group">
          <PhonePrefixSelect value={secondPrefix} onChange={handleSecondPhonePref} predvolby={predvolby}/>
          <FloatingLabel controlId="prvni-tel" label="První telefon" className="flex-grow-1">
            <Form.Control type="tel" placeholder="První telefon" className="rounded-start-0" onChange={(e) => setSecondPhone(e.target.value)}value={secondPhone}/>
          </FloatingLabel>
        </div>
      </Col>
      <Col xs="12" lg="6" className="pb-3 pe-3">
        <GenericDropdown value={accType} options={accTypeOptions}  placeholder="Typ účtu"
          onChange={(val) => {
            if (val) setAccType(val);
          }}
        /> 
      </Col>
      <Col xs="12" lg="6" className="pb-3">
          <FloatingLabel controlId="owner name" label="Majitel">
            <Form.Control type="text" placeholder="Majitel"  onChange={(e) => setOwner(e.target.value)}value={owner}/>
          </FloatingLabel>
      </Col>
      <Col xs="12" className="pb-2">
          <strong>Adresní informace</strong>
      </Col>
      <Col_6FloatInput firstId="mesto" firstLabel="Město" firstSetter={setCity} firstType="text"
        firstValue={city} secondId="adresa" secondLabel="Ulice" secondSetter={setAdress} secondType="text"
        className="pb-3" secondValue={adress}
      />
      <Col_6FloatInput className="pb-3" firstId="psc" firstLabel="Psč" firstSetter={setPsc}
        firstType="text" firstValue={psc} secondId="web" secondLabel="Web zákazníka" secondSetter={setWeb}
        secondType="text" secondValue={web} 
      /> 
      <Col xs="12" lg="6" className="pb-3 pe-3">
        <MaxDropdown value={stateVal} onChange={handleStateChange} staty={staty} target="stat"/>
      </Col>
      <Col xs="12" lg="6" className="pb-3">
        <MaxDropdown value={obcanstviVal} onChange={handleObcanstviVal} staty={staty} target="obcanstvi"/>
      </Col>
      <Col xs="12" className="pb-3">
        <Form.Check 
          type="checkbox"
          id="je-zamestnanec"
          label="Je zaměstnanec"
          checked={zamestnanec}
          onChange={(e) => setZamestnanec(e.target.checked)}
        />
      </Col>
      {zamestnanec && (
        <>
          <Col xs="12" lg="6" className="pb-3 pe-3">
          <GenericDropdown value={patriPod} options={patriPodOptions}  placeholder="Patří pod"
            onChange={(val) => {
              if (val) setPatriPod(val);
            }}
          /> 
        </Col>
        <Col xs="12" lg="6" className="pb-3">
          <GenericDropdown value={pozice} options={poziceOptions}  placeholder="Pozice zaměstnance"
            onChange={(val) => {
              if (val) setPozice(val);
            }}
          /> 
        </Col>
      </>
      )}
       <V_btn constHandler={ulozZakaznika} waitingVal={waitingVal} successVal={successVal} text="Ulož zákazníka" />
    </Row>
  );
}