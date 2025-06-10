"use client"
import Link from "next/link";
import React,{useState} from "react";
import axios from "axios";

export const Pc_req_client = () => {
    const [user, setUser] = useState("");
    const [passMessage, setPassMessage] = useState(false);
    const handleSendResetEmail = async () => {
        setPassMessage(true);
        try {
            const res = await axios.post("/api/login_router", {
            action: "sendResetEmail",
            user,
            });

            if (res.data.success) {
            setPassMessage(true);
            }
        } catch  {
            setPassMessage(false);
        }
    };

    return (
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
            <div className="login-container">
                <div className="row g-0 p-3">
                    <div className="col-12">
                        <Link title="zpět na v-crm login" href="/" className="go-b-btn" >
                            <i className="bi bi-arrow-left-short fs-2 ms-2px mb-2px"></i>
                            <span className="go-b-text">Zpět k přihlášení</span>
                        </Link>
                    </div>
                    <div className="col-12">
                        <h1 className="text-center display-1">Změna hesla</h1>
                    </div>

                    <div className="col-12 mt-3">
                        <div className="input-group mb-3 rounded-input ">
                            <span className="input-group-text bg-v-light border-v">
                                <i className="bi bi-person-circle fs-5 px-2 text-white"></i>
                            </span>
                            <input type="text" aria-label="type" className="form-control" placeholder="Email nebo username" value={user} onChange={e => setUser(e.target.value)} />
                        </div>
                    </div>

                    {!passMessage && (
                        <div className="col-12 d-flex align-items-center justify-content-center mt-2">
                            <button onClick={handleSendResetEmail} className="v-btn" type="button">
                                <span className="px-2">Odeslat na e-mail</span>
                            </button>     
                        </div>
                    )}

                    {passMessage && (
                        <div className="col-12">
                            <p className="text-center">Požadavek odeslán na email. Pozn. v závislosti na clientovi může požadavek trvat několik sekund až několik minut</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}