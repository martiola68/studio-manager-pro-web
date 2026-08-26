import { redirect } from "next/navigation";

export default function OffertePage() {
  const target =
    process.env.NEXT_PUBLIC_SUBSCRIPTION_URL ||
    "https://studio-manager-public.vercel.app/attivazione-studio";

  redirect(target);
}
