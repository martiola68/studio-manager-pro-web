const APK_URL = "https://github.com/martiola68/studio-manager-pro/releases/download/android-latest/Studio-Manager-Pro-Android.apk";

export async function GET() {
  const upstream = await fetch(APK_URL, {
    cache: "no-store",
    redirect: "follow",
  });

  if (!upstream.ok || !upstream.body) {
    return new Response("Download temporaneamente non disponibile.", { status: 502 });
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.android.package-archive",
      "Content-Disposition": 'attachment; filename="Studio-Manager-Pro-Android.apk"',
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
