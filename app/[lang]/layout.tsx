// // app/[lang]/layout.tsx
// import '../globals.css';
// import type { ReactNode } from 'react';
// import { Metadata } from 'next';
// import SWRegister from '../../sw-register';
// // import clsx from 'clsx';

// // const metadataMap = {
// //   en: {
// //     title: {
// //       home: 'Home',
// //       departments: 'Departments',
// //       production: 'Production',
// //       research: 'Research',
// //       direction: 'Extension',
// //     },
// //     description: {
// //       home: 'Welcome to the Field Crops Research Institute.',
// //       departments: 'Learn about the departments of FCRI.',
// //       production: 'Explore FCRI’s agricultural production.',
// //       research: 'Discover FCRI’s research programs.',
// //       direction: 'Meet the Extension and management team.',
// //     },
// //   },
// //   ar: {
// //     title: {
// //       home: 'الرئيسية',
// //       departments: 'الأقسام',
// //       production: 'الإنتاج',
// //       research: 'البحوث',
// //       direction: 'الارشاد',
// //     },
// //     description: {
// //       home: 'مرحبًا بكم في معهد بحوث المحاصيل الحقلية.',
// //       departments: 'تعرف على أقسام المعهد.',
// //       production: 'اكتشف إنتاج المعهد الزراعي.',
// //       research: 'تعرف على برامج البحوث بالمعهد.',
// //       direction: 'تعرف على الارشاد وفريق العمل.',
// //     },
// //   },
// // };
// export const metadata: Metadata = {
//   title: "QR Generator",
//   description: "Offline-first QR Code Generator",
//   manifest: "/manifest.json",
//   // themeColor: "#0f172a"
// };
// // export default async function RootLayout({children,params,}:LayoutProps<{ lang: string }>) 
// export default async function RootLayout({
//   children,
//   params,
// }: {
//   children: ReactNode;
//   // params: { lang: string };
//   params: Promise<{ lang: string }>;
// }) 
// {
//     // ✅ Await anything (Next.js now considers params "safe")
//   // await Promise.resolve();
//   const dir = (await params).lang === 'ar' ? 'rtl' : 'ltr';

//   const lang = (await params).lang; // now it's awaited correctly in a server component
//   return (
//     <html lang={lang} dir={dir} className='bg-white'>
//       <SWRegister />
//       <body>{children}</body>
//     </html>
//     // <html lang={params.lang} dir={dir}>
//     // <html lang={params.lang} dir={dir}>
//     //   <body>
//     //     {children}        
//     //   </body>
//     // </html>
//   );
// }

// export async function generateStaticParams() {
//   return [{ lang: 'en' }, { lang: 'ar' }];
// }

// // export async function generateMetadata(  {params,}: {params: { lang: string };
// // }): Promise<Metadata> {
// //   const lang = params.lang === 'ar' ? 'ar' : 'en';
// //   // const path = typeof window !== 'undefined'
// //     //  ? window.location.pathname.split('/')[2] || 'home'
// //   //   : 'home' ; 
// //     const path = 'home'; // You can customize based on route segment if needed

// //     {
// //     console.log('[Metadata] lang:', params.lang); // 🔍 confirm it's running

// //   return {
// //     title: metadataMap[lang].title[path as keyof typeof metadataMap['en']['title']],
// //     description: metadataMap[lang].description[path as keyof typeof metadataMap['en']['description']],
// //     metadataBase: new URL('https://fcri.gov.eg'), // replace with your domain
// //     alternates: {
// //       canonical: `/${lang}`,
// //     },
// //     other: {},
// //     // // ✅ Required structure for html tag customization
// //     // htmlAttributes: {
// //     //   lang: params.lang,
// //     //   dir: params.lang === 'ar' ? 'rtl' : 'ltr',
// //     // },
// //   };
// // }
// // }





// app/[lang]/layout.tsx
import "../globals.css";
import type { ReactNode } from "react";
import { Metadata } from "next";
import SWRegister from "../../sw-register";

export const metadata: Metadata = {
  title: "QR Generator",
  description: "Offline-first QR Code Generator",
  manifest: "/manifest.json", // <-- good, keep it
  // themeColor: "#0f172a", // <-- optional but recommended
};

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const lang = (await params).lang;
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <html lang={lang} dir={dir} className="bg-white">
      <head>
        {/* ✅ Ensure installability */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f172a" />
        <link rel="icon" href="/icons/maskable_icon_x192.png" />
        <link rel="apple-touch-icon" href="/icons/maskable_icon_x512.png" />
      </head>
      <body>
        <SWRegister />
        {children}
      </body>
    </html>
  );
}

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "ar" }];
}
