  // src/components/QRBuilder.tsx
  "use client";

  import { useMemo, useState } from "react";
  import { v4 as uuid } from "uuid";
  // import clsx from "classnames";
  import { qrToDataUrl } from "../lib/qr";
  import { buildViewerUrl } from "../lib/codec";
  import type { QRDocument, TableRow, TableTheme, RowTypeAr , RowTypeEn } from "../types/qr";
  import { usePersistentState } from "../hooks/usePersistentState";
  import { validateRows } from "../lib/validate";
  import LangSwitcher from "./layout/LangSwitcher";

  const DEFAULT_THEME: TableTheme = {
    dir: "rtl",
    fontFamily: "sans",
    fontSize: 16,
    headerBg: "#f1f5f9",
    headerText: "#0f172a",
    valueText: "#0b0f19",
    rowBorder: "#e5e7eb",
    rowGap: 8,
  };

  function newRow(): TableRow {
    return {
      id: uuid(),
      type: "custom",
      // label: "حقل",
      value: "",
    };
  }

  export default function QRBuilder({ lang = "ar" }: { lang?: "ar" | "en" }) {
    const [rows, setRows, readyRows] = usePersistentState<TableRow[]>("qr.rows", [newRow()]);
    const [theme, setTheme, readyTheme] = usePersistentState<TableTheme>("qr.theme", { ...DEFAULT_THEME, dir: lang === "ar" ? "rtl" : "ltr" });
    const [qr100, setQr100] = useState<string>("");
    const [qr250, setQr250] = useState<string>("");
    
  // const Table_Types: { value: string}[] = [

  // { value: lang === "ar" ? "جهات المطابقة Q" : "Conformity Authorities Q" },
  // { value: lang === "ar" ? "مكاتب علمية S" : "Scientific Offices S" },
  // { value: lang === "ar" ? "مكاتب إستشارية T " : "Consulting Offices T" },
  // { value: lang === "ar" ? "مزرعة R" : "Farm R" },
  // { value: lang === "ar" ? "مدخل أعلاف محلي O" : "Local Feed Input O" },
  // { value: lang === "ar" ? "مدخل أعلاف مستورد S" : "Imported Feed Input S" },
  // { value: lang === "ar" ? "تسجيل مستودع D" : "Warehouse Registration D" },
  // { value: lang === "ar" ? " مدخل وقاية مستورد M" : "Imported Protection Input M" },
  // { value: lang === "ar" ? "مدخل تغذية مستورد K" : "Imported Nutrition Input K" },
  // { value: lang === "ar" ? "الشركات المستوردة B" : "Importing Companies B" },
  // { value: lang === "ar" ? "سجل الشركات المصدرة C" : "Exporting Companies Register C" },
  // { value: lang === "ar" ? " مدخل وقاية محلي G" : "Local Protection Input G" },
  // { value: lang === "ar" ? " مدخل تغذية محلي E" : "Local Nutrition Input E" },
  // { value: lang === "ar" ? "الشركات المحلية A" : "Local Companies A" },
  // ];

  // const OPTIONS: { value: string}[] = [
  //   { value: lang === "ar" ? "" : ""},
  //   { value: lang === "ar" ? "" : ""},
  //   { value: lang === "ar" ? "" : ""},
  //   { value: lang === "ar" ? "" : ""},
  //   { value: lang === "ar" ? "" : ""},
  //   { value: lang === "ar" ? "" : ""},
  //   { value: lang === "ar" ? "" : ""},
  //   { value: lang === "ar" ? "" : ""},
  //   { value: lang === "ar" ? "" : ""},
  //   { value: lang === "ar" ? "" : ""},
  //   { value: lang === "ar" ? "" : ""},
  //   { value: lang === "ar" ? "" : ""},
  //   { value: lang === "ar" ? "" : ""},
  //   { value: lang === "ar" ? "" : ""},
  //   { value: lang === "ar" ? "" : ""},

  //   // { value: lang === "ar" ? "مخصص" : "custom"},
  //   // { value: lang === "ar" ? "الأسم" : "name"},
  //   // { value: lang === "ar" ? "الهاتف" : "phone"},
  //   // { value: lang === "ar" ? "البريد" : "email"},
  //   // { value: lang === "ar" ? "الموقع" : "website"},
  //   // { value: lang === "ar" ? "العنوان" : "address"},
  // ];
    

  // 🔹 Color map supports both AR + EN values
  const colorMap: Record<string, string> = {
    "جهات المطابقة Q": "#000969", "Conformity Authorities Q": "#000969",
    "مكاتب علمية S": "#8300BF", "Scientific Offices S": "#8300BF",
    "مكاتب إستشارية T": "#BF3900", "Consulting Offices T": "#BF3900",
    "مزرعة R":"#00BF09", "Farm R": "#00BF09",
    "مدخل أعلاف محلي O":  "#BAB6B3", "Local Feed Input O": "#BAB6B3",
    "مدخل أعلاف مستورد S":"#B8E4FF", "Imported Feed Input S": "#B8E4FF",
    // "مدخل أعلاف مستورد S":"#6592BF", "Imported Feed Input S": "#6592BF",
    "تسجيل مستودع D":    "#95A34D", "Warehouse Registration D": "#95A34D",
    "مدخل وقاية مستورد M":"#24EEFF", "Imported Protection Input M": "#24EEFF",
    "مدخل تغذية مستورد K": "#B0C0FF", "Imported Nutrition Input K": "#B0C0FF",
    "الشركات المستوردة B": "#4866D4", "Importing Companies B": "#4866D4",
    "سجل الشركات المصدرة C": "#F52A84", "Exporting Companies Register C": "#F52A84",
    "مدخل وقاية محلي G": "#FFEBD4", "Local Protection Input G": "#FFEBD4",
    "مدخل تغذية محلي E": "#C96F00", "Local Nutrition Input E": "#C96F00",
    "الشركات المحلية A": "#FCFF75", "Local Companies A": "#FCFF75",
  };

    // 🔹 Table types (for table header color switching)
    const Table_Types: { value: string }[] = [
      { value: lang === "ar" ? "جهات المطابقة Q" : "Conformity Authorities Q" },
      { value: lang === "ar" ? "مكاتب علمية S" : "Scientific Offices S" },
      { value: lang === "ar" ? "مكاتب إستشارية T" : "Consulting Offices T" },
      { value: lang === "ar" ? "مزرعة R" : "Farm R" },
      { value: lang === "ar" ? "مدخل أعلاف محلي O" : "Local Feed Input O" },
      { value: lang === "ar" ? "مدخل أعلاف مستورد S" : "Imported Feed Input S" },
      { value: lang === "ar" ? "تسجيل مستودع D" : "Warehouse Registration D" },
      { value: lang === "ar" ? "مدخل وقاية مستورد M" : "Imported Protection Input M" },
      { value: lang === "ar" ? "مدخل تغذية مستورد K" : "Imported Nutrition Input K" },
      { value: lang === "ar" ? "الشركات المستوردة B" : "Importing Companies B" },
      { value: lang === "ar" ? "سجل الشركات المصدرة C" : "Exporting Companies Register C" },
      { value: lang === "ar" ? "مدخل وقاية محلي G" : "Local Protection Input G" },
      { value: lang === "ar" ? "مدخل تغذية محلي E" : "Local Nutrition Input E" },
      { value: lang === "ar" ? "الشركات المحلية A" : "Local Companies A" },
    ];

    // 🔹 Dropdown row options
    const OPTIONS : string[] = lang === "ar" ?    
    [
        "اختر نوع البيان",
        "اسم المادة العلمي",
        "اسم المادة التجاري",
        "اسم الشركة المنتجة",
        "اسم الشركة المصدرة",
        "اسم الشركة المستوردة",
        "عنوان الشركة المنتجة",
        "عنوان الشركة المصدرة",
        "عنوان الشركة المستوردة",
        "اسم العميل",
        "رقم التسجيل لدي الادارة",
        "نوع المركب",
        "نوع النشاط",
        "عنوان الوحدة",
        "اسم صاحب الوحدة",
        "كود الملف",
      ] 
      :
      [
        "Select Row Type",
        "Scientific Material Name",
        "Commercial Material Name",
        "Producing Company Name",
        "Exporting Company Name",
        "Importing Company Name",
        "Producing Company Address",
        "Exporting Company Address",
        "Importing Company Address",
        "Client Name",
        "Registration Number at the Administration",
        "Compound Type",
        "Activity Type",
        "Unit Address",
        "Unit Owner Name",
        "File Code",
      ];

  function resetForm(newLang: "ar" | "en") {
    setRows([newRow()]);
    setTheme({ ...DEFAULT_THEME, dir: newLang === "ar" ? "rtl" : "ltr" });
    setQr100("");
    setQr250("");
  }
    const ready = readyRows && readyTheme;
  //   if (!ready) return <div className="p-4 text-sm text-neutral-500">جارٍ التحميل…</div>;

  //   const doc: QRDocument = useMemo(() => ({ rows, theme }), [rows, theme]);

  //   const viewerPath = lang === "ar" ? "/ar/view" : "/en/view";
  //   const viewerUrl = useMemo(() => buildViewerUrl(viewerPath, doc), [viewerPath, doc]);

  // const viewerUrl = useMemo(() => {
      //   const viewerPath = lang === "ar" ? "/ar/view" : "/en/view";
      //   return buildViewerUrl(viewerPath, doc);
      // }, [lang, doc]);
      const doc: QRDocument = useMemo(() => ({ rows, theme }), [rows, theme]);    
      const viewerUrl = buildViewerUrl("/view", doc); // this ensures ?d=xxxx

  if (!ready) {
    return <div className="p-4 text-sm text-neutral-500">جارٍ التحميل…</div>;
  }

    function addRow() {
      setRows((r) => [...r, newRow()]);
    }
    function removeRow(id: string) {
      setRows((r) => (r.length > 1 ? r.filter((x) => x.id !== id) : r));
    }
    function move(id: string, dir: -1 | 1) {
      setRows((r) => {
        const idx = r.findIndex((x) => x.id === id);
        if (idx < 0) return r;
        const j = idx + dir;
        if (j < 0 || j >= r.length) return r;
        const copy = r.slice();
        const [item] = copy.splice(idx, 1);
        copy.splice(j, 0, item);
        return copy;
      });
    }

    const issues = validateRows(rows);
    const urlLength = viewerUrl.length;
    let sizeHint: { tone: "ok" | "warn" | "bad"; text: string } = { tone: "ok", text: lang === "ar" ? "الحجم ممتاز"  : "Perfect Size"};
    if (urlLength > 1800) sizeHint = { tone: "bad", text: lang === "ar" ? "الرابط كبير جدًا — قد يصعب مسح QR" : "The Link Length is too large - The QR Code maybe difficult to scan" };
    else if (urlLength > 1200) sizeHint = { tone: "warn", text: lang === "ar" ? "الرابط كبير — يفضل تقليل البيانات" : "The Link Length is a bit large - It is Advisable to reduce the data Size" };

    async function generate() {
      if (issues.length > 0){
          if(lang === "ar"){return alert("يرجى تصحيح الأخطاء قبل التوليد")}
          else{return alert("Please Revise Your Data Before QR Code Generation")}
      };
      const url = viewerUrl;
      const small = await qrToDataUrl(url, 100);
      const big = await qrToDataUrl(url, 250);
      setQr100(small);
      setQr250(big);
    }

    function download(uri: string, name: string) {
      const a = document.createElement("a");
      a.href = uri;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }

    return (
      <div className="flex flex-col gap-6 bg-white">
        <section className="grid gap-4">
          <header className="grid md:grid-cols-4 xxxs:grid-cols-2 sm:gap-x-8 gap-8 mb-8">
            <h2 className="text-xl font-semibold">{lang === "ar" ? "إعداد البيانات" : "Data Preparation"}</h2>
            <button onClick={()=>{
                setRows([newRow()]);
                setTheme({ ...DEFAULT_THEME, dir: lang === "ar" ? "rtl" : "ltr" });
                setQr250("");
                setQr100("");
            }} className="px-3 py-1.5 border rounded-lg bg-black text-white hover:opacity-90 hover:cursor-pointer hover:bg-white hover:text-black hover:border-black">
            {lang === "ar" ? "مسح البيانات" : "Reset Form"}
            </button>
            <LangSwitcher lang={lang} onSwitch={resetForm}/>
            <button onClick={addRow} className="px-3 py-1.5 border rounded-lg bg-black text-white hover:opacity-90 hover:cursor-pointer hover:bg-white hover:text-black hover:border-black">
              {lang === "ar" ? "إضافة صف +" : "Add Row +"}
            </button>
          </header>

          {/* 🔹 Table Type Selector */}
          <label className="flex xs:flex-row xxxs:justify-center items-center gap-2 xxxs:flex-col mb-8">
            {lang === "ar" ? "نوع الجدول:" : "Table Type:"}
            <select
              className="border rounded-md px-2 py-1"
              onChange={(e) => {
                const selected = e.target.value;
                setTheme({
                  ...theme,
                  headerBg: colorMap[selected] || DEFAULT_THEME.headerBg,
                });
              }}
            >
              <option value="" className="font-black">{lang === "ar" ? "اختر نوع الجدول" : "Select a Table Type"}</option>
              {Table_Types.map((opt) => (
                <option key={opt.value} value={opt.value} className="font-black">
                  {opt.value}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-3">
            {rows.map((row) => (
              <div key={row.id} className="grid xxxs:grid-cols-1 xxxs:grid-rows-3 sm:grid-rows-1 sm:grid-cols-[auto_1fr_auto_auto] items-center gap-x-2 gap-y-12">
                <select
                  className="border rounded-md px-2 py-1 hover:cursor-pointer"
                  value={row.type}
                  title="Select"
                  onChange={(e) => {
                    const type = lang === "ar" ? e.target.value as RowTypeAr : e.target.value as RowTypeEn
                    setRows((r) => r.map((x) => (x.id === row.id ? { ...x, type} : x)));
                    // setRows((r) => r.map((x) => (x.id === row.id ? { ...x, type, label: x.label } : x)));
                  }}
                >
                  {OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="hover:cursor-pointer font-black hover:bg-black hover:text-white whitespace-normal break-words">
                      {opt}
                    </option>
                  ))}
                </select>

                {/* <input
                  className="border rounded-md px-2 py-1"
                  placeholder="التسمية (العنوان)"
                  value={row.label}
                  onChange={(e) => setRows((r) => r.map((x) => (x.id === row.id ? { ...x, label: e.target.value } : x)))}
                /> */}

                <input
                  className="border rounded-md px-2 py-1"
                  placeholder={lang === "ar" ? "القيمة" : "Value"}
                  value={row.value}
                  onChange={(e) => setRows((r) => r.map((x) => (x.id === row.id ? { ...x, value: e.target.value } : x)))}
                />

                <div className="flex gap-1 justify-center">
                  <button type="button" onClick={() => move(row.id, -1)} className="px-2 py-1 border rounded hover:bg-black hover:text-white hover:cursor-pointer">
                    ↑
                  </button>
                  <button type="button" onClick={() => move(row.id, 1)} className="px-2 py-1 border rounded hover:bg-black hover:text-white hover:cursor-pointer">
                    ↓
                  </button>
                <button type="button" onClick={() => removeRow(row.id)} className="px-2 py-1 border rounded text-red-600 hover:bg-red-600 hover:text-black hover:cursor-pointer">
                  —
                </button>
                </div>

              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-3">
          <h2 className={`mb-8 text-xl font-black xxxs:text-center `}>{lang === "ar" ? "التخصيص" : "Table Customization"}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-[1.2fr_1fr_auto] gap-5">
            {/* <label className="flex items-center gap-2">
              {lang === "ar" ? "اتجاه:" : "Direction :"}
              <select
                className="border rounded-md px-2 py-1"
                value={theme.dir}
                onChange={(e) => setTheme({ ...theme, dir: e.target.value as "rtl" | "ltr" })}
              >
                <option value="rtl">{lang === "ar" ? "يمين ← يسار (عربي)" : "Right To Left (Arabic)"}</option>
                <option value="ltr">{lang === "ar" ? "يسار ← يمين (انجليزي)" : "Left To Right (English)"}</option>
              </select>
            </label> */}
            {/* <label className="flex items-center gap-2">
              {lang === "ar" ? "نوع الخط:" : "Font Type"}
              <select className="border rounded-md px-2 py-1" value={theme.fontFamily} onChange={(e) => setTheme({ ...theme, fontFamily: e.target.value as never })}>
                <option value="sans">Sans</option>
                <option value="serif">Serif</option>
                <option value="mono">Mono</option>
              </select>
            </label> */}
            <label className="flex md:flex-row xxxs:flex-col items-center gap-2">
              {lang === "ar" ? "حجم الخط:" : "Font Size"}
              <input
                type="number"
                className="border rounded-md px-2 py-1 w-24"
                value={theme.fontSize}
                min={14}
                max={30}
                onChange={(e) => setTheme({ ...theme, fontSize: Number(e.target.value) })}
              />
            </label>
            <label className="flex items-center gap-2 md:flex-row xxxs:flex-col">
              {lang === "ar" ? "لون عنوان الجدول:" : "Header Bg Color :"}
              <input type="color" value={theme.headerBg} onChange={(e) => setTheme({ ...theme, headerBg: e.target.value })} />
            </label>
            <label className="flex items-center gap-2 md:flex-row xxxs:flex-col">
              {lang === "ar" ? "لون نص عنوان الحدول:" : "Header Font Color :"}
              <input type="color" value={theme.headerText} onChange={(e) => setTheme({ ...theme, headerText: e.target.value })} />
            </label>
            <label className="flex items-center gap-2 md:flex-row xxxs:flex-col">
              {lang === "ar" ? "تباعد الصفوف (px):" : "Rows Margin (px)"}
              <input
                type="number"
                className="border rounded-md px-2 py-1 w-24"
                value={theme.rowGap}
                min={0}
                max={300}
                onChange={(e) => setTheme({ ...theme, rowGap: Number(e.target.value) })}
              />
            </label>
            <label className="flex items-center gap-2 md:flex-row xxxs:flex-col">
              {lang === "ar" ? "لون نص القيمة:" : "Value Font Color"}
              <input type="color" value={theme.valueText} onChange={(e) => setTheme({ ...theme, valueText: e.target.value })} />
            </label>
            <label className="flex items-center gap-2 md:flex-row xxxs:flex-col">
              {lang === "ar" ? "لون حدود الصف:" : "Row Border Color"}
              <input type="color" value={theme.rowBorder} onChange={(e) => setTheme({ ...theme, rowBorder: e.target.value })} />
            </label>
          </div>
        </section>

        <section dir={theme.dir} className="grid gap-4 ">
          <h2 className={`text-xl font-black xxxs:text-center `}>{lang === "ar" ? "معاينة الجدول" : "Table View"}</h2>
          <div className="border rounded-xl p-3" style={{ fontSize: theme.fontSize, fontFamily: theme.fontFamily }}>
            <div className="flex flex-col" style={{ gap: theme.rowGap }}>
              {rows.map((row) => (
                <div key={row.id} className="grid grid-cols-[1fr_auto] items-stretch" dir={lang === "ar" ? "ltr" : "rtl"}>
                  <div
                    className="flex items-center justify-end px-2 rounded-l"
                    style={{
                      background: theme.headerBg,
                      color: theme.headerText,
                      borderInlineStart: `1px solid ${theme.rowBorder}`,
                      borderBlock: `1px solid ${theme.rowBorder}`,
                    }}
                  >
                    {/* <span className="font-medium whitespace-pre-wrap text-right">{row.label || "—"}</span> */}
                  </div>
                  <div
                    className="flex items-center justify-start px-3 rounded-r"
                    style={{ color: theme.valueText, borderInlineEnd: `1px solid ${theme.rowBorder}`, borderBlock: `1px solid ${theme.rowBorder}` }}
                  >
                    <span className="whitespace-pre-wrap break-all">{row.value || ""}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-3">
          <h2 className={`mb-8 text-xl font-black xxxs:text-center`}>{lang === "ar" ? "توليد رمز QR" : "QR Code Generation"}</h2>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <button onClick={generate} className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:opacity-90 hover:bg-black hover:cursor-pointer">
              {lang === "ar" ? "توليد" : "Generate"}
            </button>
            <button onClick={() => window.open(viewerUrl, "_blank")} className="px-3 py-1.5 border rounded-lg bg-black text-white hover:opacity-90 hover:cursor-pointer hover:bg-white hover:text-black hover:border-black">
              {lang === "ar" ? "فتح رابط المعاينة" : "View Table"}
            </button>
            {/* <a href={viewerUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">
              فتح رابط المعاينة
            </a> */}
            <button onClick={() => navigator.clipboard.writeText(viewerUrl)} className="px-3 py-1.5 border rounded-lg bg-black text-white hover:opacity-90 hover:cursor-pointer hover:bg-white hover:text-black hover:border-black" >
              {lang === "ar" ? "نسخ الرابط" : "Copy Link"}
            </button>
          </div>

          <div className="mb-8 text-lg text-center">
            <span className={`${sizeHint.tone === "ok" ? "text-emerald-600" : sizeHint.tone === "warn" ? "text-amber-600" : "text-red-600"}`}>
              {lang === "ar" ? "طول الرابط:" : "Link Length"} {urlLength} — {sizeHint.text}
            </span>
            {issues.length > 0 && (
              <ul className="mt-1 list-disc pr-5 text-red-600">
                {issues.map((i) => (
                  <li key={i.id}>{i.message}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-wrap gap-6 justify-center">
            {qr100 && (
              <div className="grid place-items-center gap-2">
                <img src={qr100} alt="QR 100" className="w-[100px] h-[100px]" />
                <button onClick={() => download(qr100, "qr-100.png")} className="px-3 py-1.5 border rounded hover:text-white hover:cursor-pointer hover:bg-black font-black">
                  تنزيل 100×100
                </button>
              </div>
            )}
            {qr250 && (
              <div className="grid place-items-center gap-2">
                <img src={qr250} alt="QR 250" className="w-[250px] h-[250px]" />
                <button onClick={() => download(qr250, "qr-250.png")} className="px-3 py-1.5 border rounded hover:text-white hover:cursor-pointer hover:bg-black font-black">
                  تنزيل 250×250
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    );
  }
