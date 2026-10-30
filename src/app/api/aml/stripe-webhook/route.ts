import {NextResponse} from "next/server";
import Stripe from "stripe";
import {createClient} from "@supabase/supabase-js";
export const runtime="nodejs";
export async function POST(request:Request){
 const secret=process.env.STRIPE_AML_WEBHOOK_SECRET;
 const key=process.env.STRIPE_SECRET_KEY;
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const dbKey=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!secret||!key||!url||!dbKey)return NextResponse.json({error:"Integrazione non configurata"},{status:503});
 const signature=request.headers.get("stripe-signature");
 if(!signature)return NextResponse.json({error:"Firma Stripe mancante"},{status:400});
 let event:Stripe.Event;
 try{event=new Stripe(key).webhooks.constructEvent(await request.text(),signature,secret)}
 catch{return NextResponse.json({error:"Firma Stripe non valida"},{status:400})}
 const relevant=["checkout.session.completed","checkout.session.async_payment_succeeded","checkout.session.async_payment_failed","customer.subscription.updated","customer.subscription.deleted","invoice.paid","invoice.payment_failed"];
 if(!relevant.includes(event.type))return NextResponse.json({received:true});
 const o=event.data.object as unknown as Record<string,unknown>;
 const stripeObjectId=typeof o.id==="string"?o.id:"";
 const stripeCustomerId=typeof o.customer==="string"?o.customer:null;
 const stripeSubscriptionId=typeof o.subscription==="string"?o.subscription:null;
 const ref=typeof o.metadata==="object"&&o.metadata!==null?o.metadata as Record<string,unknown>:{};
 // Registra soltanto il proprio prodotto AML: gli altri abbonamenti Stripe
 // dello stesso account non devono finire nel registro AML.
 if(event.type==="checkout.session.completed"||event.type.startsWith("checkout.session.async")){
   if(ref.product!=="studio-manager-aml")return NextResponse.json({received:true});
 }
 const db=createClient(url,dbKey,{auth:{persistSession:false,autoRefreshToken:false}});
 const {error}=await db.from("tbaml_stripe_eventi").upsert({
  stripe_event_id:event.id,
  tipo_evento:event.type,
  stripe_object_id:stripeObjectId,
  stripe_customer_id:stripeCustomerId,
  stripe_subscription_id:stripeSubscriptionId,
  piano:typeof ref.plan==="string"?ref.plan:null,
  nome_studio:typeof ref.studioName==="string"?ref.studioName:null,
  email:event.type.startsWith("checkout.session")&&typeof o.customer_email==="string"?o.customer_email:null,
  payment_status:typeof o.payment_status==="string"?o.payment_status:null,
  event_payload:event
 },{onConflict:"stripe_event_id"});
 if(error){console.error("[AML Stripe webhook] persist:",error);return NextResponse.json({error:"Registrazione evento fallita"},{status:500})}
 // Non concede licenze automaticamente: attivazione solo dopo verifica
 // dell'evento firmato, dell'abbonamento pagato e dello studio destinatario.
 return NextResponse.json({received:true});
}
