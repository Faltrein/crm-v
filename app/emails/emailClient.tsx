"use client";
import React,{useEffect} from "react";
import { Col, Row, Container, Modal, Button } from "react-bootstrap";
import { useAppSelector, useAppDispatch } from "../redux-store/hooks";
import { addEmailModal } from "../redux-store/emailCliSlice";

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

    return (
        <Modal show={isModalOpen} onHide={handleClose} centered container={typeof window !== "undefined" ? document.getElementById("email-client-wrapper") : undefined}
            backdropClassName="custom-backdrop">
            <Modal.Header closeButton>
                <Modal.Title>Přidat heslo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Tady může být třeba formulář */}
                Formulář pro přidání hesla sem...
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Zavřít
                </Button>
                <Button variant="primary" onClick={() => {/* logika pro uložení */}}>
                    Uložit
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
