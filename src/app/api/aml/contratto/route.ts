import {NextResponse} from "next/server";
import {PDFDocument,StandardFonts,rgb} from "pdf-lib";
import {getAmlPlan} from "../../../../lib/aml-pricing";
export const runtime="nodejs";
const clean=(v:unknown)=>String(v??"").trim().slice(0,180);
const money=(n:number)=>new Intl.NumberFormat("it-IT",{style:"currency",currency:"EUR"}).format(n);
export async function POST(request:Request){
 try{
  const body=await request.json();
  const plan=getAmlPlan(String(body.plan||""));
  const fields=["ragione_sociale","codice_fiscale","partita_iva","codice_sdi","email_studio","admin_nome","admin_cognome","admin_email","indirizzo","citta","provincia","cap"];
  const customer=body.customer||{};
  if(!plan||fields.some(k=>!clean(customer[k])))return NextResponse.json({error:"Completa i dati obbligatori e il piano."},{status:400});
  if(!Array.isArray(body.consents)||body.consents.length!==4||!body.consents.every((v:unknown)=>v===true))return NextResponse.json({error:"Conferma tutte e quattro le accettazioni."},{status:400});
  const pdf=await PDFDocument.create();const normal=await pdf.embedFont(StandardFonts.Helvetica);const bold=await pdf.embedFont(StandardFonts.HelveticaBold);
  const navy=rgb(.055,.17,.33);const gray=rgb(.36,.43,.52);
  let page=pdf.addPage([595,842]),y=790;
  const add=(t:string,size=10,isBold=false,indent=48)=>{
   const font=isBold?bold:normal;
   const safe=t.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^\x20-\x7e]/g," ");
   const words=safe.split(" ");let line="";
   for(const word of words){const next=line?line+" "+word:word;
    if(font.widthOfTextAtSize(next,size)>500&&line){if(y<70){page=pdf.addPage([595,842]);y=790}page.drawText(line,{x:indent,y,size,font,color:navy});y-=size+7;line=word;}else line=next;}
   if(line){if(y<70){page=pdf.addPage([595,842]);y=790}page.drawText(line,{x:indent,y,size,font,color:navy});y-=size+7}
  };
  add("STUDIO MANAGER PRO AML - DOCUMENTO DI SOTTOSCRIZIONE",17,true);y-=12;
  add("Versione da approvare prima della stipula. Non sostituisce le condizioni generali definitive.",9,true);y-=16;
  add("DATI DEL SOTTOSCRITTORE",13,true);
  const labels:Record<string,string>={ragione_sociale:"Ragione sociale",codice_fiscale:"Codice fiscale",partita_iva:"Partita IVA",codice_sdi:"Codice SDI",email_studio:"Email studio",admin_nome:"Nome amministratore",admin_cognome:"Cognome amministratore",admin_email:"Email amministratore",indirizzo:"Indirizzo",citta:"Citta",provincia:"Provincia",cap:"CAP",telefono:"Telefono"};
  for(const [k,label] of Object.entries(labels))add(label+": "+clean(customer[k]));
  y-=12;add("PIANO DI LICENZA AML",13,true);add("Piano: "+plan.name);add("Pratiche AML incluse: fino a "+plan.maxPractices);add("Corrispettivo annuale: "+money(plan.annualEur));add("IVA non applicata: regime forfettario.");y-=14;
  add("AMBITO DEL SERVIZIO",13,true);
  add("Licenza annuale dell'applicativo autonomo Studio Manager Pro AML: pratiche antiriciclaggio, adeguata verifica, fascicoli, rappresentanti, documenti, alert AML e integrazione Microsoft 365. Non sono inclusi i moduli del gestionale SMP ordinario.");
  y-=12;add("CONDIZIONI DA APPROVARE",13,true);
  add("Durata annuale, disciplina del rinnovo e disdetta, limiti applicativi, disponibilita del servizio, responsabilita, trattamento dati e assistenza dovranno essere formalizzati nelle condizioni generali definitive prima della sottoscrizione vincolante.");y-=16;
  add("ACCETTAZIONI RESE IN FASE DI GENERAZIONE",12,true);
  ["Condizioni contrattuali","Informativa privacy","Piano selezionato","Durata annuale e rinnovo automatico"].forEach(x=>add("[X] "+x));
  y-=25;add("Data: ______________________________");add("Firma del sottoscrittore: ____________________________________");
  pdf.setTitle("Documento di sottoscrizione Studio Manager Pro AML - "+plan.name);
  const bytes=await pdf.save();
  return new NextResponse(Buffer.from(bytes),{status:200,headers:{"Content-Type":"application/pdf","Content-Disposition":'attachment; filename="Contratto_AML_'+plan.id+'.pdf"',"Cache-Control":"no-store"}});
 }catch(error){console.error("[AML contract]",error);return NextResponse.json({error:"Generazione PDF non riuscita."},{status:500})}
}
