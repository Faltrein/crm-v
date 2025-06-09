import { CookiesLoginType } from "@/app/app_types/global_types";
import { Login_client } from "./login_client";

 export const Login = ({consentValue} : CookiesLoginType) => {
    return (
      <section id="login">
        <Login_client consentValue={consentValue}/>  
      </section>
    );
  }
  