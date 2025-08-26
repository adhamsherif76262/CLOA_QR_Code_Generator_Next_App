// "use client"
// // import Image from "next/image";
// import { usePathname } from "next/navigation";
// // import enHome from '@/locales/en/Home_En.json';
// // import arHome from '@/locales/ar/Home_Ar.json';
// import dynamic from "next/dynamic";
// const QRBuilder = dynamic(() => import("../../components/QRBuilder"), { ssr: false });

// export default function Home({ params }: { params: { lang: "ar" | "en" } }) {
  
//     const pathname = usePathname();
//     const currentLang = pathname?.split('/')[1] === 'ar' ? 'ar' : 'en';
//     const isRTL = currentLang === 'ar';
//     // const t = currentLang === 'ar' ? arHome : enHome;
//     // const Default_Circular_Design_Items : NetworkItem[] = Department_Mission
//   return (
//     <main className="container mx-auto max-w-3xl px-3 py-6">
//       <h1 className="text-6xl text-white">{isRTL}</h1>
//       <QRBuilder lang={params.lang} />
//     </main>
//   );
// }



"use client";

import { useParams } from "next/navigation";
import dynamic from "next/dynamic";

const QRBuilder = dynamic(() => import("../../components/QRBuilder"), { ssr: false });

export default function Home() {
  // const pathname = usePathname();
  const params = useParams<{ lang: "ar" | "en" }>();

  const currentLang = params.lang === "ar" ? "ar" : "en";

  return (
    <main className="container mx-auto max-w-3xl px-3 py-6 bg-white">
      <h1 className={`text-center text-black mt-4 mb-12 ${currentLang === "ar" ? "text-4xl" : "text-5xl"}`}>{currentLang === "ar" ? "مولد رمز الQR للمعمل المركزي للزلراعة العضوية" : "CLOA QR Code Generator"}</h1>
      <QRBuilder lang={currentLang} />
    </main>
  );
}
