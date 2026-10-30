import {Suspense} from "react";
import AcquistoAML from "./form";
export default function Page(){return <Suspense fallback={<main>Caricamento...</main>}><AcquistoAML/></Suspense>}
