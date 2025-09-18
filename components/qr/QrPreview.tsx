
// {
//   "rows": [
//     {
//       "id": "279c7816-47e8-4925-8bc5-8db57c8b2441",
//       "type": "name",
//       "label": "ksuygd",
//       "value": "500"
//     },
//     {
//       "id": "6316639a-d4b1-45ee-89b4-50e7461f05da",
//       "type": "phone",
//       "label": "0017104062",
//       "value": ""
//     }
//   ],
//   "theme": {
//     "dir": "ltr",
//     "fontFamily": "serif",
//     "fontSize": 20,
//     "headerBg": "#f6f9f1",
//     "headerText": "#24290f",
//     "valueText": "#0b0f19",
//     "rowBorder": "#e5e7eb",
//     "rowGap": 8
//   }

// function convert(data: typeof input) {
//     let rows = data.data.map(d => `<tr><td>${d.name}</td></tr>`);
//     return `<table>${rows}</table>`;
// }

// console.log(convert(input));


// "use client";
// import { useSearchParams } from "next/navigation";
// import { useMemo } from "react";

// export default function QRView() {
//   const searchParams = useSearchParams();
//   const encodedDoc = searchParams.get("doc");

//   const doc = useMemo(() => {
//     if (!encodedDoc) return null;
//     try {
//       const decoded = decodeURIComponent(encodedDoc);
//       return JSON.parse(decoded);
//     } catch (err) {
//       console.error("❌ Failed to decode doc:", err);
//       return null;
//     }
//   }, [encodedDoc]);

//   if (!doc) {
//     return (
//       <p className="text-center text-red-600">
//         لا توجد بيانات، رمز QR لا يحتوي على محتوى صالح.
//       </p>
//     );
//   }

//   const { rows = [], theme = {} } = doc;

//   return (
//     <main className="container mx-auto p-4">
//       <h1 className="text-2xl mb-4">📋 بيانات المستند</h1>

//       <table
//         style={{
//           fontFamily: theme.fontFamily || "sans-serif",
//           fontSize: theme.fontSize || 16,
//           direction: theme.dir || "rtl",
//           borderCollapse: "collapse",
//           width: "100%",
//         }}
//       >
//         <thead>
//           <tr
//             style={{
//               backgroundColor: theme.headerBg || "#f3f4f6",
//               color: theme.headerText || "#111827",
//               textAlign: "left",
//             }}
//           >
//             <th className="p-2 border" style={{ borderColor: theme.rowBorder }}>
//               الحقل
//             </th>
//             <th className="p-2 border" style={{ borderColor: theme.rowBorder }}>
//               القيمة
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {rows.map((row: any) => (
//             <tr
//               key={row.id}
//               style={{
//                 borderBottom: `1px double ${theme.rowBorder || "#e5e7eb"}`,
//               }}
//             >
//               <td
//                 className="p-2"
//                 style={{
//                   color: theme.headerText,
//                   paddingBottom: theme.rowGap ?? 8,
//                 }}
//               >
//                 {row.label || row.type}
//               </td>
//               <td
//                 className="p-2"
//                 style={{
//                   color: theme.valueText || "#374151",
//                   paddingBottom: theme.rowGap ?? 8,
//                 }}
//               >
//                 {row.value || "-"}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </main>
//   );
// }





// "use client";
// import { useSearchParams } from "next/navigation";
// import Image from "next/image";
// import { useEffect, useMemo, useState } from "react";
// import { decodeDoc, getParamKey } from "../../lib/codec"; // ✅ import decoder
// import clsx from "clsx";

// export default function QRView({ lang = "ar" }: { lang?: "ar" | "en" }) {
//   const searchParams = useSearchParams();
//   const encodedDoc = searchParams.get(getParamKey()); // ✅ use the same param key ("d")
//   const [Password , setPassword] = useState<boolean>(false);
//   const [Label , setLabel] = useState<boolean>(); 
  
//   const Password_Array = ["Saad1973" , "25CLOAQR" , "Organic26"]
      
//   const doc = useMemo(() => {
//     return decodeDoc(encodedDoc); // ✅ proper decode
//   }, [encodedDoc]);
// //     const Label = useMemo(
//   //   () => Label_Array.includes(doc.theme.docTitle),
// //   [doc?.theme.docTitle]
// // );
//   const [showContent, setShowContent] = useState(false);

//   // Run timeout once when Password/Label changes
//   useEffect(() => {
//     if (Password || !Label) {
//       const timer = setTimeout(() => setShowContent(true), 1000);
//       return () => clearTimeout(timer); // cleanup
//     } else {
//       setShowContent(false);
//     }
//   }, [Password, Label]);

//     useEffect(() => {
//     if(doc?.theme.docTitle === "Product Label" || doc?.theme.docTitle === "Default Title" || doc?.theme.docTitle === " ملصق المنتج"){
//       setLabel(true);
//     }
//     else{setLabel(false)}

// }, [doc?.theme?.docTitle]);

//     // if(Label_Array.includes(doc.theme.docTitle)){setLabel(true)}
//     // else{setLabel(false)}
//     const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//       if(Password_Array.includes(event.target.value)){setPassword(true)}
//       else{setPassword(false)}
//     };

//   if (!doc) {
//     return (
//       <p className="text-center text-red-600">
//         لا توجد بيانات، رمز QR لا يحتوي على محتوى صالح.
//       </p>
//     );
//   }
// return (
//   <>
//     {
//       (!Password && Label) && (
//         <section className="sm:mt-[18rem] xxxs:mt-[15rem]">
//           <div dir="rtl"  className={clsx(
//           lang === "ar" ? 
//           "flex xs:flex-row xs:items-center xs:justify-center xxxs:flex-col xxxs:items-center xxxs:justify-between" 
//           :
//           "flex md:flex-row md:items-center md:justify-center xxxs:flex-col xxxs:items-center xxxs:justify-between"
//         )}>
//           <label htmlFor="Password" className={clsx(
//             "font-black",
//             lang === "ar" ? "xxxs:mb-5 xs:mb-0" : "xxxs:mb-5 md:mb-0"
//           )}>
//             {lang === "ar" ? "ادخل كلمة السر" : "ُEnter Password"}
//           </label>
//           <input className={clsx(
//             "border rounded-md px-1 py-1 xs:mx-5",
//             lang === "ar" ? "xxxs:mb-5 xs:mb-0" : "xxxs:mb-5 md:mb-0"
//           )} name="Password" title="Password" type="password" onChange={handlePasswordChange} placeholder={lang === "ar" ? "كلمة السر" : "Password"} />
//           <span className="text-red-700 font-black">{lang === "ar" ? "كلمة السر غير صحيحة" : "The Password Is Incorrect"} </span>
//           </div>
//         </section>
//       )
//     }
//     {  
//       showContent &&(
//         <main
//       className="mx-auto p-4 overflow-hidden"
//       dir={doc.theme.dir}
//       style={{ fontFamily: doc.theme.fontFamily, fontSize: doc.theme.fontSize }}
//     >
//       <div className="flex xs:flex-row xs:justify-between xs:items-center xxxs:flex-col-reverse xxxs:justify-between xxxs:items-center">
//         <h2 className="text-2xl xxxs:mb-8 xs:mb-0 text-center">📋 {doc.theme.dir === "rtl" ? "بيانات المستند" : "Qr Code Data"}</h2>
//         <Image className="xxxs:mb-8 xxxs:mt-4" src="/icons/CLOA_Administration_Logo_1.png" alt="Central Lab Of Organic Agriculture Administration Logo" width={200} height={200}/>
//         {/* <Image className="xxxs:mb-8 xxxs:mt-4" src="/icons/CLOA_Administration_Logo_2.png" alt="Central Lab Of Organic Agriculture Administration Logo" width={150} height={150}/> */}
//       </div>
//       <h1 className="text-4xl text-center mx-auto my-4 font-black animate-bounce">{doc.theme.docTitle}</h1>
//       <table className="w-full border-collapse mx-auto">
//       <thead
//         style={{
//           backgroundColor: doc.theme.headerBg,
//           border: `6px solid ${doc.theme.rowBorder}`,
//           color: doc.theme.headerText,
//         }}
//       >
//         <tr>
//           <th className={`px-4 py-2 ${doc.theme.dir === 'rtl' ? "text-center" : "text-center"}`}>{doc.theme.dir === "rtl" ? "البيان" : "Label"}</th>
//           <th className={`px-4 py-2 ${doc.theme.dir === 'rtl' ? "text-center" : "text-center"}`}>{doc.theme.dir === "rtl" ? "القيمة" : "Value"}</th>
//         </tr>
//       </thead>

//       <tbody className="">
//         {doc.rows
//           .filter((r) => r.value?.trim() !== "") // ✅ ignore empty values
//           .map((r ) => (
//             <tr
//               key={r.id}
//               style={{
//                 border: `6px solid ${doc.theme.rowBorder}`,
//               }}
//             >
//               <td className="px-4 py-2 font-black text-center"
//                 style={{
//                   border: `6px solid ${doc.theme.rowBorder}`,
//                   // paddingBottom : "30px"
//                   paddingBottom : `${doc.theme.rowGap}px`,
//                   paddingTop : `${doc.theme.rowGap}px`,
//                 }}>
//                 {r.type}
//               </td>
//               <td
//                 className="px-4 py-2 text-center break-all"
//                 style={{ color: doc.theme.valueText , paddingBottom : `${doc.theme.rowGap}px`,  paddingTop : `${doc.theme.rowGap}px`}}
//               >
//                 {r.value}
//               </td>
//             </tr>
//           ))}
//       </tbody>
//       </table>
//     </main>
//       )
//     }
//   </>
// );
// }








// "use client";
// import { useSearchParams } from "next/navigation";
// import Image from "next/image";
// import { useEffect, useMemo, useState } from "react";
// import { decodeDoc, getParamKey } from "../../lib/codec"; // ✅ decoder
// import clsx from "clsx";

// export default function QRView({ lang = "ar" }: { lang?: "ar" | "en" }) {
//   const searchParams = useSearchParams();
//   const encodedDoc = searchParams.get(getParamKey());
//   const [Password, setPassword] = useState<boolean>(false);
//   const [Label, setLabel] = useState<boolean>();
//   const [showContent, setShowContent] = useState(false);

//   const Password_Array = ["Saad1973", "25CLOAQR", "Organic26"];

//   const doc = useMemo(() => decodeDoc(encodedDoc), [encodedDoc]);

//   // determine if label page
//   useEffect(() => {
//     if (
//       doc?.theme?.docTitle === "Product Label" ||
//       doc?.theme?.docTitle === "Default Title" ||
//       doc?.theme?.docTitle === " ملصق المنتج"
//     ) {
//       setLabel(true);
//     } else {
//       setLabel(false);
//     }
//   }, [doc?.theme?.docTitle]);

//   // delayed reveal if password ok or label not required
//   useEffect(() => {
//     if (Password || !Label) {
//       const timer = setTimeout(() => setShowContent(true), 1000);
//       return () => clearTimeout(timer);
//     } else {
//       setShowContent(false);
//     }
//   }, [Password, Label]);

//   const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (Password_Array.includes(event.target.value)) setPassword(true);
//     else setPassword(false);
//   };

//   if (!doc) {
//     return (
//       <p className="text-center text-red-600">
//         لا توجد بيانات، رمز QR لا يحتوي على محتوى صالح.
//       </p>
//     );
//   }

//   // ==== Expiry handling ====
//   const isExpirable = !!doc.expirable;
//   const expiresAt = doc.expiresAt ? new Date(doc.expiresAt) : null;
//   const now = new Date();

//   let forceExpired = false;
//   try {
//     forceExpired = searchParams.get("forceExpired") === "true";
//   } catch {
//     forceExpired = false;
//   }

//   const expired =
//     forceExpired || (expiresAt ? expiresAt.getTime() < now.getTime() : false);

//   const expiryLabel = expiresAt
//     ? expiresAt.toLocaleString(doc.theme.dir === "rtl" ? "ar-EG" : undefined)
//     : "";

//   return (
//     <>
//       {/* password gate */}
//       {!Password && Label && (
//         <section className="sm:mt-[18rem] xxxs:mt-[15rem]">
//           <div
//             dir="rtl"
//             className={clsx(
//               lang === "ar"
//                 ? "flex xs:flex-row xs:items-center xs:justify-center xxxs:flex-col xxxs:items-center xxxs:justify-between"
//                 : "flex md:flex-row md:items-center md:justify-center xxxs:flex-col xxxs:items-center xxxs:justify-between"
//             )}
//           >
//             <label
//               htmlFor="Password"
//               className={clsx(
//                 "font-black",
//                 lang === "ar" ? "xxxs:mb-5 xs:mb-0" : "xxxs:mb-5 md:mb-0"
//               )}
//             >
//               {lang === "ar" ? "ادخل كلمة السر" : "Enter Password"}
//             </label>
//             <input
//               className={clsx(
//                 "border rounded-md px-1 py-1 xs:mx-5",
//                 lang === "ar" ? "xxxs:mb-5 xs:mb-0" : "xxxs:mb-5 md:mb-0"
//               )}
//               name="Password"
//               title="Password"
//               type="password"
//               onChange={handlePasswordChange}
//               placeholder={lang === "ar" ? "كلمة السر" : "Password"}
//             />
//             <span className="text-red-700 font-black">
//               {lang === "ar"
//                 ? "كلمة السر غير صحيحة"
//                 : "The Password Is Incorrect"}
//             </span>
//           </div>
//         </section>
//       )}

//       {/* main content */}
//       {showContent && (
//         <main
//           className="mx-auto p-4 overflow-hidden"
//           dir={doc.theme.dir}
//           style={{
//             fontFamily: doc.theme.fontFamily,
//             fontSize: doc.theme.fontSize,
//           }}
//         >
//           <div className="flex xs:flex-row xs:justify-between xs:items-center xxxs:flex-col-reverse xxxs:justify-between xxxs:items-center">
//             <h2 className="text-2xl xxxs:mb-8 xs:mb-0 text-center">
//               📋 {doc.theme.dir === "rtl" ? "بيانات المستند" : "Qr Code Data"}
//             </h2>
//             <Image
//               className="xxxs:mb-8 xxxs:mt-4"
//               src="/icons/CLOA_Administration_Logo_1.png"
//               alt="Central Lab Of Organic Agriculture Administration Logo"
//               width={200}
//               height={200}
//             />
//           </div>

//           <h1 className="text-4xl text-center mx-auto my-4 font-black animate-bounce">
//             {doc.theme.docTitle}
//           </h1>

//           {/* expiry messages */}
//           {isExpirable && !expired && expiresAt && (
//             <div className="text-center mb-4 text-sm text-emerald-700">
//               {doc.theme.dir === "rtl"
//                 ? `صالح حتى: ${expiryLabel}`
//                 : `Valid until: ${expiryLabel}`}
//             </div>
//           )}

//           {expired ? (
//             <div className="mx-auto mt-6 max-w-2xl p-6 text-center border rounded-lg bg-yellow-50">
//               <p className="text-lg font-bold text-red-600">
//                 {doc.theme.dir === "rtl"
//                   ? `⚠️ انتهت صلاحية رمز QR هذا (${expiryLabel})`
//                   : `⚠️ This QR code has expired (${expiryLabel})`}
//               </p>
//               <p className="mt-3 text-sm text-gray-600">
//                 {doc.theme.dir === "rtl"
//                   ? "لا يمكن عرض البيانات لأن الرمز منتهي الصلاحية."
//                   : "Data is not shown because this QR is expired."}
//               </p>
//             </div>
//           ) : (
//             <table className="w-full border-collapse mx-auto">
//               <thead
//                 style={{
//                   backgroundColor: doc.theme.headerBg,
//                   border: `6px solid ${doc.theme.rowBorder}`,
//                   color: doc.theme.headerText,
//                 }}
//               >
//                 <tr>
//                   <th className="px-4 py-2 text-center">
//                     {doc.theme.dir === "rtl" ? "البيان" : "Label"}
//                   </th>
//                   <th className="px-4 py-2 text-center">
//                     {doc.theme.dir === "rtl" ? "القيمة" : "Value"}
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {doc.rows
//                   .filter((r) => r.value?.trim() !== "")
//                   .map((r) => (
//                     <tr
//                       key={r.id}
//                       style={{
//                         border: `6px solid ${doc.theme.rowBorder}`,
//                       }}
//                     >
//                       <td
//                         className="px-4 py-2 font-black text-center"
//                         style={{
//                           border: `6px solid ${doc.theme.rowBorder}`,
//                           paddingBottom: `${doc.theme.rowGap}px`,
//                           paddingTop: `${doc.theme.rowGap}px`,
//                         }}
//                       >
//                         {r.type}
//                       </td>
//                       <td
//                         className="px-4 py-2 text-center break-all"
//                         style={{
//                           color: doc.theme.valueText,
//                           paddingBottom: `${doc.theme.rowGap}px`,
//                           paddingTop: `${doc.theme.rowGap}px`,
//                         }}
//                       >
//                         {r.value}
//                       </td>
//                     </tr>
//                   ))}
//               </tbody>
//             </table>
//           )}
//         </main>
//       )}
//     </>
//   );
// }















"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import clsx from "clsx";
import { QRDocument } from "../../types/qr";

interface QRPreviewProps {
  doc?: QRDocument;
  lang?: "ar" | "en";
}

export default function QRView({ doc, lang = "ar" }:QRPreviewProps) {
  const searchParams = useSearchParams();
  const [Password, setPassword] = useState<boolean>(false);
  const [Label, setLabel] = useState<boolean>(false);
  const [showContent, setShowContent] = useState(false);
  
  const Password_Array = ["Saad1973", "25CLOAQR", "Organic26"];
  
  // const params = useParams<{ id: string }>();
  // const [doc, setDoc] = useState<QRDocument | null>(null);
  // // 🔹 fetch JSON by id
  // useEffect(() => {
  //   async function fetchDoc() {
  //     try {
  //       const res = await fetch(`/data/${params.id}.json`, { cache: "no-store" });
  //       if (res.ok) {
  //         const data = (await res.json()) as QRDocument;
  //         setDoc(data);
  //       } else {
  //         setDoc(null);
  //       }
  //     } catch {
  //       setDoc(null);
  //     }
  //   }
  //   fetchDoc();
  // }, [params.id]);


  // determine if label page
  useEffect(() => {
    if (
      doc?.theme?.docTitle === "Product Label" ||
      doc?.theme?.docTitle === "Default Title" ||
      doc?.theme?.docTitle === " ملصق المنتج"
    ) {
      setLabel(true);
    } else {
      setLabel(false);
    }
  }, [doc?.theme?.docTitle]);

  // delayed reveal if password ok or label not required
  useEffect(() => {
    if (Password || !Label) {
      const timer = setTimeout(() => setShowContent(true), 1000);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [Password, Label]);

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (Password_Array.includes(event.target.value)) setPassword(true);
    else setPassword(false);
  };

  if (!doc) {
    return (
      <p className="text-center text-red-600">
        {lang === "ar"
          ? "لا توجد بيانات، رمز QR لا يحتوي على محتوى صالح."
          : "No data, QR code does not contain valid content."}
      </p>
    );
  }

  // ==== Expiry handling ====
  const isExpirable = !!doc.expirable;
  const expiresAt = doc.expiresAt ? new Date(doc.expiresAt) : null;
  const now = new Date();

  let forceExpired = false;
  try {
    forceExpired = searchParams.get("forceExpired") === "true";
  } catch {
    forceExpired = false;
  }

  const expired =
    forceExpired || (expiresAt ? expiresAt.getTime() < now.getTime() : false);

  const expiryLabel = expiresAt
    ? expiresAt.toLocaleString(doc.theme.dir === "rtl" ? "ar-EG" : undefined)
    : "";

  return (
    <>
      {/* password gate */}
      {!Password && Label && (
        <section className="sm:mt-[18rem] xxxs:mt-[15rem]">
          <div
            dir="rtl"
            className={clsx(
              lang === "ar"
                ? "flex xs:flex-row xs:items-center xs:justify-center xxxs:flex-col xxxs:items-center xxxs:justify-between"
                : "flex md:flex-row md:items-center md:justify-center xxxs:flex-col xxxs:items-center xxxs:justify-between"
            )}
          >
            <label
              htmlFor="Password"
              className={clsx(
                "font-black",
                lang === "ar" ? "xxxs:mb-5 xs:mb-0" : "xxxs:mb-5 md:mb-0"
              )}
            >
              {lang === "ar" ? "ادخل كلمة السر" : "Enter Password"}
            </label>
            <input
              className={clsx(
                "border rounded-md px-1 py-1 xs:mx-5",
                lang === "ar" ? "xxxs:mb-5 xs:mb-0" : "xxxs:mb-5 md:mb-0"
              )}
              name="Password"
              title="Password"
              type="password"
              onChange={handlePasswordChange}
              placeholder={lang === "ar" ? "كلمة السر" : "Password"}
            />
            <span className="text-red-700 font-black">
              {lang === "ar"
                ? "كلمة السر غير صحيحة"
                : "The Password Is Incorrect"}
            </span>
          </div>
        </section>
      )}

      {/* main content */}
      {showContent && (
        <main
          className="mx-auto p-4 overflow-hidden"
          dir={doc.theme.dir}
          style={{
            fontFamily: doc.theme.fontFamily,
            fontSize: doc.theme.fontSize,
          }}
        >
          <div className="flex xs:flex-row xs:justify-between xs:items-center xxxs:flex-col-reverse xxxs:justify-between xxxs:items-center">
            <h2 className="text-2xl xxxs:mb-8 xs:mb-0 text-center">
              📋 {doc.theme.dir === "rtl" ? "بيانات المستند" : "Qr Code Data"}
            </h2>
            <Image
              className="xxxs:mb-8 xxxs:mt-4"
              src="/icons/CLOA_Administration_Logo_1.png"
              alt="Central Lab Of Organic Agriculture Administration Logo"
              width={200}
              height={200}
            />
          </div>

          <h1 className="text-4xl text-center mx-auto my-4 font-black animate-bounce">
            {doc.theme.docTitle}
          </h1>

          {/* expiry messages */}
          {isExpirable && !expired && expiresAt && (
            <div className="text-center mb-4 text-sm text-emerald-700">
              {doc.theme.dir === "rtl"
                ? `صالح حتى: ${expiryLabel}`
                : `Valid until: ${expiryLabel}`}
            </div>
          )}

          {expired ? (
            <div className="mx-auto mt-6 max-w-2xl p-6 text-center border rounded-lg bg-yellow-50">
              <p className="text-lg font-bold text-red-600">
                {doc.theme.dir === "rtl"
                  ? `⚠️ انتهت صلاحية رمز QR هذا (${expiryLabel})`
                  : `⚠️ This QR code has expired (${expiryLabel})`}
              </p>
              <p className="mt-3 text-sm text-gray-600">
                {doc.theme.dir === "rtl"
                  ? "لا يمكن عرض البيانات لأن الرمز منتهي الصلاحية."
                  : "Data is not shown because this QR is expired."}
              </p>
            </div>
          ) : (
            <table className="w-full border-collapse mx-auto">
              <thead
                style={{
                  backgroundColor: doc.theme.headerBg,
                  border: `6px solid ${doc.theme.rowBorder}`,
                  color: doc.theme.headerText,
                }}
              >
                <tr>
                  <th className="px-4 py-2 text-center">
                    {doc.theme.dir === "rtl" ? "البيان" : "Label"}
                  </th>
                  <th className="px-4 py-2 text-center">
                    {doc.theme.dir === "rtl" ? "القيمة" : "Value"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {doc.rows
                  .filter((r) => r.value?.trim() !== "")
                  .map((r) => (
                    <tr
                      key={r.id}
                      style={{
                        border: `6px solid ${doc.theme.rowBorder}`,
                      }}
                    >
                      <td
                        className="px-4 py-2 font-black text-center"
                        style={{
                          border: `6px solid ${doc.theme.rowBorder}`,
                          paddingBottom: `${doc.theme.rowGap}px`,
                          paddingTop: `${doc.theme.rowGap}px`,
                        }}
                      >
                        {r.type}
                      </td>
                      <td
                        className="px-4 py-2 text-center break-all"
                        style={{
                          color: doc.theme.valueText,
                          paddingBottom: `${doc.theme.rowGap}px`,
                          paddingTop: `${doc.theme.rowGap}px`,
                        }}
                      >
                        {r.value}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </main>
      )}
    </>
  );
}
