"use client"
import React, {useState, useEffect} from "react";
import { AccountLeaveType, CrmBodyClientTypes } from "../app_types/global_types";
import { Accordion, Image, Container,Row, Col, FloatingLabel, Form} from "react-bootstrap";
import { Col_6, getCookie, MaxDropdown, PhonePrefixSelect } from "../venca_lib/venca_lib";
import Link from "next/link";
import { useAppSelector } from "../redux-store/hooks";
import { useDispatch } from "react-redux";
import { toggleAdresa, toggleHesla, toggleKontakt } from "../redux-store/accountSlice";
import axios from "axios";

export const AccountSubnavClient = () => {
    const dispatch = useDispatch();

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

export const Account_client = ({crm_data, predvolby, staty} : CrmBodyClientTypes) => {
    //toto načítá server zde propojujeme react componenty
    const [data, setData] = useState(crm_data);
    const isSubnavOpen = useAppSelector(state => state.account.isSubnavOpen);
    const activeHesla = useAppSelector(state => state.account.hesla);
    const activeKontakt = useAppSelector(state => state.account.kontakt);
    const activeAdresa = useAppSelector(state => state.account.adresa);

    return(
        <Container fluid className={isSubnavOpen ? "margin-pro-redux" : ""}>
            <Row className="g-0">
                <Col xs="12" xl="8">
                    <h1 className="display-1">Account CRM-V uživatele {crm_data?.z_name} {crm_data?.z_surename}</h1>
                    <Hesla crm_data={data} activeKey={activeHesla} />
                    <Kontakty crm_data={data} activeKey={activeKontakt} predvolby={predvolby} onUpdate={setData}/>
                    <Adresa_client crm_data={data} activeKey={activeAdresa} staty={staty} onUpdate={setData}/>
                </Col>
                <Col xs="12" xl="4">
                    <Profile_card crm_data={data}/>
                </Col>
            </Row>
        </Container>
    );
}

const Hesla = ({ activeKey} : CrmBodyClientTypes) => {
    const dispatch = useDispatch();

    const toggleHeslaAcc = () => {
        dispatch(toggleHesla());
    }

    const [passNoMatch, setPassNoMatch] = useState(false);
    const [isTooShort, setIsTooShort] = useState(false);
    const [noLetter, setNoLetter] = useState(false);
    const [newPass, setNewPass] = useState("");
    const [newPassControl, setNewPassControl] = useState("");
    const [actualPass, setActuallPass] = useState("");
    const [passControl, setPassControl] = useState(false);
    const [saved, setSaved] = useState(false);
    
    useEffect(() => {
        setIsTooShort(newPass.length < 6);
    
        setNoLetter(!/[A-Z]/.test(newPass) || newPass.length === 0);
    
        setPassNoMatch(newPass !== newPassControl);
    }, [newPass, newPassControl]);

   

    const zmenitHeslo = async () => {
        if (passNoMatch || noLetter || isTooShort) {
            return;
        }
        const zak_id = getCookie("zak_id");
        if (!zak_id) {
            return;
        }

        const res = await fetch("/api/account_router", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            action: "changePasswordAccount",
            zak_id,
            actualPass,
            newPass,
            }),
        });

        const data = await res.json();
        console.log('data', data);
        if (!data.valid) {
            setPassControl(true);
            setSaved(false);
        } else {
            setSaved(true);
            setPassControl(false);
        }
    };
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
                                        <Form.Control value={actualPass} onChange={e => setActuallPass(e.target.value)} type="password" placeholder="Původní heslo" />
                                    </FloatingLabel>
                                </Col>
                                <Col xs="12" lg="6" className="mt-3">
                                    <FloatingLabel controlId="nove-heslo" label="Nové heslo">
                                        <Form.Control value={newPassControl} onChange={e => setNewPassControl(e.target.value)} type="password" placeholder="Nové heslo" />
                                    </FloatingLabel>
                                </Col>
                                <Col xs="12" lg="6" className="mt-3">
                                    <FloatingLabel controlId="nove-heslo-kontrola" label="Nové heslo">
                                        <Form.Control value={newPass} onChange={e => setNewPass(e.target.value)} type="password" placeholder="Nové heslo" />
                                    </FloatingLabel>
                                </Col>
                                <Col xs="12" className="mt-3 ">
                                    {passControl && (
                                        <div className="text-center text-danger bold">Špatně zadané původní heslo</div>
                                    )}
                                    {isTooShort && (
                                        <div className="text-center text-danger">Heslo musí mít alespoň 6 znaků.</div>
                                    )}
                                    {noLetter && (
                                        <div className="text-center text-danger">Heslo musí obsahovat alespoň jedno velké písmeno.</div>
                                    )}
                                    {passNoMatch && (
                                        <div className="text-center text-danger">Hesla se neschodují.</div>
                                    )}
                                    {saved && (
                                        <div className="d-flex align-items-center justify-content-center">
                                            <strong className="text-center">Heslo úspěšně změněno</strong>¨
                                        </div>
                                    )}
                                    <div className="d-flex align-items-center mt-3 justify-content-center">
                                        <button className="v-btn" onClick={()=>zmenitHeslo()}>Uložit heslo</button>
                                    </div>
                                </Col>
                            </Row>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Col>
        </Row>
    );
}

const Kontakty = ({crm_data, activeKey, predvolby, onUpdate} : CrmBodyClientTypes) => {
    const dispatch = useDispatch();

    const toggleKontaktAcc = () => {
        dispatch(toggleKontakt());
    }

    const [prefix, setPrefix] = useState("+420");
    const [secondPrefix, setSecondPrefix] = useState("+420");

    const [phone, setPhone] = useState("");
    const [secondPhone, setSecondPhone] = useState("");
    const [firstMail, setFirstMail] = useState("");
    const [secondMail, setSecondMail] = useState("");
    const [udajeOdeslane, setUdajeOdeslane] = useState(false);
    useEffect(() => {
        if (crm_data) {
            setPhone(crm_data.z_phone ?? "");
            setSecondPhone(crm_data.z_phone_2 ?? "");
            setFirstMail(crm_data.z_mail ?? "");
            setSecondMail(crm_data.z_mail_2 ?? "");
        }
    }, [crm_data]);

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

    const  zmenitKontaktUdaje = async () => {
        const zak_id = getCookie("zak_id");
        if(!zak_id) {
            return;
        } 
        try {

            const response = await axios.post("/api/account_router", {
                action: "updateKontakty",
                z_id: zak_id,
                z_phone: phone,
                z_phone_2: secondPhone,
                z_mail: firstMail,
                z_mail_2: secondMail,
                z_prefix: prefix,
                z_prefix_2: secondPrefix,
            });

            const data = response.data;

            if(data.success) {
                setUdajeOdeslane(true);
                if (onUpdate) {
                    onUpdate((prev) => ({
                        ...prev!,
                        z_phone: phone,
                        z_phone_2: secondPhone,
                        z_mail: firstMail,
                        z_mail_2: secondMail,
                        z_pred_1: prefix,
                        z_pred_2: secondPrefix,
                    }));
                    }

            } else {
                console.log(data.error);
                setUdajeOdeslane(false);
            }
        } catch {
            setUdajeOdeslane(false);
        }
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
                                        <Form.Control value={firstMail} onChange={(e) => setFirstMail(e.target.value)} type="email" placeholder="První email" />
                                    </FloatingLabel>
                                </Col>
                                <Col xs="12" lg="6">
                                     <FloatingLabel controlId="druhy-email" label="Druhý e-mail">
                                        <Form.Control value={secondMail} onChange={(e) => setSecondMail(e.target.value)} type="email" placeholder="Druhý e-mail" />
                                    </FloatingLabel>
                                </Col>
                                <Col xs="12" lg="6" className="mt-3">
                                    <div className="input-group">
                                        <PhonePrefixSelect value={prefix} onChange={handlePhoneChange} predvolby={predvolby}/>
                                        
                                        <FloatingLabel controlId="prvni-tel" label="První telefon" className="flex-grow-1">
                                        <Form.Control
                                            type="tel"
                                            placeholder="První telefon"
                                            className="rounded-start-0"
                                            onChange={(e) => setPhone(e.target.value)}
                                            value={phone}
                                        />
                                        </FloatingLabel>
                                    </div>
                                </Col>

                                <Col xs="12" lg="6" className="mt-3">
                                    <div className="input-group">
                                        <PhonePrefixSelect value={secondPrefix} onChange={handleSecondPhonePref} predvolby={predvolby}/>
                                        
                                        <FloatingLabel controlId="druhy-tel" label="Druhý telefon" className="flex-grow-1">
                                        <Form.Control
                                            type="tel"
                                            placeholder="Druhý telefon"
                                            className="rounded-start-0"
                                            onChange={(e) => setSecondPhone(e.target.value)}
                                            value={secondPhone}
                                        />
                                        </FloatingLabel>
                                    </div>
                                </Col>
                                {udajeOdeslane && (
                                    <Col xs="12" className="d-flex align-items-center justify-content-center mt-3">
                                        <strong>Kontaktní údaje úspěšně aktualizovány</strong>
                                    </Col>
                                )}
                                <Col xs="12">
                                    <div className="d-flex align-items-center mt-3 justify-content-center">
                                        <button className="v-btn" onClick={()=>zmenitKontaktUdaje()}>Uložit kontaktní údaje</button>
                                    </div>
                                </Col>
                            </Row>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Col>
        </Row>
    );
}

const Adresa_client = ({crm_data, activeKey, staty, onUpdate} : CrmBodyClientTypes) => {

    const dispatch = useDispatch();

    const toggleAdresaAcc = () => {
        dispatch(toggleAdresa());
    }

    const [stateVal, setStateVal] = useState("10");
    const handleStateChange = (value: string | null) => {
        if (value !== null) {
            setStateVal(value);
        }
    };

    const [obcanstviVal, setObcanstviVal] = useState("10");
    const handleObcanstviVal = (value: string | null) => {
        if (value !== null) {
            setObcanstviVal(value);
        }
    };

    const [mesto, setMesto] = useState(crm_data?.z_city || "");
    const [ulice, setUlice] = useState(crm_data?.z_adress || "");
    const [psc, setPsc] = useState(crm_data?.z_psc || "");
    const [pic, setPic] = useState<File | string>("");
    const [web] = useState(crm_data?.z_web || "");
    const [udajeOdeslaneAdreasa, setUdajeOdeslaneAdresa] = useState(false);

    const zmenitUdaje = async () => {
        const zak_id = getCookie("zak_id");
        if (!zak_id) return;

        try {
            const formData = new FormData();

            formData.append("action", "updateAdresa"); // identifikace na backendu (stejně jako `changePasswordAccount`)
            formData.append("z_id", zak_id);
            formData.append("z_city", mesto);
            formData.append("z_adress", ulice);
            formData.append("z_psc", psc);
            formData.append("z_web", web);
            formData.append("z_stat", stateVal);
            formData.append("z_obcanstvi", obcanstviVal);

            if (typeof pic !== "string" && pic instanceof File) {
                formData.append("z_pic", pic); // nový obrázek
            } else {
                formData.append("z_pic_old", pic); // starý obrázek
            }

            const response = await axios.post("/api/file_insert_router", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const data = response.data;

            if (data.success) {
                setUdajeOdeslaneAdresa(true);
                if (onUpdate) {
                    onUpdate((prev) => ({
                        ...prev!,
                        z_city: mesto,
                        z_adress: ulice,
                        z_psc: psc,
                        z_state: data.stat,
                        z_obcanstvi: data.obcanstvi,
                    }));
                    }
                
            } else {
                setUdajeOdeslaneAdresa(false);
            }
        } catch (error) {
            console.error("Chyba při odesílání údajů:", error);
            alert("Nastala chyba na serveru.");
        }
    };

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
                                        <Form.Control value={mesto} onChange={(e) => setMesto(e.target.value)} type="text" placeholder="Trvalé bydliště" />
                                    </FloatingLabel>
                                </Col>
                                <Col xs="12" lg="6">
                                     <FloatingLabel controlId="ulice" label="Ulice">
                                        <Form.Control value={ulice} onChange={(e) => setUlice(e.target.value)} type="text" placeholder="Ulice" />
                                    </FloatingLabel>
                                </Col>
                                <Col xs="12" lg="6" className="mt-3">
                                    <FloatingLabel controlId="psc" label="Psč">
                                        <Form.Control value={psc} onChange={(e) => setPsc(e.target.value)} type="text" placeholder="Psč" />
                                    </FloatingLabel>
                                </Col>
                                <Col xs="12" lg="6" className="mt-3">
                                    <MaxDropdown value={stateVal} onChange={handleStateChange} staty={staty} target="stat"/>
                                </Col>
                                <Col xs="12" lg="6" className="mt-3">
                                    <FloatingLabel controlId="psc" label="Obrázek">
                                        <Form.Control
                                            type="file"
                                            placeholder="Obrázek"
                                            onChange={(e) => {
                                                const target = e.target as HTMLInputElement;
                                                const file = target.files?.[0];
                                                if (file) {
                                                    setPic(file);
                                                }
                                            }}
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col xs="12" lg="6" className="mt-3">
                                    <MaxDropdown value={obcanstviVal} onChange={handleObcanstviVal} staty={staty} target="obcanstvi"/>
                                </Col>
                                {udajeOdeslaneAdreasa && (
                                    <Col xs="12" className="mt-3 d-flex align-items-center justify-content-center">
                                        <strong>Údaje úspěšně odeslány</strong>
                                    </Col>
                                )}
                                <Col xs="12">
                                    <div className="d-flex align-items-center mt-3 justify-content-center">
                                        <button className="v-btn" onClick={()=>zmenitUdaje()}>Uložit adresu</button>
                                    </div>
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
                <Image src={crm_data?.z_pic} className=" profile-pic" alt="profilový obrázek"/>
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
                    <Col_6 className={`${crm_data?.z_phone_2 ? "pt-3" : "py-3 border-bottom border-secondary"}`} text_1="První číslo:" text_2={`${crm_data.z_pred_1} ${crm_data.z_phone}`}/>
                </>
            )}
            
            {crm_data?.z_phone_2 && (
                <>
                    <Col_6 className="pb-3 border-bottom border-secondary" text_1="Druhé číslo:" text_2={`${crm_data.z_pred_2} ${crm_data.z_phone_2}`}/>
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
                    <Col_6 className="pb-3 border-bottom border-secondary" text_1="Občanství:" text_2={crm_data.z_obcanstvi? crm_data.z_obcanstvi.charAt(0).toUpperCase() + crm_data.z_obcanstvi.slice(1): ""}/>
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