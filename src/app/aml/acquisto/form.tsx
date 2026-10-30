"use client";
import {useState} from "react";
import {useSearchParams} from "next/navigation";
import Link from "next/link";
import {amlPlans,getAmlPlan} from "../../../lib/aml-pricing";
export default function AcquistoAML(){
 const params=useSearchParams();
 const selected=params.get("piano")||"professional";
 const initial=getAmlPlan(selected)||amlPlans[1];
 const [plan,setPlan]=useState<string>(initial.id);
 const [email,setEmail]=useState("");
 const [studioName,setStudioName]=useState("");
 const [vatNumber,setVatNumber]=useState("");
 const [loading,setLoading]=useState(false);
 const [error,setError]=useState("");
 async function submit(e:React.FormEvent){e.preventDefault();setLoading(true);setError("");try{
  const response=await fetch("/api/aml/checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({plan,email,studioName,vatNumber})});
  const data=await response.json();
  if(!response.ok||!data.url)throw new Error(data.error||"Pagamento non disponibile");
  window.location.assign(data.url);
 }catch(err){setError(err instanceof Error?err.message:"Impossibile avviare il pagamento");setLoading(false)}}
 return <main style={{fontFamily:"Arial, sans-serif",background:"#f2f6fb",minHeight:"100vh",padding:"48px 20px"}}>
  <div style={{maxWidth:680,margin:"auto",background:"#fff",border:"1px solid #d7e3f2",borderRadius:16,padding:32}}>
  <Link href="/aml#prezzi">← Torna ai piani</Link>
  <h1>Attivazione Studio Manager Pro AML</h1>
  <p>Seleziona il numero di pratiche e inserisci i dati dello studio. Prezzi annuali con IVA non applicata (regime forfettario).</p>
  <form onSubmit={submit} style={{display:"grid",gap:18}}>
   <label>Piano annuale<select value={plan} onChange={e=>setPlan(e.target.value)} style={{display:"block",width:"100%",padding:12,marginTop:6}}>{amlPlans.map(p=><option key={p.id} value={p.id}>{p.name} — fino a {p.maxPractices} pratiche — € {p.annualEur}/anno</option>)}</select></label>
   <label>Denominazione studio<input required minLength={3} maxLength={180} value={studioName} onChange={e=>setStudioName(e.target.value)} style={{display:"block",width:"100%",padding:12,marginTop:6,border:"1px solid #b5c7dc",borderRadius:6}}/></label>
   <label>Email amministrativa<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} style={{display:"block",width:"100%",padding:12,marginTop:6,border:"1px solid #b5c7dc",borderRadius:6}}/></label>
   <label>Partita IVA (facoltativa)<input value={vatNumber} maxLength={32} onChange={e=>setVatNumber(e.target.value)} style={{display:"block",width:"100%",padding:12,marginTop:6,border:"1px solid #b5c7dc",borderRadius:6}}/></label>
   <p style={{background:"#fff8e5",padding:15,border:"1px solid #edcf8e",borderRadius:8,color:"#694c0d"}}>Acquisti temporaneamente sospesi: stiamo completando l'attivazione delle licenze e la verifica dei pagamenti. Nessun addebito verrà effettuato durante questa fase.</p>
   {error&&<p role="alert" style={{color:"#a40000"}}>{error}</p>}
   <button disabled={loading} style={{background:"#136fe0",color:"white",padding:15,border:0,borderRadius:8,fontWeight:700,cursor:"pointer"}}>{loading?"Connessione a Stripe...":"Procedi al pagamento Stripe"}</button>
  </form></div></main>;
}
