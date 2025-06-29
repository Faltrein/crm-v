"use client";
import React,{ useEffect, useState } from "react";
import { Col, Row, Container, Modal, Button, Form, InputGroup } from "react-bootstrap";
import { useAppSelector, useAppDispatch } from "../redux-store/hooks";
import { addEmailModal } from "../redux-store/emailCliSlice";
import axios from "axios";
import validator from "validator";

export const EmailSubnav = () => {
    const dispatch = useAppDispatch();

    const showAddModal = () => {
        dispatch(addEmailModal());
    }

    const addModal = useAppSelector(state => state.email.emailAddModal);

    return (
        <div className="d-flex align-items-center justify-content-start">
            <button type="button" className={`text-dark ${addModal ? 'text-shadow' : ''}`} onClick={showAddModal}>Přidej email</button>
        </div>
    );
}
export const Email_client = () => {
    const isSubnavOpen = useAppSelector(state => state.account.isSubnavOpen);

    
    return (
        <Container fluid className={isSubnavOpen ? "margin-pro-redux" : ""} >
            <div id="email-client-wrapper" className="position-rel">
                <Row>
                    <Col xs="12">
                        react client
                    </Col>
                </Row>
                <Add_Email_Modal />
            </div>
        </Container>
    );
}


export const Add_Email_Modal = () => {
    const dispatch = useAppDispatch();
    const isModalOpen = useAppSelector(state => state.email.emailAddModal);
    const handleClose = () => {
        dispatch(addEmailModal()); // přepne stav
    };

    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(""); 

    const togglePassword = () => {
        setShowPassword(prev => !prev);
    };

   useEffect(() => {
        const emailSection = document.getElementById("email");

        if (isModalOpen) {
            // Oprava zápisu vlastností
            document.body.style.overflow = 'visible';
            document.body.style.overflowX = 'hidden';
            document.body.style.paddingRight = '0px';

            // Nastav overflow hidden jen na konkrétní sekci
            if (emailSection) {
            emailSection.style.overflow = 'hidden';
            }
        } else {
            // Reset na výchozí hodnoty
            document.body.style.overflow = '';
            document.body.style.overflowX = 'hidden';
            document.body.style.paddingRight = '';

            if (emailSection) {
            emailSection.style.overflow = '';
            }
        }

        // Cleanup při odpojení (volitelný, ale dobrý zvyk)
        return () => {
            document.body.style.overflow = '';
            document.body.style.overflowX = '';
            document.body.style.paddingRight = '';

            if (emailSection) {
            emailSection.style.overflow = '';
            }
        };
        }, [isModalOpen]);

    const handleSave = async () => {
        setError("");

        if (!validator.isEmail(user)) {
            setError("Zadejte platný e-mail.");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post("/api/email_client", {
                action: "add-email",
                email: user,
                password: pass
            });

            if (res.data.success) {
                if (res.data.redirectUrl) {
                    const popup = window.open(res.data.redirectUrl, '_blank');

                    const timer = setInterval(() => {
                    if (!popup || popup.closed) {
                        clearInterval(timer);
                        alert('Popup zavřeno, můžeš pokračovat');
                        // Tady můžeš napsat kód, který má proběhnout po zavření popupu
                    }
                    }, 500); // kontroluj každých 500 ms
                }
            } else {
                setError(res.data.message || "Nepodařilo se přidat účet.");
            }
        } catch (err) {
            console.error(err);
            setError("Chyba při komunikaci se serverem.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={isModalOpen} onHide={handleClose} dialogClassName="custom-centered-modal" container={typeof window !== "undefined" ? document.getElementById("email-client-wrapper") : undefined}
            backdropClassName="custom-backdrop">
            <Modal.Header closeButton>
                <Modal.Title>Přidat email do v-crm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && (
                    <div className="alert alert-danger py-2 px-3">
                        {error}
                    </div>
                )}
                <div className="mb-1">
                    <strong className="ms-1">E-mail</strong>
                </div>
                <InputGroup className="mb-3 rounded-input">
                    <InputGroup.Text className="bg-v-light border-v">
                    <i className="bi bi-person-circle fs-5 px-2 text-white"></i>
                    </InputGroup.Text>
                    <Form.Control
                    type="email"
                    placeholder="Email"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    className="border-left-none"
                    />
                </InputGroup>

                <div className="mb-1">
                    <strong className="ms-1">Heslo</strong>
                </div>
                <InputGroup className="mb-3 rounded-input position-relative pe-5">
                    <InputGroup.Text className="bg-v-light border-v">
                    <i className="bi bi-lock-fill fs-5 px-2 text-white"></i>
                    </InputGroup.Text>
                    <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Heslo"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    className="border-none"
                    />
                    <Button
                    variant="link"
                    className="eye-pos position-absolute end-0 top-50 translate-middle-y pe-3"
                    onClick={togglePassword}
                    aria-label="Zobrazit heslo"
                    >
                    <i className={`bi fs-4 text-secondary ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                    </Button>
                </InputGroup>
            </Modal.Body>
            <Modal.Footer className="d-flex align-items-center justify-content-center">
                <button className="v-btn" onClick={handleSave} disabled={loading}>
                    {loading ? "Ukládám..." : "Uložit"}
                </button>
            </Modal.Footer>
        </Modal>
    );
};
