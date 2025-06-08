"use client"
import React, {useState, useEffect} from "react";
import axios from "axios";
import { handleCookie, Temp_cleaner } from "@/app/venca_lib/venca_lib";
import { CookiesLoginType, LoginModalType } from "@/app/app_types/global_types";
import { Modal } from "react-bootstrap";

export const Login_client = ({consentValue} : CookiesLoginType) => {
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [cookieChecked, setCookieChecked] = useState(true);
    const [hideCookieBar, setHideCookieBar] = useState(false);
    const [cookieVal, setCookieVal] = useState(consentValue);
    const [showCookieModal, setShowCookieModal] = useState(false);

    const togglePassword = () => setShowPassword((prev) => !prev);

    useEffect(() => {
        if (consentValue === "1" || consentValue === "0") {
            setCookieChecked(true);
            setHideCookieBar(true);
        } else {
            setCookieChecked(false);
        }
        alert(consentValue);
    }, [consentValue]);

    const handleLogin = async () => {

        if (cookieVal === "1") {
            alert("time to handle login");
            /*try {
            const res = await axios.post("/api/login", {
                user,
                pass,
            });
        
            console.log("Přihlášení OK", res.data);
            alert("Přihlášení úspěšné!");
            // Zde můžeš přesměrovat nebo uložit session/token atd.
            } catch (err: any) {
            console.error("Chyba při přihlášení:", err);
            alert(err.response?.data?.error || "Přihlášení selhalo");
            }*/
        } else {
            setShowCookieModal(false);
            setTimeout(() => {
                setShowCookieModal(true);
            }, 10);
        }
      };

    return (
        <>
            <div className={`container-fluid ${hideCookieBar ? "vh-100" : "vh-60"} d-flex align-items-center justify-content-center`}>
                <div className="login-container row g-0 p-3">
                    <div className="col-12">
                        <h1 className="text-center display-1">V-crm Login</h1>
                    </div>
                    <div className="col-12 mt-3">
                        <div className="input-group mb-3 rounded-input ">
                            <span className="input-group-text bg-v-light border-v">
                                <i className="bi bi-person-circle fs-5 px-2 text-white"></i>
                            </span>
                            <input type="text" aria-label="Password" id="inp-user" className="form-control" placeholder="Email nebo username" value={user} onChange={e => setUser(e.target.value)} />
                        </div>
                        <div className="input-group mb-3 rounded-input position-rel pe-5">
                            <span className="input-group-text bg-v-light border-v">
                                <i className="bi bi-lock-fill fs-5 px-2 text-white"></i>
                            </span>
                            <input type={showPassword ? "text" : "password"} id="inp-user" className="form-control " placeholder="Heslo" value={pass} onChange={e => setPass(e.target.value)}/>
                            <button className="eye-pos" type="button" onClick={togglePassword} aria-label="Zobrazit heslo">
                                <i className={`bi fs-2 text-secondary ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                            </button>
                        </div>
                    </div>
                    <div className="col-12 d-flex align-items-center justify-content-center">
                        <button onClick={handleLogin} className="v-btn" type="button">Přihlásit se</button>     
                    </div>
                   <Temp_cleaner />
                </div>
                <Login_modal open={showCookieModal} setHideCookieBar={setHideCookieBar} setCookieVal={setCookieVal}/>
            </div>
            {!cookieChecked && (
                <div className={`container-fluid cookie-bar py-4 ${hideCookieBar ? "hide" : ""}`}>
                    <div className="row g-0">
                        <div className="col-12">
                            <h2 className="text-center display-2">Tento web využívá cookies</h2>
                        </div>
                        <div className="col-12 mt-3">
                            <p className="text-center">Dobrý den!</p>
                            <p className="mt-3 text-center">Tento web využívá cookies pro svůj běh, pro jeho správné fungování prosím potvrď cookies.</p>
                        </div>
                        <div className="col-12 mt-2 d-flex align-items-center justify-content-center">
                            <button type="button" className="v-btn me-4" onClick={() => handleCookie({accept:true, setHideCookieBar: setHideCookieBar, setCookieVal: setCookieVal})}>Potvrdit cookies</button>
                            <button type="button" className="v-btn" onClick={() => handleCookie({accept:false, setHideCookieBar: setHideCookieBar, setCookieVal: setCookieVal})}>Zamítnout cookies</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

const Login_modal = ({open, setHideCookieBar, setCookieVal} : LoginModalType) => {

    const [show, setShow] = useState(false);
    
    const handleClose = () => setShow(false);

    useEffect(() => {
        setShow(open); 
    }, [open]);
    return (
        <Modal centered show={show} onHide={handleClose}>
            <Modal.Header>
            <div className="w-100 d-flex align-items-center justify-content-between">
                <Modal.Title>
                    <h2 className="display-2 mb-0">Tento web využívá cookies</h2>
                </Modal.Title>
                <button type="button" className="v-btn-circle " onClick={handleClose}>
                    <i className="bi ms-1px bi-x-lg"></i>
                </button>
            </div>
            </Modal.Header>
                <Modal.Body>
                    <h3 className="text-center display-3">Dobrý den!</h3>
                    <p className="mt-3 text-center">Tento web využívá cookies pro svůj běh, pro jeho správné fungování prosím potvrď cookies.</p>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-center">
                    <button type="button" className="v-btn me-4" onClick={() => {handleCookie({accept: true, setHideCookieBar, setCookieVal: setCookieVal}); handleClose(); setShow(false)}}>
                        Potvrdit cookies
                    </button>
                    <button type="button" className="v-btn" onClick={() => {handleCookie({accept: false, setHideCookieBar, setCookieVal: setCookieVal}); handleClose(); setShow(false)}}>
                        Zamítnout cookies
                    </button>
            </Modal.Footer>
      </Modal>
    );
}