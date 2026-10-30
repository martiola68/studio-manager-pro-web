// Listino AML approvato per il lancio: IVA non applicata (regime forfettario).
// I prezzi di produzione sono sempre validati sul server tramite Price ID Stripe.
export const amlPlans = [
  {id:"starter",name:"Starter",maxPractices:50,annualEur:250,features:["Fino a 50 pratiche AML","AV1, AV2, AV4 e fascicoli","Alert e scadenze","Utenti e Microsoft 365"]},
  {id:"professional",name:"Professional",maxPractices:200,annualEur:550,features:["Fino a 200 pratiche AML","AV1, AV2, AV4 e fascicoli","Alert e scadenze","Utenti e Microsoft 365"]},
  {id:"business",name:"Business",maxPractices:500,annualEur:950,features:["Fino a 500 pratiche AML","AV1, AV2, AV4 e fascicoli","Alert e scadenze","Utenti e Microsoft 365"]},
] as const;
export type AmlPlanId=(typeof amlPlans)[number]["id"];
export function getAmlPlan(id:string){return amlPlans.find(p=>p.id===id);}
export function getAmlPriceId(id:AmlPlanId){
 const vars:Record<AmlPlanId,string|undefined>={
 starter:process.env.STRIPE_AML_PRICE_STARTER,
 professional:process.env.STRIPE_AML_PRICE_PROFESSIONAL,
 business:process.env.STRIPE_AML_PRICE_BUSINESS
 };
 return vars[id];
}
