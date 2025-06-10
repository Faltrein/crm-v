"use client"
import React, {useState, useEffect} from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";


export const Pass_change_client = () => {
    const [newPass, setNewPass] = useState("");
    const [newPassControl, setNewPassControl] = useState("");
    const [passNoMatch, setPassNoMatch] = useState(false);
    const [isTooShort, setIsTooShort] = useState(false);
    const [noLetter, setNoLetter] = useState(false);
    const [tokenVText, setTokenVText] = useState(false);
    const [tokenExpired, setTokenExpired] = useState(false);

    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [userId, timestampStr] = token?.split("-") ?? [];

    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const tokenV = searchParams.get("v");

    useEffect(() => {
        if(tokenV) {
            setTokenVText(true);
        }
    }, [tokenV]);

    
    useEffect(() => {
        setIsTooShort(newPass.length < 6);

        setNoLetter(!/[A-Z]/.test(newPass) || newPass.length === 0);

        setPassNoMatch(newPass !== newPassControl);
    }, [newPass, newPassControl]);

    useEffect(() => {
        if (token) {
        const tokenTimestamp = parseInt(timestampStr, 10);
        const now = Date.now();

        const diffMs = now - tokenTimestamp;
        const diffMinutes = Math.floor(diffMs / (1000 * 60));

        if (diffMinutes > 30) {
            setTokenExpired(true);
        }

        }
    }, [token, timestampStr]);

    const handlePassChange = async () => {
        if (passNoMatch || isTooShort || noLetter || tokenExpired || !newPass || !newPassControl) {
            return;
        }
        setSuccess(true);
        try {
            const response = await axios.post("/api/login_router", {
                action: "changePassword",
                userId,
                newPass,
            });

            if (response.status === 200) {
                setSuccess(true);
                router.push("/");
            } else {
                setSuccess(false);
                alert("Chyba při změně hesla.");
            }
        } catch {
        }
    };

    return (
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
            <div className="login-container">
                {!tokenExpired && (<div className=" row g-0 p-3">
                    
                    <div className="col-12">
                        <h1 className="text-center display-1">Změna hesla</h1>
                    </div>
                    {tokenVText && (
                        <div className="col-12">
                            <p className="text-center">Tento účet byl vytvořen adminem změň si heslo pro správné fungování bezpečnosti</p>
                        </div>
                    )}
                    <div className="col-12 mt-2">
                        <div className="input-group mb-3 rounded-input">
                            <span className="input-group-text bg-v-light border-v">
                                <i className="bi bi-lock-fill fs-5 px-2 text-white"></i>
                            </span>
                            <input type="password"  id="inp-pass" className="form-control" placeholder="Nové heslo"  value={newPass} onChange={e => setNewPass(e.target.value)} />
                        </div>
                    </div>

                    <div className="col-12 mt-3">
                        <div className="input-group mb-3 rounded-input">
                            <span className="input-group-text bg-v-light border-v">
                                <i className="bi bi-lock-fill fs-5 px-2 text-white"></i>
                            </span>
                            <input type="password"  id="inp-pass" className="form-control" placeholder="Nové heslo"  value={newPassControl} onChange={e => setNewPassControl(e.target.value)} />
                        </div>
                    </div>

                    <div className="col-12">
                        {isTooShort && (
                            <p className="text-center text-danger">Heslo musí mít alespoň 6 znaků.</p>
                        )}
                        {noLetter && (
                            <p className="text-center text-danger">Heslo musí obsahovat alespoň jedno velké písmeno.</p>
                        )}
                        {passNoMatch && (
                            <p className="text-center text-danger">Hesla se neschodují.</p>
                        )}
                    </div>
                    {!success && (
                        <div className="col-12 d-flex align-items-center justify-content-center">
                            <button disabled={passNoMatch || isTooShort || noLetter || tokenExpired || !newPass || !newPassControl} onClick={handlePassChange} className="v-btn" type="button">Změnit heslo</button>     
                        </div>
                    )}

                    {success && (
                        <div className="col-12">
                            <p className="text-center">Heslo úspěšně změněno budete přesměrování na login</p>
                        </div>
                    )}
                    
                </div>)}

                {tokenExpired && (
                    <div className="row g-0 p-3">
                        <div className="col-12">
                            <h1 className="text-center display-1">Žádost o změnu hesla vypršela</h1>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}