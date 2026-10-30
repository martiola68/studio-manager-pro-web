import {NextResponse} from "next/server";
import Stripe from "stripe";
import {getAmlPlan,getAmlPriceId,type AmlPlanId} from "../../../../lib/aml-pricing";
export async function POST(request:Request){
 try {
  if(process.env.AML_SALES_ENABLED!=="true") return NextResponse.json({error:"Le vendite AML non sono ancora aperte: listino e attivazione in fase di collaudo."},{status:503});
  if(!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_AML_WEBHOOK_SECRET) return NextResponse.json({error:"Pagamento AML non ancora configurato"}, {status:503});
  const {plan,email,studioName,vatNumber}=await request.json();
  if(typeof plan!=="string"||!getAmlPlan(plan))return NextResponse.json({error:"Piano non valido"},{status:400});
  if(typeof email!=="string"||!/^\S+@\S+\.\S+$/.test(email)||email.length>254)return NextResponse.json({error:"Email non valida"},{status:400});
  if(typeof studioName!=="string"||studioName.trim().length<3||studioName.length>180)return NextResponse.json({error:"Indicare la denominazione dello studio"},{status:400});
  const price=getAmlPriceId(plan as AmlPlanId);
  if(!price)return NextResponse.json({error:"Piano non ancora disponibile per l'acquisto"},{status:503});
  const stripe=new Stripe(process.env.STRIPE_SECRET_KEY);
  const safeVat=typeof vatNumber==="string"?vatNumber.trim().slice(0,32):"";
  const site=process.env.NEXT_PUBLIC_SITE_URL||"https://studiomanagerpro.it";
  const session=await stripe.checkout.sessions.create({
   mode:"subscription",
   line_items:[{price,quantity:1}],
   customer_email:email.toLowerCase().trim(),
   billing_address_collection:"required",
   tax_id_collection:{enabled:true},
   metadata:{product:"studio-manager-aml",plan,studioName:studioName.trim(),vatNumber:safeVat},
   subscription_data:{metadata:{product:"studio-manager-aml",plan,studioName:studioName.trim()}},
   success_url:site+"/aml/esito?session_id={CHECKOUT_SESSION_ID}",
   cancel_url:site+"/aml#prezzi",
  });
  if(!session.url)throw new Error("Checkout non disponibile");
  return NextResponse.json({url:session.url});
 }catch(err){console.error("[AML Checkout]",err);return NextResponse.json({error:"Impossibile iniziare il pagamento. Riprova."},{status:500});}
}
