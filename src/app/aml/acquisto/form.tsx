"use client";
import {useState} from "react";
import {useSearchParams} from "next/navigation";
import Link from "next/link";
import {amlPlans,getAmlPlan} from "../../../lib/aml-pricing";
import "./form.css";
const fs=[["ragione_sociale","Ragione sociale / Cognome e nome"],["codice_fiscale","Codice fiscale"],["partita_iva","Partita IVA"],["codice_sdi","Codice SDI"],["email_studio","Email studio"],["admin_nome","Nome amministratore studio"],["admin_cognome","Cognome amministratore studio"],["admin_email","Email amministratore studio"],["indirizzo","Indirizzo sede"],["citta","Città"],["provincia","Provincia"],["cap","CAP"],["telefono","Telefono"]] as const;
export default function AcquistoAML(){
 const params=useSearchParams();
 const [plan,setPlan]=useState(getAmlPlan(params.get("piano")||"professional")?.id||"professional");
 const [data,setData]=useState<Record<string,string>>({});
 const [flags,setFlags]=useState([false,false,false,false]);
 const [file,setFile]=useState<File|null>(null);
 const [error,setError]=useState("");
 const selected=getAmlPlan(plan)||amlPlans[1];
 const complete=fs.slice(0,-1).every(([key])=>(data[key]||"").trim())&&flags.every(Boolean);
 const labels=["Accetto le condizioni contrattuali.","Accetto l'informativa privacy.","Confermo la sottoscrizione del piano selezionato.","Dichiaro di aver preso visione della durata annuale e delle condizioni di rinnovo automatico."];
 function generate(){
   if(!complete){setError("Compila i campi obbligatori e le quattro accettazioni.");return}
   const w=window.open("","_blank");if(!w){setError("Consenti le finestre popup per visualizzare la bozza.");return}
   const escape=(x:string)=>x.replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]||c));
   const details=fs.map(([k,label])=>"<tr><th>"+label+"</th><td>"+escape(data[k]||"-")+"</td></tr>").join("");
   w.document.write('<!doctype html><html lang="it"><meta charset="UTF-8"><title>Bozza AML</title><style>body{font:14px Arial;margin:35px auto;max-width:760px;line-height:1.6}td,th{border:1px solid #aaa;padding:7px;text-align:left}table{border-collapse:collapse;width:100%}.warn{background:#fff7de;padding:12px}</style><h1>Studio Manager Pro AML</h1><h2>Bozza dati di sottoscrizione</h2><p class="warn">Bozza di verifica, non costituisce contratto definitivo né autorizzazione di pagamento.</p><table>'+details+'</table><h2>Licenza annuale</h2><p>'+selected.name+' - massimo '+selected.maxPractices+' pratiche - '+selected.annualEur+' € annui, IVA non applicata.</p><p>La durata, il rinnovo e le condizioni definitive saranno comunicati prima dell’apertura alle vendite.</p><p style="margin-top:65px">Data e firma ________________________</p></html>');
   w.document.close();w.focus();
 }
 return <main className="amlBuy"><div className="amlBuyWrap">
  <header className="amlBuyHero"><small>STUDIO MANAGER PRO AML</small><h1>Sottoscrizione abbonamento/contratto</h1><p>Dati, licenza annuale, accettazioni e contratto personalizzato.</p><Link href="/aml#prezzi">← Torna ai piani AML</Link></header>
  <section><h2>Dati anagrafici</h2><div className="amlBuyFields">{fs.map(([key,label],i)=><label key={key}>{label}{i<fs.length-1?" *":""}<input required={i<fs.length-1} type={key.includes("email")?"email":"text"} value={data[key]||""} onChange={e=>setData(v=>({...v,[key]:e.target.value}))}/></label>)}</div></section>
  <section><div className="amlBuyHeader"><div><small>CONFIGURAZIONE</small><h2>Piano Studio Manager Pro AML</h2></div><b>Selezionato: {selected.name}</b></div><div className="amlBuyPlans">{amlPlans.map(p=><button type="button" key={p.id} className={plan===p.id?"chosen":""} onClick={()=>setPlan(p.id)}><strong>{p.name}</strong><span>Fino a {p.maxPractices} pratiche AML</span><b>{p.annualEur},00 €<small> / anno</small></b></button>)}</div><p>IVA non applicata · Regime forfettario. Nessun modulo SMP aggiuntivo.</p></section>
  <section><h2>Accettazioni obbligatorie</h2>{labels.map((label,i)=><label className="amlBuyCheck" key={i}><input type="checkbox" checked={flags[i]} onChange={e=>setFlags(a=>a.map((v,j)=>j===i?e.target.checked:v))}/>{label}</label>)}{!flags.every(Boolean)&&<p className="amlBuyWarning">Per generare la bozza devi attivare tutti e quattro i flag.</p>}</section>
  <section><h2>Contratto di abbonamento</h2><p>1. Compila i dati. 2. Attiva le accettazioni. 3. Genera la bozza di verifica. 4. La firma e la trasmissione saranno disponibili con il contratto definitivo.</p><button type="button" className="amlBuyDraft" disabled={!complete} onClick={generate}>Genera e stampa bozza personalizzata →</button><label className="amlBuyFile">Carica il contratto firmato in PDF (non ancora inviato)<input type="file" accept=".pdf,application/pdf" onChange={e=>setFile(e.target.files?.[0]||null)}/><small>{file?"Selezionato: "+file.name+" · non trasmesso":"Il caricamento sicuro sarà attivato dopo la validazione del contratto definitivo."}</small></label></section>
  {error&&<p className="amlBuyError">{error}</p>}<button disabled className="amlBuyPay">Sottoscrivi e procedi al pagamento Stripe →</button><p className="amlBuyNotice">Acquisti temporaneamente sospesi. Nessun pagamento o attivazione viene effettuato.</p>
 </div></main>;
}