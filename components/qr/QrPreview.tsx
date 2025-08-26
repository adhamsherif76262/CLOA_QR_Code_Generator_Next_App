"use client";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useMemo } from "react";
import { decodeDoc, getParamKey } from "../../lib/codec"; // ✅ import decoder

export default function QRView() {
  const searchParams = useSearchParams();
  const encodedDoc = searchParams.get(getParamKey()); // ✅ use the same param key ("d")

  const doc = useMemo(() => {
    return decodeDoc(encodedDoc); // ✅ proper decode
  }, [encodedDoc]);

  if (!doc) {
    return (
      <p className="text-center text-red-600">
        لا توجد بيانات، رمز QR لا يحتوي على محتوى صالح.
      </p>
    );
  }

return (
    <main
      className="mx-auto p-4 xl:max-w-[95rem"
      dir={doc.theme.dir}
      style={{ fontFamily: doc.theme.fontFamily, fontSize: doc.theme.fontSize }}
    >
      <div className="flex xs:flex-row xs:justify-between xs:items-center xxxs:flex-col-reverse xxxs:justify-between xxxs:items-center">
        <h1 className="text-2xl xxxs:mb-8 xs:mb-0 text-center">📋 {doc.theme.dir === "rtl" ? "بيانات المستند" : "Qr Code Data"}</h1>
        <Image className="xxxs:mb-8 xxxs:mt-4" src="/icons/CLOA_Administration_Logo_1.png" alt="Central Lab Of Organic Agriculture Administration Logo" width={200} height={200}/>
        {/* <Image className="xxxs:mb-8 xxxs:mt-4" src="/icons/CLOA_Administration_Logo_2.png" alt="Central Lab Of Organic Agriculture Administration Logo" width={150} height={150}/> */}
      </div>
      <table className="w-full border-collapse mx-auto">
      <thead
        style={{
          backgroundColor: doc.theme.headerBg,
          border: `10px double ${doc.theme.rowBorder}`,
          color: doc.theme.headerText,
        }}
      >
        <tr>
          <th className={`px-4 py-2 ${doc.theme.dir === 'rtl' ? "text-center" : "text-center"}`}>{doc.theme.dir === "rtl" ? "البيان" : "Label"}</th>
          <th className={`px-4 py-2 ${doc.theme.dir === 'rtl' ? "text-center" : "text-center"}`}>{doc.theme.dir === "rtl" ? "القيمة" : "Value"}</th>
        </tr>
      </thead>

      <tbody className="">
        {doc.rows
          .filter((r) => r.value?.trim() !== "") // ✅ ignore empty values
          .map((r ) => (
            <tr
              key={r.id}
              style={{
                border: `10px double ${doc.theme.rowBorder}`,
              }}
            >
              <td className="px-4 py-2 font-black text-center"
                style={{
                  border: `10px double ${doc.theme.rowBorder}`,
                  // paddingBottom : "30px"
                  paddingBottom : `${doc.theme.rowGap}px`,
                  paddingTop : `${doc.theme.rowGap}px`,
                }}>
                {r.type}
              </td>
              <td
                className="px-4 py-2 text-center break-all"
                style={{ color: doc.theme.valueText , paddingBottom : `${doc.theme.rowGap}px`,  paddingTop : `${doc.theme.rowGap}px`}}
              >
                {r.value}
              </td>
            </tr>
          ))}
      </tbody>
      </table>
    </main>
);

}


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
