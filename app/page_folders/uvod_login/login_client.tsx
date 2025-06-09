"use client"
import React, {useState, useEffect} from "react";
import axios from "axios";
import { addToCookie, handleCookie} from "@/app/venca_lib/venca_lib";
import { CookiesLoginType, LoginModalType } from "@/app/app_types/global_types";
import { Modal } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/navigation";


export const Login_client = ({consentValue} : CookiesLoginType) => {
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [cookieChecked, setCookieChecked] = useState(true);
    const [hideCookieBar, setHideCookieBar] = useState(false);
    const [cookieVal, setCookieVal] = useState(consentValue);
    const [showCookieModal, setShowCookieModal] = useState(false);
    const [wrongPass, setWrongPass] = useState(false);
    const [lockedLog, setLockedPass] = useState(false);
    const [stayLogged, setStayLogged] = useState(false);

    const [time, setTime] = useState<number>(0);

    const router = useRouter();

    const togglePassword = () => setShowPassword((prev) => !prev);

    useEffect(() => {
        if (consentValue === "1" || consentValue === "0") {
            setCookieChecked(true);
            setHideCookieBar(true);
        } else {
            setCookieChecked(false);
        }
        
    }, [consentValue]);

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStayLogged(e.target.checked); 
    };

    const handleLogin = async () => {
        if (cookieVal !== "1") {
            setHideCookieBar(true);
            setShowCookieModal(false);
            setTimeout(() => setShowCookieModal(true), 10);
            return;
        }

        try {
            const res = await axios.post("/api/login_router", {
            action: "login",
            user,
            pass,
            });

            if (res.status === 200) {
                if (res.data.token) {
                    router.push(`/pass-change?token=${res.data.token}&v=1`);
                } else if (res.data.id) {
                    setLockedPass(false);
                    setTime(0);
                    if(stayLogged) {
                        addToCookie("zak_id", res.data.id, 86400);
                        window.location.reload();
                    } else {
                        addToCookie("zak_id", res.data.id, 2592000);
                        window.location.reload();
                    }
                    //
                }
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                // error je typu AxiosError, můžeš bezpečně přistupovat k error.response apod.
                if (error.response?.status === 423) {
                setLockedPass(true);

                const lockedUntilStr = error.response.data.locked_until;
                if (lockedUntilStr) {
                    const lockedUntil = new Date(lockedUntilStr);
                    const now = new Date();
                    const diffMs = lockedUntil.getTime() - now.getTime();
                    const diffMin = Math.ceil(diffMs / 1000 / 60);
                    setTime(diffMin > 0 ? diffMin : 0);
                }
                } else {
                    setLockedPass(false);
                    setWrongPass(true);
                }
            } else {
                // Jiný typ chyby než AxiosError
                setWrongPass(true);
            }
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
                            <input type="text" aria-label="Password" className="form-control" placeholder="Email nebo username" value={user} onChange={e => setUser(e.target.value)} />
                        </div>
                        <div className="input-group mb-3 rounded-input position-rel pe-5">
                            <span className="input-group-text bg-v-light border-v">
                                <i className="bi bi-lock-fill fs-5 px-2 text-white"></i>
                            </span>
                            <input type={showPassword ? "text" : "password"} className="form-control " placeholder="Heslo" value={pass} onChange={e => setPass(e.target.value)}/>
                            <button className="eye-pos" type="button" onClick={togglePassword} aria-label="Zobrazit heslo">
                                <i className={`bi fs-2 text-secondary ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                            </button>
                        </div>
                    </div>
                    {wrongPass && !lockedLog &&(
                    <div className="col-12">
                        <p className="text-danger text-center">Nesprávné heslo nebo jméno</p>
                    </div>
                    )}
                    {lockedLog &&(
                    <div className="col-12">
                        <p className="text-danger text-center">Tvůj účet je zablokovaný na {time} minut</p>
                    </div>
                    )}                  
                    
                    <div className="col-12 d-flex justify-content-center">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="" id="stay-logged" checked={stayLogged} onChange={handleCheckboxChange}/>
                            <label className="form-check-label" htmlFor="stay-logged">
                                Zůstat příhlášený
                            </label>
                        </div>
                    </div>

                    <div className="col-12 d-flex justify-content-center mt-2">
                        <Link title="Žádost o změna hesla" href="/pc-req" className="text-center text-dark">Zapomenuté heslo?</Link>
                    </div>

                    <div className="col-12 d-flex align-items-center justify-content-center mt-2">
                        <button onClick={handleLogin} className="v-btn" type="button">Přihlásit se</button>     
                    </div>
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

