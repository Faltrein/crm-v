"use client"
import React, {useState, useEffect} from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";


export const Pass_change_client = () => {
    const [newPass, setNewPass] = useState("");
    const [newPassControl, setNewPassControl] = useState("");
    const [passNoMatch, setPassNoMatch] = useState(false);
    
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    useEffect(() => {
    if (id) {
      console.log("ID z URL:", id);
    }
  }, [id]);

    const handlePassChange = () =>{
        if(newPass === newPassControl) {

        } else {
            setPassNoMatch(true);
        }
    }

    return (
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
            <div className="login-container">
                <div className=" row g-0 p-3">
                    <div className="col-12">
                        <h1 className="text-center display-1">Změna hesla</h1>
                    </div>
                    <div className="col-12 mt-3">
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

                    {!passNoMatch && newPass.length > 0 && newPassControl.length > 0 && (
                        <div className="col-12">
                            <p className="text-center text-danger">Hesla se neschodují</p>
                        </div>
                    )}
                    <div className="col-12 d-flex align-items-center justify-content-center">
                        <button onClick={handlePassChange} className="v-btn" type="button">Změnit heslo</button>     
                    </div>
                </div>
            </div>
        </div>
    );
}