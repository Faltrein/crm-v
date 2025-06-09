import React from "react";
import { Pass_change_client } from "./pass_change_client";

export async function generateMetadata() {

  return {
    title: "v-crm pass change",
  };
}

const Pass_change = () => {
    return (
        <section id="pass-change">
            <Pass_change_client />
        </section>
    );
}

export default Pass_change;