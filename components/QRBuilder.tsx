  // src/components/QRBuilder.tsx
  "use client";

  import { useMemo, useState , useRef } from "react";
  import { v4 as uuid } from "uuid";
  import { v4 as uuidv4 } from "uuid";
  // import { saveDocument } from "../utils/saveDocument"; // you’ll create this helper

  // import clsx from "classnames";
  import { qrToDataUrl } from "../lib/qr";
  import { buildViewerUrl } from "../lib/codec";
  import type { QRDocument, TableRow, TableTheme, RowTypeAr , RowTypeEn } from "../types/qr";
  import { usePersistentState } from "../hooks/usePersistentState";
  import { validateRows } from "../lib/validate";
  import LangSwitcher from "./layout/LangSwitcher";
  import clsx from "clsx";
  import html2canvas from "html2canvas";
import { supabase } from "../lib/supabaseClient";

  const DEFAULT_THEME: TableTheme = { 
    dir: "rtl",
    fontFamily: "sans",
    fontSize: 16,
    headerBg: "#000000",
    docTitle:"",
    // headerBg: "#787878",
    headerText: "#FFFFFF",
    valueText: "#000000",
    rowBorder: "#000000",
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
    DEFAULT_THEME.docTitle = lang === "ar" ? "العنوان المبدئي" : "Default Title"
    const qrRef = useRef<HTMLDivElement>(null);
    const [rows, setRows, readyRows] = usePersistentState<TableRow[]>("qr.rows", [newRow()]);
    const [theme, setTheme, readyTheme] = usePersistentState<TableTheme>("qr.theme", { ...DEFAULT_THEME, dir: lang === "ar" ? "rtl" : "ltr" });
    // const [qr100, setQr100] = useState<string>("");
    const [qr100, setQr100] = useState<string>("");
    const [qr200, setQr200] = useState<string>("");
    // const [Company, setCompany] = useState<boolean>(false);
    const [selectedValue, setSelectedValue] = useState<string>(lang === "ar" || "en" ? "الملفات" : "Files");
    const [selectedCert, setSelectedCert] = useState<string>("");
    // const [selectedCertField, setSelectedCertField] = useState<string>("");
    const [selectedTable, setSelectedTable] = useState<string>("");
    const [ , setSelectedField] = useState<string>("");
    const [ Password , setPassword] = useState<boolean>(false);
    const [viewerUrlWithExpiry, setViewerUrlWithExpiry] = useState<string>("");

    // const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    // const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
// const fileInputRef = useRef<HTMLInputElement | null>(null);

// const handleUploadButtonClick = () => {
//   fileInputRef.current?.click();
// };

// const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//   const file = e.target.files?.[0];
//   if (file) {
//     setUploadedFileName(file.name); // store file name
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setUploadedImage(reader.result as string); // store base64 image URL
//     };
//     reader.readAsDataURL(file);
//   }
// };


  const colorMap: Record<string, string> = {
    
    "جهات المطابقة Q": "#000957", 
    "Conformity Authorities Q": "#000957",
    "شهادة تسجيل مكتب تفتيش / جهة مطابقة": "#000957",
    "Registration of Certification / Control Body": "#000957",
    
    "مكاتب علمية S": "#81A7C9", 
    "Scientific Offices S": "#81A7C9",
    "شهادة تسجيل مكتب استشاري (مكتب علمي)": "#81A7C9",
    "Registration of a consulting office (scientific office)": "#81A7C9",
    
    "مكاتب إستشارية T": "#BF3900", 
    "Consulting Offices T": "#BF3900",
    "شهادة تسجيل مكتب استشاري لتسجيل المدخلات العضوية": "#BF3900",
    "Registration of a Consulting Office": "#BF3900",
    
    "مزرعة R":"#00BF09", 
    "Farm R": "#00BF09",
    "شهادة وحدة انتاجية (مزرعة)" :"#00BF09",
    "Registration Certificate for a Production Unit (Farm)" :"#00BF09",
    
    "مدخل أعلاف محلي O":  "#BAB6B3", 
    "Local Feed Input O": "#BAB6B3",
    
    "مدخل أعلاف مستورد Z":"#B8E4FF", 
    "Imported Feed Input Z": "#B8E4FF",
        
    "مدخل وقاية مستورد M":"#24EEFF", 
    "Imported Protection Input M": "#24EEFF",
    "شهادة تسجيل مدخل إنتاج عضوي مستورد (مبيد عضوي/ حيوي)": "#24EEFF",
    "Registration Certificate for Imported Organic Inputs (Organic / Bio-Pesticide)": "#24EEFF",
    
    "مدخل وقاية محلي G": "#FCF4D7", 
    "Local Protection Input G": "#FCF4D7",
    "شهادة تسجيل لأحد مدخلات الإنتاج العضوي المحلي (مبيد عضوي/حيوي محلي)": "#FCF4D7",
    "Registration Certificate for Organic Production Inputs (Organic / Bio pesticide)": "#FCF4D7",
    
    "مدخل تغذية مستورد K": "#8300BF", 
    "Imported Nutrition Input K": "#8300BF",
    "شهادة تسجيل مدخل إنتاج عضوي مستورد (مخصب/ محسن تربة)": "#8300BF",
    "Registration Certificate for imported Organic Production Inputs (Fertilizer/ Soil conditioner)": "#8300BF",
    
    "مدخل تغذية محلي E": "#EB7A0E", 
    "Local Nutrition Input E": "#EB7A0E",
    "شهادة تسجيل لأحد مدخلات الإنتاج العضوي المحلي (مخصب/ محسن تربة محلي)": "#EB7A0E",
    "Registration Certificate for Organic Inputs Production (Fertilizer / Soil Conditioner) ": "#EB7A0E",
    
    "الشركات المحلية A": "#FFDE52", 
    "Local Companies A": "#FFDE52",
    "شهادة تسجيل وحدة إنتاج عضوي": "#FFDE52",
    "Organic Production Unit Registration Certificate": "#FFDE52",

    "تسجيل مستودع D":    "#95A34D", 
    "Warehouse Registration D": "#95A34D",
    "شهادة تسجيل مستودع / مخزن لمستلزمات الإنتاج العضوي": "#95A34D",
    "Registration Certificate for Organic Inputs Warehouse / Store ": "#95A34D",
    
    "الشركات المستوردة B": "#2063AB", 
    "Importing Companies B": "#2063AB",
    "شهادة تسجيل مستورد لمدخلات الإنتاج العضوي": "#2063AB",
    "Importer Registration Certificate for Organic Inputs": "#2063AB",
    
    "سجل الشركات المصدرة C": "#F52A84", 
    "Exporting Companies Register C": "#F52A84",
    "شهادة تسجيل مصدر لأحد مدخلات الإنتاج العضوي": "#F52A84",
    "Registration Certificate for Organic Production Inputs Exporter": "#F52A84",
  };
  // 1️⃣ Define the mapping between certificate types and their key fields
const CERTIFICATE_FIELDS_Ar: Record<string, string[]> = {

   "شهادة تسجيل لأحد مدخلات الإنتاج العضوي المحلي (مخصب/ محسن تربة محلي)":[
    
     "رقم التسجيل",
     "تاريخ انتهاء التسجيل",
     "تاريخ التسجيل",
        "تاريخ التجديد",
        "تاريخ انتهاء التجديد", 
     "اسم المصنع المنتِج وعنوانه ",
    "المحاصيل التي يستخدم لها المركب  ",
    "مدى امكانية خلط الخام مع غيره من الأسمدة ",
    "طريقة الاستعمال والتخفيف ",
    "مواصفات العبوات والوزن والحجم ",
    "طبيعة وشكل الخام/ المركب ولونه ",
    "العلامة التجارية",
    "الاسم التجاري - السمة التجارية ",  
    "اسم الخام/ المركب (الاسم العلمي) "
  ],
   "شهادة تسجيل وحدة إنتاج عضوي":[
      
      "رقم التسجيل",
      "تاريخ التسجيل",
      "تاريخ انتهاء التسجيل",
        "تاريخ التجديد",
        "تاريخ انتهاء التجديد", 
      "المركبات المزمع إنتاجها",
      "سجل تجاري",
      "سارية من",
      "بطاقة ضريبية",
      "رقم رخصة التشغيل",
      "موافقة وزارة الصناعة (شهادة السجل الصناعي) رقم السجل",
      "تليفون ",
      "بريد إلكتروني ",
      "سند حيازة وحدة الإنتاج",
      "اسم المشغل المسئول عن إدارة وحدة الإنتاج",
      "اسم صاحب وحدة الإنتاج",
      "عنوان وحدة الإنتاج",
      "نوع وحدة الانتاج ",
      "اسم وحدة الإنتاج"
  ],
   "شهادة تسجيل لأحد مدخلات الإنتاج العضوي المحلي (مبيد عضوي/حيوي محلي)":[
     "رقم التسجيل",
     "تاريخ انتهاء التسجيل",
     "تاريخ التسجيل",
        "تاريخ التجديد",
        "تاريخ انتهاء التجديد", 
     "اسم المصنع المنتِج وعنوانه ",
     "المحاصيل التي يستخدم لها المركب  ",
     "طريقة الاستعمال والتخفيف ",
     "مواصفات العبوات والوزن والحجم ",
     "طبيعة وشكل الخام/ المركب ولونه ",
     "العلامة التجارية",
     "الاسم التجاري - السمة التجارية ",  
     "اسم الخام/ المركب (الاسم العلمي) "
  ],

   "شهادة تسجيل مدخل إنتاج عضوي مستورد (مبيد عضوي/ حيوي)":[
     "رقم التسجيل",
     "تاريخ انتهاء التسجيل",
     "تاريخ التسجيل",
        "تاريخ التجديد",
        "تاريخ انتهاء التجديد", 
     "اسم المصنع المنتِج وعنوانه ",
     "المحاصيل التي يستخدم لها المركب  ",
     "مدى امكانية خلط الخام مع غيره من الأسمدة ",
     "طريقة الاستعمال والتخفيف ",
     "اسم المصنع المنتِج وعنوانه",
     "المادة الفعالة",
     "مواصفات العبوات والوزن والحجم ",
     "طبيعة وشكل الخام/ المركب ولونه ",
     "العلامة التجارية",
     "الاسم التجاري - السمة التجارية ",  
     "اسم الخام/ المركب (الاسم العلمي) ",
     "صورة المركب"
  ],
   
  "شهادة تسجيل مدخل إنتاج عضوي مستورد (مخصب/ محسن تربة)":[
    
     "رقم التسجيل",
     "تاريخ انتهاء التسجيل",
     "تاريخ التسجيل",
        "تاريخ التجديد",
        "تاريخ انتهاء التجديد", 
     "اسم الشركة المستوردة ",
     "عنوان الشركة المستوردة ",
     "اسم الشركة المصدرة ",
     "عنوان الشركة المصدرة ",
     "اسم المصنع المنتِج وعنوانه في بلد المنشأ ",
     "مدى امكانية خلط الخام مع غيره من الأسمدة ",
     "طريقة الاستعمال والتخفيف ",
     "مواصفات العبوات والوزن والحجم ",
     "طبيعة وشكل الخام/ المركب ولونه ",
     "العلامة التجارية",
     "الاسم التجاري - السمة التجارية ",  
     "اسم الخام/ المركب (الاسم العلمي) "
  ],

   "شهادة تسجيل مستورد لمدخلات الإنتاج العضوي":[
    
     "رقم التسجيل",
     "تاريخ انتهاء التسجيل",
     "تاريخ التسجيل",
        "تاريخ التجديد",
        "تاريخ انتهاء التجديد", 
     "اسم الشركة المستوردة",
     "عنوان الشركة المستوردة",
     "مجال النشاط",
     "ترخيص الإتجار",
     "السجل الضريبي",
     "السجل التجاري",
     "رقم تسجيل البطاقة الاستيرادية",
     "رخصة حكم محلي رقم"
  ],
   
   "شهادة تسجيل مصدر لأحد مدخلات الإنتاج العضوي":[
    
    "رقم التسجيل",
    "تاريخ انتهاء التسجيل",
    "تاريخ التسجيل",
        "تاريخ التجديد",
        "تاريخ انتهاء التجديد", 
    "اسم المصنع المنتِج وعنوانه في بلد المنشأ",
    "اسم الشركة المصدرة ",
    "عنوان الشركة المصدرة ",
    "مجال النشاط",
    "ترخيص الإتجار",
    "السجل الضريبي",
    "السجل التجاري",
    "رقم تسجيل البطاقة التصديرية ",
    "رخصة حكم محلي رقم",
    "مواصفات العبوات والوزن والحجم ",
    "طبيعة وشكل الخام/ المركب ولونه ",
    "العلامة التجارية",
    "الاسم التجاري - السمة التجارية ",  
    "اسم الخام/ المركب (الاسم العلمي) "
   ],
   
   "شهادة تسجيل مدخل إنتاج عضوي مصدر (مبيد عضوي / حيوي)":[
    
    "رقم التسجيل",
    "تاريخ انتهاء التسجيل",
    "تاريخ التسجيل",
        "تاريخ التجديد",
        "تاريخ انتهاء التجديد", 
    "اسم الشركة المصدرة",
    "عنوان الشركة المصدرة",
    "اسم الشركة المستوردة",
    "عنوان الشركة المستوردة",
    "اسم المصنع المنتِج وعنوانه في بلد المنشأ",
    "طريقة الاستعمال والتخفيف ",
    "مواصفات العبوات والوزن والحجم ",
    "طبيعة وشكل الخام/ المركب ولونه ",
    "العلامة التجارية",
    "الاسم التجاري - السمة التجارية ",  
    "اسم الخام/ المركب (الاسم العلمي) "
  ],
   
   "شهادة تسجيل مدخل إنتاج عضوي مصدر (مخصب/ محسن تربة)":[
    
    "رقم التسجيل",
    "تاريخ انتهاء التسجيل",
    "تاريخ التسجيل",
        "تاريخ التجديد",
        "تاريخ انتهاء التجديد", 
    "اسم الشركة المصدرة",
    "عنوان الشركة المصدرة",
    "اسم الشركة المستوردة",
    "عنوان الشركة المستوردة",
    "اسم المصنع المنتِج وعنوانه في بلد المنشأ",
    "مدى امكانية خلط الخام مع غيره من الأسمدة ",
    "طريقة الاستعمال والتخفيف ",
    "مواصفات العبوات والوزن والحجم ",
    "طبيعة وشكل الخام/ المركب ولونه ",
    "العلامة التجارية",
    "الاسم التجاري - السمة التجارية ",  
    "اسم الخام/ المركب (الاسم العلمي) "
  ],
   
   "شهادة تسجيل مستودع / مخزن لمستلزمات الإنتاج العضوي":[
    
     "رقم التسجيل",
     "تاريخ انتهاء التسجيل",
     "تاريخ التسجيل",
        "تاريخ التجديد",
        "تاريخ انتهاء التجديد", 
     "اسم الشركة المالكة للمستودع / المخزن",
     "اسم مالك المستودع / المخزن",
     "تليفون  ",
     "بريد إلكتروني",
     "عنوان المستودع / المخزن",
     "سند الحيازة",
     "المواصفات الهندسية للمستودع / المخزن ",
     "الأغراض التي يستخدم فيها المستودع أو المخزن",
  ],
   
   "شهادة تسجيل مكتب تفتيش / جهة مطابقة":[
    
     "رقم التسجيل",
     "تاريخ انتهاء التسجيل",
     "تاريخ التسجيل",
        "تاريخ التجديد",
        "تاريخ انتهاء التجديد", 
     "تليفون جهة المطابقة",
     "البريد الإلكتروني",
     "العنوان البريدي داخل جمهورية مصر العربية",
     "إسم جهة المطابقة",
     "الموقع الإلكتروني",
     "الوضع القانوني لجهة المطابقة بمصر",
     "المجال الاعتماد",
     "اسم المدير المسؤول",
     "تاريخ التأسيس",
     "السمة التجارية",
     "عنوان المكتب الرئيسي لجهة الاعتماد",
     "تليفون المكتب الرئيسي لجهة الاعتماد",
  ],
   
   "شهادة تسجيل مكتب استشاري (مكتب علمي)":[
    
     "رقم التسجيل",
     "تاريخ انتهاء التسجيل",
     "تاريخ التسجيل",
        "تاريخ التجديد",
        "تاريخ انتهاء التجديد", 
     "اسم المكتب العلمي",
     "نطاق عمل الشركة",
     "عنوان الشركة",
     "اسم صاحب المكتب",
     "سجل تجاري",
     "بطاقة ضريبية رقم",
     "تليفون",
  ],
   
   "شهادة تسجيل مكتب استشاري لتسجيل المدخلات العضوية":[
    
     "رقم التسجيل",
     "تاريخ انتهاء التسجيل",
     "تاريخ التسجيل",
        "تاريخ التجديد",
        "تاريخ انتهاء التجديد", 
     "اسم المكتب الاستشاري",
     "نطاق عمل الشركة",
     "عنوان الشركة",
     "اسم صاحب المكتب",
     "سجل تجاري",
     "بطاقة ضريبية رقم",
     "تليفون",
  ],
   
   "شهادة اجتياز اختبار تقييم الفعالية":[
    "طبيعة المركب",
    "محصول التجربة",
    "الاسم العلمي",
    "الاسم التجاري",
    "العلامة التجارية",
    "التقييم الحيوي",
    "المحاصيل التي  يستخدم معها",
    "معدل الاستخدام",
    "تاريخ  اجتياز اختبار التقييم",
    "التوصيات",
    "اسم الشركة المنتجة للمركب",
    "رقم التسجيل",
    "تاريخ انتهاء الشهادة"
  ],
   
   "شهادة وحدة انتاجية (مزرعة)":[
    
    "رقم التسجيل",
    "تاريخ انتهاء التسجيل",
    "تاريخ التسجيل",
        "تاريخ التجديد",
        "تاريخ انتهاء التجديد", 
    "اسم المزرعة",
    "مساحة المزرعة",
    "عنوان المزرعة",
    "درجة المزرعة",
    "الرقم الكودي للمزرعة",
  ],
  //  "":[""],
  //  "":[""],
  //  "":[""],
  //  "":[""],
  //  "":[""],
  // ... add all your 15 certificate types
};
const CERTIFICATE_FIELDS_En: Record<string, string[]> = {
  
    "Registration Certificate for Organic Inputs Production (Fertilizer / Soil Conditioner)":[
      "Registration Number" ,
       "Registration Date" ,
       "Registration Expiry Date" ,
       "Renewal Date" ,
       "Renewal Expiry Date" ,
       "Name of production factory and its address",
       "Crops for which the compound is used",
       "Possibility of mixing with other fertilizers",
       "Method of use and dilution",
       "Description of packaging, weight and size",
       "Nature, shape and color of raw material/compound",
       "Brand",
       "Trade name – Trademark",
       "Name of raw material/compound (scientific name)"
    ],
    "Organic Production Unit Registration Certificate":[
    "Registration Number",
    " Registration Date",
    "Registration Expiry Date",
    "Renewal Date" ,
    "Renewal Expiry Date" ,
    "Compounds to be produced",
    "Commercial register",
    "Valid From",
    "Tax card ",
    "Operation license number",
    "Approval of the Ministry of Industry (Industrial Registry Certificate) Registration number",
    "Phone ",
    "Title Deed",
    "Email",
    "Operator Name",
    "Owner Name",
    "Address of production unit ",
    "Type of production unit",
    "Name of production unit",
    ],
    "Registration Certificate for Organic Production Inputs (Organic / Bio pesticide)":[
    "Registration Number" ,
     "Registration Date" ,
     "Registration Expiry Date" ,
     "Renewal Date" ,
     "Renewal Expiry Date" ,
     "Name of production factory and its address",
     "Crops for which the compound is used",
     "Method of use and dilution",
     "Description of packaging, weight and size",
     "Nature, shape and color of raw material/compound",
     "Brand",
     "Trade name – Trademark",
     "Name of raw material/compound (scientific name)"
    ],   
    "Registration Certificate for Imported Organic Inputs (Organic / Bio-Pesticide)":[

       "Registration Number" ,
       "Registration Date" ,
       "Registration Expiry Date" ,
       "Renewal Date" ,
       "Renewal Expiry Date" ,
       "Name of production factory and its address",
       "Crops for which the compound is used",
       "Possibility of mixing with other fertilizers",
       "Method of use and dilution",
       "Description of packaging, weight and size",
       "Nature, shape and color of raw material/compound",
       "Brand",
       "Trade name – Trademark",
       "Name of raw material/compound (scientific name) ",
       "Active ingredient",
       "Importer name",
       "Image of the formulation"
    ], 
   "Registration Certificate for imported Organic Production Inputs (Fertilizer/ Soil conditioner)":[
       "Registration Number" ,
       "Registration Date" ,
       "Registration Expiry Date" ,
       "Renewal Date" ,
       "Renewal Expiry Date" ,
       "Name of exporting company",
       "Address of exporting company",
       "Name of Importing company",
       "Address of Importing company",
       "Name of production factory and its address",
       "Possibility of mixing with other fertilizers",
       "Method of use and dilution",
       "Description of packaging, weight and size",
       "Nature, shape and color of raw material/compound",
       "Brand",
       "Trade name – Trademark",
       "Name of raw material/compound (scientific name) ",
    ], 
   "Importer Registration Certificate for Organic Inputs":[
       "Registration Number" ,
       "Registration Date" ,
       "Registration Expiry Date" ,

       "Renewal Date" ,
       "Renewal Expiry Date" ,
       "Address of importing company",
       "Name of importing company",
       "Scope of Activity",
       "Commercial Register Number",
       "Tax Register Number",
       "Trade License Number",
       "Local registry Number",
       "Import Register Number",
    ], 
   "Registration Certificate for Organic Production Inputs Exporter":[
      "Registration Number" ,
      "Registration Date" ,
      "Registration Expiry Date" ,
       "Renewal Date" ,
       "Renewal Expiry Date" ,
      "Name of production factory and its address in the country of origin",
      "Address of Exporting company",
      "Name of Exporting company",
      "Scope of Activity",
      "Commercial Register Number",
      "Tax Register Number",
      "Trade License Number",
      "Local registry Number",
      "Export Register Number",
      "Trade name – Trademark",
      "Brand",
      "Name of raw material/compound (scientific name) ",
      "Nature, shape and color of raw material/compound",
      "Description of packaging, weight and size",
    ], 
   "Registration Certificate for Exported Organic Inputs (Organic / Bio Pesticide)":[
       "Registration Number" ,
       "Registration Date" ,
       "Registration Expiry Date" ,

       "Renewal Date" ,
       "Renewal Expiry Date" ,
       "Name of exporting company",
       "Address of exporting company",
       "Name of Importing company",
       "Address of Importing company",
       "Name of production factory and its address in the origin country",
       "Method of use and dilution",
       "Description of packaging, weight and size",
       "Nature, shape and color of raw material/compound",
       "Brand",
       "Trade name – Trademark",
       "Name of raw material/compound (scientific name) ",
    ], 
   "Registration Certificate for Exported Organic Production Inputs (Fertilizer/ Soil conditioner)":[
       "Registration Number" ,
       "Registration Date" ,
       "Registration Expiry Date" ,

       "Renewal Date" ,
       "Renewal Expiry Date" ,
       "Name of exporting company",
       "Address of exporting company",
       "Name of Importing company",
       "Address of Importing company",
       "Name of production factory and its address in the country of origin",
       "Possibility of mixing with other fertilizers",
       "Method of use and dilution",
       "Description of packaging, weight and size",
       "Nature, shape and color of raw material/compound",
       "Brand",
       "Trade name – Trademark",
       "Name of raw material/compound (scientific name)",
    ],
   "Registration Certificate for Organic Inputs Warehouse / Store":[
      "Registration Number" ,
      "Registration Date" ,
      "Registration Expiry Date" ,
       "Renewal Date" ,
       "Renewal Expiry Date" ,
      "Name of the company that owns the warehouse/storage",
      "Owner name",
      "Email",
      "Telephone",
      "Address",
      "Title Deed",
      "Engineering Specifications for Warehouse/Storage",
      "Purposes for which it is used",
    ],
   
   "Registration of Certification / Control Body": [
      "Registration Number",
      "Registration Expiry Date",
      "Registration Date",
       "Renewal Date" ,
       "Renewal Expiry Date" ,
      "Conformity Body Phone Number",
      "Email Address",
      "Postal Address within the Arab Republic of Egypt",
      "Name of Conformity Body",
      "Website",
      "Legal Status of Conformity Body in Egypt",
      "Scope of Accreditation",
      "Name of Responsible Manager",
      "Establishment Date",
      "Trade Name",
      "Head Office Address of Accreditation Body",
      "Head Office Phone Number of Accreditation Body",
    ],
   
   "Registration of a consulting office (scientific office)":[ 
       "Registration Number" ,
       "Registration Date" ,
       "Registration End Date" ,

       "Renewal Date" ,
       "Renewal Expiry Date" ,
       "Scientific Office Name",
       "Company Scope",
       "Address",
       "Owner Name",
       "Commercial Register",
       "Tax Card Number",
       "Phone Number",
      ],
   
   "Registration of a Consulting Office":[
      "Registration Number" ,
      "Registration Date" ,
      "Registration End Date" ,
       "Renewal Date" ,
       "Renewal Expiry Date" ,
      "Consulting Office Name",
      "Company Scope",
      "Address",
      "Owner Name",
      "Commercial Register",
      "Tax Card Number",
      "Phone Number",
    ],
   
   "Efficacy Test Certificate":[
    "Compound Nature",
    "Test Crop",
    "Scientific Name",
    "Trade Name",
    "Brand Name",
    "Bio-Evaluation",
    "Crops Used With",
    "Usage Rate",
    "Evaluation Test Pass Date",
    "Recommendations",
    "Compound Producing Company Name",
    "Registration Number",
    "Certificate Expiry Date",
   ],
   
   "Registration Certificate for a Production Unit (Farm)":[
      "Registration Number",
      "Registration Expiry Date",
      "Registration Date",
       "Renewal Date" ,
       "Renewal Expiry Date" ,
      "Farm Name",
      "Farm Area",
      "Farm Address",
      "Farm Grade",
      "Farm Code Number",
   ],
  //  "":[""],
  //  "":[""],
  //  "":[""],
  //  "":[""],
  // ... add all your 15 certificate types
};

    // 🔹 Table types (for table header color switching)
    const Table_Types: { value: string }[] = [
      { value: lang === "ar" ? "جهات المطابقة Q" : "Conformity Authorities Q" },
      { value: lang === "ar" ? "مكاتب علمية S" : "Scientific Offices S" },
      { value: lang === "ar" ? "مكاتب إستشارية T" : "Consulting Offices T" },
      { value: lang === "ar" ? "مزرعة R" : "Farm R" },
      { value: lang === "ar" ? "مدخل أعلاف محلي O" : "Local Feed Input O" },
      { value: lang === "ar" ? "مدخل أعلاف مستورد Z" : "Imported Feed Input Z" },
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
      
    const Label_Options : string[] = lang === "ar" ?    
      [   
        "اختر نوع البيان",
        "اسم المنتج",
        "التركيب",
        "رقم التسجيل",
        "رقم الشعار",
        "رقم شهادة الاجتياز في حالة التقييم",
        "نوع الانتاج",
        "تاريخ التسجيل",
        "تاريخ انتهاء التسجيل", 
        "تاريخ التجديد",
        "تاريخ انتهاء التجديد", 
      ] 
      :
      [   
        "Select Row Type",
        "Product Name",
        "Composition",
        "Registration Number",
        "Logo Number",
        "Pass Certificate Number (in case of evaluation)",
        "Type of Production",
        "Registration Date",
        "Registration Expiry Date",
       "Renewal Date" ,
       "Renewal Expiry Date" ,
      ]

    const Services_Options : string[] = lang === "ar" ?    
      [
        "اختر نوع الخدمة المستجدة",
        "مقابل الفحص الفني للملفات (التسجيل / المدخلات العضوية)",
        "تسجيل مخزن للمدخلات العضوية",
        "تسجيل مطهرات عضوية",
        "اعتماد المكاتب الاستشارية داخل مصر للتسجيلات فقط",
        "اعتماد المكاتب العلمية للشركات العالمية داخل مصر لتسجيل المدخلات العضوية",
        "تقييم الفاعلية حقلياً للمدخلات العضوية",
        "التدريب والتأهيل للتعامل وتطبيق المدخلات العضوية للشركات الاستشارية والمكاتب العلمية",
        "التدريب والتأهيل لوحدات ومصانع الإنتاج للمدخلات العضوية (بحد أقصى 4 من مسئولي الإنتاج على حسب حجم وحدة الإنتاج)",
        "تسجيل وحدات الإنتاج العضوي الخارجية والتي يتم استيراد المدخلات العضوية منها",
        "تسجيل وحدة إنتاج مدخل عضوي",
        "تسجيل جهة المطابقة",
        "تسجيل المصدر والمستورد",
        "تسجيل مزرعة إنتاج نباتي",
        "تسجيل مزرعة إنتاج حيواني أو داجني أو سمكي",
        "تسجيل مدخل عضوي للإنتاج النباتي والحيواني",
        "الحصول على سجل مدخل عضوي",
        "إصدار شهادة أو بيان",
        "خدمات قاعدة البيانات وتحديثها",
        "خدمة معاينة وحدة إنتاج (على حسب المكان)",
        "تصريح للتربية والإنتاج للمتطفلات والمفترسات",
        "إذن تصدير لعوامل المكافحة الحيوية بعد التسجيل",
        "إذن إستيراد بغرض الدراسة والتقييم لعنصر المكافحة",
        "إذن إستيراد بغرض الإنتاج والتربية لعنصر المكافحة"
      ] 
      :
      [
        "Choose The New Service Type",
        "Technical file review fee (registration / organic inputs)",
        "Registration of organic input storage",
        "Registration of organic disinfectants",
        "Accreditation of consulting offices inside Egypt (for registrations only)",
        "Accreditation of scientific offices of international companies inside Egypt for organic input registration",
        "Field evaluation of the effectiveness of organic inputs",
        "Training and qualification for consulting companies and scientific offices on handling and applying organic inputs",
        "Training and qualification for organic input production units and factories",
        "Registration of external organic production units from which organic inputs are imported",
        "Registration of an organic input production unit",
        "Registration of the conformity authority",
        "Registration of exporter and importer",
        "Registration of a plant production farm",
        "Registration of an animal, poultry, or fish production farm",
        "Registration of an organic input for plant and animal production",
        "Obtaining an organic input record",
        "Issuance of a certificate or statement",
        "Database services and updating",
        "Inspection service for a production unit (depending on location)",
        "Permit for breeding and production of parasites and predators",
        "Export permit for biological control agents after registration",
        "Import permit for study and evaluation of a control element",
        "Import permit for production and breeding of a control element",
      ]

    function resetForm(newLang: "ar" | "en") {
    setRows([newRow()]);
    setTheme({ ...DEFAULT_THEME, dir: newLang === "ar" ? "rtl" : "ltr" });
    // setQr100("");
    setQr100("");
    setQr200("");
    // setUploadedImage(null)
    // setUploadedFileName(null)
    setSelectedField("")
    setSelectedCert("")
    setSelectedTable("")
    }
      const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedValue(event.target.value);
        setSelectedTable("")
        setSelectedCert("")
        setSelectedField("")
        // setUploadedFileName(null)
        setRows([newRow()]);
        setTheme({ ...DEFAULT_THEME, dir: lang === "ar" ? "rtl" : "ltr" });
        setQr200("");
        // setQr100("");
        setQr100("");
        
        // resetForm("en")
        // setUploadedImage(null);

      // You can perform other actions here based on the selected value
      // console.log('Selected radio button value:', event.target.value);
    };
    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const writePasswords = process.env.NEXT_PUBLIC_WRITE_PASSWORD_ARRAY?.split(",") || [];

      // console.log(readPasswords)
      if(writePasswords?.includes(event.target.value)){setPassword(true)}
      else{setPassword(false)}
    };
    const ready = readyRows && readyTheme;
      const doc: QRDocument = useMemo(() => ({ rows, theme }), [rows, theme]);
      const viewerUrl = buildViewerUrl("/view", doc); // default (no expiry embedded)
      const currentViewerUrl = viewerUrlWithExpiry || viewerUrl;
    if (!ready) return <div className="p-4 text-sm text-neutral-500">جارٍ التحميل…</div>;
      
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
    function insertRowAfter(id: string) {
      setRows((r) => {
        const idx = r.findIndex((x) => x.id === id);
        if (idx < 0) return r; // row not found
        const copy = r.slice();
        copy.splice(idx + 1, 0, newRow()); // insert after idx
        return copy;
      });
    }

    const issues = validateRows(rows);
    const urlLength = currentViewerUrl.length;
    const sizeHint: { tone: "ok" | "warn" | "bad"; text: string } = { tone: "ok", text: lang === "ar" ? "الحجم ممتاز"  : "Perfect Size"};
    // if (urlLength > 1800) sizeHint = { tone: "bad", text: lang === "ar" ? "الرابط كبير جدًا — قد يصعب مسح QR" : "The Link Length is too large - The QR Code maybe difficult to scan" };
    // else if (urlLength > 1200) sizeHint = { tone: "warn", text: lang === "ar" ? "الرابط كبير — يفضل تقليل البيانات" : "The Link Length is a bit large - It is Advisable to reduce the data Size" };

//     async function generate() {
//   if (issues.length > 0) {
//     if (lang === "ar") return alert("يرجى تصحيح الأخطاء قبل التوليد");
//     else return alert("Please Revise Your Data Before QR Code Generation");
//   }
    
//   // determine whether this QR should carry an expiry
//   const isCertificates =
//     selectedValue === "Certificates" || selectedValue === "الشهادات";
//   const isLabels =
//     selectedValue === "Labels" || selectedValue === "الملصقات";
//   const isExpirable = isCertificates || isLabels;

//   // compute expiry date (13 months) — but allow a development override via ?expiryMinutes=NN
//   let expiresAt: string | undefined = undefined;
//   if (isExpirable) {
//     const now = new Date();
//     let testMinutes = 0;
//     try {
//       if (typeof window !== "undefined") {
//         const params = new URLSearchParams(window.location.search);
//         testMinutes = Number(params.get("expiryMinutes") || 0);
//       }
//     } catch (err) {
//       testMinutes = 0;
//       console.log(err)
//     }

//     if (testMinutes > 0) {
//       now.setMinutes(now.getMinutes() + testMinutes);
//     } else {
//       // add 13 months (keeps day-of-month semantics)
//       now.setMonth(now.getMonth() + 13);
//     }

//     expiresAt = now.toISOString();
//   }

//   // Build a doc that contains the expiry info (top-level fields so decode is simple)
//   const docToEncode = {
//     rows,
//     theme: { ...theme },
//     expirable: isExpirable,
//     expiresAt, // undefined for non-expirable
//   };
  

//   // Build viewer URL that includes the encoded doc (so preview page can read expiry)
//   const url = buildViewerUrl("/view", docToEncode);

//   // generate QR images as before
//   const small = await qrToDataUrl(url, 100);
//   const big = await qrToDataUrl(url, 375);

//   // update state
//   setQr100(small);
//   setQr200(big);
//   setViewerUrlWithExpiry(url); // so "open" and "copy" now use the expiry-enabled URL
// }


async function saveDocumentToSupabase(id: string, doc: object) {
  const { error } = await supabase.storage
    .from("cloa-qr-generator-app")
    .upload(`${id}.json`, new Blob([JSON.stringify(doc, null, 2)], { type: "application/json" }), {
      upsert: true, // allow overwrite if same id
    });

  if (error) throw error;
  
  // ✅ use Supabase client instead of manual URL concatenation
  const { data } = supabase.storage
    .from("cloa-qr-generator-app")
    .getPublicUrl(`${id}.json`);

  return data.publicUrl; // this is the link you should encode in QR
    
  // return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/cloa-qr-generator-app/${id}.json`;
}


async function generate() {
  if (issues.length > 0) {
    if (lang === "ar") return alert("يرجى تصحيح الأخطاء قبل التوليد");
    else return alert("Please Revise Your Data Before QR Code Generation");
  }

  // determine whether this QR should carry an expiry
  const isCertificates =
    selectedValue === "Certificates" || selectedValue === "الشهادات";
  const isLabels =
    selectedValue === "Labels" || selectedValue === "الملصقات";
  const isExpirable = isCertificates || isLabels;

  // compute expiry date (13 months) — but allow a development override via ?expiryMinutes=NN
  let expiresAt: string | undefined = undefined;
  if (isExpirable) {
    const now = new Date();
    let testMinutes = 0;
    try {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        testMinutes = Number(params.get("expiryMinutes") || 0);
      }
    } catch (err) {
      testMinutes = 0;
      console.log(err);
    }

    if (testMinutes > 0) {
      now.setMinutes(now.getMinutes() + testMinutes);
    } else {
      // add 13 months (keeps day-of-month semantics)
      now.setMonth(now.getMonth() + 13);
    }

    expiresAt = now.toISOString();
  }

  // Build a doc with expiry info
  const docToEncode = {
    rows,
    theme: { ...theme },
    expirable: isExpirable,
    expiresAt, // undefined for non-expirable
  };

  // 🆕 generate unique id and save the document as JSON in /public/data
  const id = uuidv4();
  // await saveDocument(id, docToEncode);
  // await fetch(`${lang}/api/save`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ id, doc: docToEncode }),
  // });
// 🆕 Save JSON to Supabase instead of local API
  const fileUrl = await saveDocumentToSupabase(id, docToEncode);
  console.log(fileUrl)
  // 🆕 Build viewer URL that references the JSON by id
  const url = `${window.location.origin}/qr/${id}`;
  // const url = `${window.location.origin}/${lang}/qr/${id}`;

  // generate QR images as before
  const small = await qrToDataUrl(url, 100);
  const big = await qrToDataUrl(url, 200);

  // update state
  setQr100(small);
  setQr200(big);
  setViewerUrlWithExpiry(url); // now this points to /qr/{id}
}


async function download(name: string, isLabel = false, uri?: string) {
  if (isLabel && qrRef.current) {
    // Snapshot QR + text
    const canvas = await html2canvas(qrRef.current, {
      scale: 1,
      // backgroundColor: "#ffffff",
    });

    // Create final canvas
    const fixedCanvas = document.createElement("canvas");
    // fixedCanvas.width = 275;
    // fixedCanvas.height = 290;
    // fixedCanvas.width = 85;
    // fixedCanvas.height = 100;
    fixedCanvas.width = 100;
    fixedCanvas.height = 115;
    const ctx = fixedCanvas.getContext("2d");

    if (ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 100, 115);
      // ctx.fillRect(0, 0, 85, 100);

      // --- Step 1: Draw QR (fixed 100x100) ---
      // const qrSize = 275;
      // const qrSize = 85;
      const qrSize = 100;
      // const qrX = (250 - qrSize) / 2;
      const qrX = 0;
      const qrY = 0;
      ctx.drawImage(canvas, 0, 0, canvas.width, canvas.width, qrX, qrY, qrSize, qrSize);

      // --- Step 2: Draw Text (CLOA-GAOA) ---
      ctx.fillStyle = "#000000";
      ctx.font = "bold 16px Arial";
      // ctx.font = "bold 13px Arial";
      ctx.textAlign = "center";
      // ctx.fillText("CLOA-GAOA", qrSize/2, qrSize+13); // centered at bottom
      ctx.fillText("CLOA-GAOA", qrSize/2, qrSize+14); // centered at bottom
    }

    // Export
    const link = document.createElement("a");
    link.download = name;
    link.href = fixedCanvas.toDataURL("image/png");
    link.click();
  } else if (uri) {
    // Normal QR
    const a = document.createElement("a");
    a.href = uri;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
}

// console.log(process.env.NEXT_PUBLIC_BASE_URL)
    return (
      <>
        {
          !Password && (
            <div className={clsx(
              lang === "ar" ? "flex xs:flex-row xs:items-center xs:justify-center xxxs:flex-col xxxs:items-center xxxs:justify-between" :
               "flex md:flex-row md:items-center md:justify-center xxxs:flex-col xxxs:items-center xxxs:justify-between"
            )}>
              <label htmlFor="Password" className={clsx(
                "font-black",
                lang === "ar" ? "xxxs:mb-5 xs:mb-0" : "xxxs:mb-5 md:mb-0"
              )}>
                {lang === "ar" ? "ادخل كلمة السر" : "ُEnter Password"}
              </label>
              <input className={clsx(
                "border rounded-md px-1 py-1 xs:mx-5",
                lang === "ar" ? "xxxs:mb-5 xs:mb-0" : "xxxs:mb-5 md:mb-0"
              )} name="Password" title="Password" type="password" onChange={handlePasswordChange} placeholder={lang === "ar" ? "كلمة السر" : "Password"} />
              <span className="text-red-700 font-black">{lang === "ar" ? "كلمة السر غير صحيحة" : "The Password Is Incorrect"} </span>
            </div>
          )
        }
        {
          Password &&(
            <div className="flex flex-col gap-6 bg-white">
        <section className="grid gap-4">
          <header className="grid md:grid-cols-4 xxxs:grid-cols-2 sm:gap-x-8 gap-8 mb-8">
            <h2 className="text-xl font-semibold">{lang === "ar" ? "إعداد البيانات" : "Data Preparation"}</h2>
            <button onClick={()=>{
                setRows([newRow()]);
                setTheme({ ...DEFAULT_THEME, dir: lang === "ar" ? "rtl" : "ltr" });
                setQr200("");
                setQr100("");
                // setQr100("");
                setSelectedCert("")
                setSelectedTable("")
                // setUploadedImage(null);
                // setUploadedFileName(null);
                // if(lang === "ar"){
                //   setSelectedValue(selectedValue === "الملفات" ? "الشهادات" : "الملفات")
                // }else{
                //   setSelectedValue(selectedValue === "Files" ? "Certificates" : "Files")
                // }
            }} className="px-3 py-1.5 border rounded-lg bg-black text-white hover:opacity-90 hover:cursor-pointer hover:bg-white hover:text-black hover:border-black">
            {lang === "ar" ? "مسح البيانات" : "Reset Form"}
            </button>
            <LangSwitcher lang={lang} onSwitch={resetForm}/>
            <button onClick={addRow} className="px-3 py-1.5 border rounded-lg bg-black text-white hover:opacity-90 hover:cursor-pointer hover:bg-white hover:text-black hover:border-black">
              {lang === "ar" ? "إضافة صف +" : "Add Row +"}
            </button>
          </header>

          <div className={clsx(
            // "grid mb-8 font-black xl:grid-cols-[1fr_1fr_1fr_2fr_2fr]",
            "grid mb-8 font-black xl:grid-cols-[1fr_1fr_1fr_1fr]",
            // "flex xxxs:flex-col xxxs:items-center xxxs:justify-between md:flex-row-reverse md:justify-evenly md:items-center mb-8 font-black",
            lang === "ar" ? 
            "text-3xl sm:grid-cols-[1fr_1fr_1fr_1fr] xxs:grid-cols-[1fr_1fr] xxxs:grid-cols-[1fr] xxxs:mx-auto xxs:mx-0" 
            :"text-2xl md:grid-cols-[1fr_1.25fr_1fr_1fr] xs:grid-cols-[1fr_1fr] xxs:grid-cols-[1fr_1.5fr] xxxs:grid-cols-[1fr] xxxs:mx-auto"
          )}>
            <label className="hover:cursor-pointer xxxs:mb-4 md:mb-0">
              <input
                className="hover:cursor-pointer mx-4 w-5 h-5"
                type="radio"
                name="myRadioGroup"
                // value="option1"
                value= {lang === "ar" || "en" ? "الملفات" : "F+iles"}
                checked={lang === "ar" || "en" ? selectedValue === 'الملفات' : selectedValue === 'Files'}
                onChange={handleRadioChange}
                />
              {lang === "ar" ? "الملفات" : "Files"}
            </label>
            <label className="hover:cursor-pointer xxxs:mb-4 md:mb-0">
              <input
                className="hover:cursor-pointer mx-4 w-5 h-5"
                type="radio"
                name="myRadioGroup"
                value= {lang === "ar" || "en" ? "الشهادات" : "Certificates"}
                checked={lang === "ar" || "en" ? selectedValue === 'الشهادات' : selectedValue === 'Certificates'}
                onChange={handleRadioChange}
              />
              {lang === "ar" ? "الشهادات" : "Certificates"}
            </label>
            <label className="hover:cursor-pointer xxxs:mb-4 md:mb-0">
              <input
                className="hover:cursor-pointer mx-4 w-5 h-5"
                type="radio"
                name="myRadioGroup"
                value= {lang === "ar" || "en" ? "الملصقات" : "Labels"}
                checked={lang === "ar" || "en" ? selectedValue === 'الملصقات' : selectedValue === 'Labels'}
                onChange={handleRadioChange}
              />
              {lang === "ar" ? "الملصقات" : "Labels"}
            </label>
             <label className="hover:cursor-pointer xxxs:mb-4 md:mb-0">
              <input
                className="hover:cursor-pointer mx-4 w-5 h-5"
                type="radio"
                name="myRadioGroup"
                value= {lang === "ar" || "en" ? "الخدمات" : "Services"}
                checked={lang === "ar" || "en" ? selectedValue === 'الخدمات' : selectedValue === 'Services'}
                onChange={handleRadioChange}
              />
              {lang === "ar" ? "الخدمات" : "Services"}
            </label>
            {/* <label className="hover:cursor-pointer xxxs:mb-4 md:mb-0">
              <input
                className="hover:cursor-pointer mx-4 w-5 h-5"
                type="radio"
                name="myRadioGroup"
                value= {lang === "ar" || "en" ? "الخدمات المستجدة" : "New Services"}
                checked={lang === "ar" || "en" ? selectedValue === 'الخدمات المستجدة' : selectedValue === 'New Services'}
                onChange={handleRadioChange}
              />
              {lang === "ar" ? "الخدمات المستجدة" : "New Services"}
            </label>
            <label className="hover:cursor-pointer xxxs:mb-4 md:mb-0">
              <input
                className="hover:cursor-pointer mx-4 w-5 h-5"
                type="radio"
                name="myRadioGroup"
                value= {lang === "ar" || "en" ? "الخدمات المقدمة" : "Provided Services"}
                checked={lang === "ar" || "en" ? selectedValue === 'الخدمات المقدمة' : selectedValue === 'Provided Services'}
                onChange={handleRadioChange}
              />
              {lang === "ar" ? "الخدمات المقدمة" : "Provided Services"}
            </label> */}
            {/* <p>Current selection: {selectedValue}</p> */}
          </div>

          {/* 🔹 Table Type Selector */}

            {
              selectedValue === "Files" || selectedValue === "الملفات" && (
                <label className="flex xs:flex-row xxxs:justify-center items-center gap-2 xxxs:flex-col mb-8">
                  {lang === "ar" ? "نوع الملف:" : "File Type:"}
                  <select
                    className="border rounded-md px-2 py-2 cursor-pointer"
                    onChange={(e) => {
                      setSelectedTable(e.target.value)
                      const selected = e.target.value;
                      setTheme({
                        ...theme,
                        headerBg: colorMap[selected] || DEFAULT_THEME.headerBg,
                        docTitle:selected,
                      });
                    }}
                    value={selectedTable}
                  >
                    <option value="" className="font-black">{lang === "ar" ? "اختر نوع الملف" : "Select a File Type"}</option>
                    {Table_Types.map((opt) => (
                      <option key={opt.value} value={opt.value} className="font-black">
                        {opt.value}
                      </option>
                    ))}
                  </select>
                </label>
              )
            }

            {
              selectedValue === "Certificates" || selectedValue === "الشهادات" && (
                <label className="flex xs:flex-row xxxs:justify-center items-center gap-2 xxxs:flex-col mb-8">
                  {lang === "ar" ? "نوع الشهادة:" : "Certificate Type:"}
                  <select
                    className="border rounded-md px-2 py-2 hover:cursor-pointer md:w-auto sm:w-[475px] xxs:w-[375px] xxxs:w-[275px] break-all"
                    // onChange={(e) => {
                    //   const selected = e.target.value;
                    //   setTheme({
                    //     ...theme,
                    //     headerBg: colorMap[selected] || DEFAULT_THEME.headerBg,
                    //   });
                    // }}
                    value={selectedCert}
                      onChange={(e) => {
                        // doc.theme.docTitle 
                        setSelectedCert(e.target.value);
                        setSelectedField(""); // reset field when cert changes
                        const selected = e.target.value;
                        setTheme({
                          ...theme,
                          headerBg: colorMap[selected] || DEFAULT_THEME.headerBg,
                          docTitle:selected,
                        });
                      }}
                  >
                    <option value="" className="font-black">{lang === "ar" ? "اختر نوع الشهادة" : "Select a Certificate Type"}</option>
                    {/* {Certificate_Types.map((opt) => (
                      <option key={opt.value} value={opt.value} className="font-black">
                        {opt.value}
                      </option>
                    ))} */}
                      {
                        lang === "ar" ?                      
                        Object.keys(CERTIFICATE_FIELDS_Ar).map((cert) => (
                          <option key={cert} value={cert}>
                            {cert}
                          </option>
                        ))
                      :
                        Object.keys(CERTIFICATE_FIELDS_En).map((cert) => (
                          <option key={cert} value={cert}>
                            {cert}
                          </option>
                        ))
                      }
                  </select>
                </label>
              )
            }

          <div className="grid gap-3">
            {rows.map((row) => (
              <div key={row.id} className="grid xxxs:grid-cols-1 xxxs:grid-rows-3 sm:grid-rows-1 sm:grid-cols-[auto_1fr_auto_auto] items-center gap-x-2 gap-y-12">
              {/* Second Select → Fields of chosen certificate */}
                {selectedValue === "Certificates" || selectedValue === "الشهادات" && (
                  <select
                  title="Certificate Fields Select"
                    className="border rounded-md px-2 py-2 hover:cursor-pointer"
                    value={row.type}
                    disabled = {selectedCert === ""}
                    onChange={(e) =>{
                      setSelectedField(e.target.value)
                      // setUploadedImage(null)
                      // setUploadedFileName(null)
                      const type = lang === "ar" ? e.target.value as RowTypeAr : e.target.value as RowTypeEn
                      setRows((r) => r.map((x) => (x.id === row.id ? { ...x, type} : x)));
                    }}
                  >
                    <option value="">{lang === "ar" ? "اختر بيان الشهادة" : "Select Certificate Field"}</option>
                      {
                        lang === "ar" ? 
                        CERTIFICATE_FIELDS_Ar[selectedCert]?.map((field) => (
                          <option key={field} value={field}>
                            {field}
                          </option>
                        ))
                      :
                        CERTIFICATE_FIELDS_En[selectedCert]?.map((field) => (
                          <option key={field} value={field}>
                            {field}
                          </option>
                          )
                        )
                      }                      
                  </select>
                )}
                {
                  selectedValue === "Files" || selectedValue === "الملفات" && 
                  (                
                    <select
                    className="border rounded-md px-2 py-2 hover:cursor-pointer"
                    value={row.type}
                    title="Select"
                    disabled = {selectedTable === ""}
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
                  )
                }
                {
                  selectedValue === "Labels" || selectedValue === "الملصقات" && 
                  (                
                    <select
                    className="border rounded-md px-2 py-2 hover:cursor-pointer"
                    value={row.type}
                    title="Select"
                    onChange={(e) => {
                        const selected = lang === "ar" ? " ملصق المنتج" : "Product Label"
                        setTheme({
                          ...theme,
                          // headerBg: colorMap[selected] || DEFAULT_THEME.headerBg,
                          docTitle:selected,
                        });
                      const type = lang === "ar" ? e.target.value as RowTypeAr : e.target.value as RowTypeEn
                      setRows((r) => r.map((x) => (x.id === row.id ? { ...x, type} : x)));
                      // setRows((r) => r.map((x) => (x.id === row.id ? { ...x, type, label: x.label } : x)));
                    }}
                    >
                    {Label_Options.map((opt) => (
                      <option key={opt} value={opt} className="hover:cursor-pointer font-black hover:bg-black hover:text-white whitespace-normal break-words">
                        {opt}
                      </option>
                      ))}
                    </select>
                  )
                }
                {/* {
                  selectedValue === "Provided Services" || selectedValue === "الخدمات المقدمة" && 
                  (                
                    <select
                    className="border rounded-md px-2 py-2 hover:cursor-pointer"
                    value={row.type}
                    title="Select"
                    onChange={(e) => {
                        const selected = lang === "ar" ? "الخدمات المقدمة" : "Provided Services"
                        setTheme({
                          ...theme,
                          // headerBg: colorMap[selected] || DEFAULT_THEME.headerBg,
                          docTitle:selected,
                        });
                      const type = lang === "ar" ? e.target.value as RowTypeAr : e.target.value as RowTypeEn
                      setRows((r) => r.map((x) => (x.id === row.id ? { ...x, type} : x)));
                      // setRows((r) => r.map((x) => (x.id === row.id ? { ...x, type, label: x.label } : x)));
                    }}
                    >
                    {Provided_Services_Options.map((opt) => (
                      <option key={opt} value={opt} className="hover:cursor-pointer font-black hover:bg-black hover:text-white whitespace-normal break-words">
                        {opt}
                      </option>
                      ))}
                    </select>
                  )
                }
                {
                  selectedValue === "New Services" || selectedValue === "الخدمات المستجدة" && 
                  (                
                    <select
                    className="border rounded-md px-2 py-2 hover:cursor-pointer"
                    value={row.type}
                    title="Select"
                    onChange={(e) => {
                        const selected = lang === "ar" ? "الخدمات المستجدة" : "New Services"
                        setTheme({
                          ...theme,
                          // headerBg: colorMap[selected] || DEFAULT_THEME.headerBg,
                          docTitle:selected,
                        });
                      const type = lang === "ar" ? e.target.value as RowTypeAr : e.target.value as RowTypeEn
                      setRows((r) => r.map((x) => (x.id === row.id ? { ...x, type} : x)));
                      // setRows((r) => r.map((x) => (x.id === row.id ? { ...x, type, label: x.label } : x)));
                    }}
                    >
                    {New_Services_Options.map((opt) => (
                      <option key={opt} value={opt} className="hover:cursor-pointer font-black hover:bg-black hover:text-white whitespace-normal break-words">
                        {opt}
                      </option>
                      ))}
                    </select>
                  )
                } */}
                {
                  selectedValue === "Services" || selectedValue === "الخدمات" && 
                  (                
                    <select
                    className="border rounded-md px-2 py-2 hover:cursor-pointer"
                    value={row.type}
                    title="Select"
                    onChange={(e) => {
                        const selected = lang === "ar" ? "الخدمات المستجدة" : "New Services"
                        setTheme({
                          ...theme,
                          // headerBg: colorMap[selected] || DEFAULT_THEME.headerBg,
                          docTitle:selected,
                        });
                      const type = lang === "ar" ? e.target.value as RowTypeAr : e.target.value as RowTypeEn
                      setRows((r) => r.map((x) => (x.id === row.id ? { ...x, type} : x)));
                      // setRows((r) => r.map((x) => (x.id === row.id ? { ...x, type, label: x.label } : x)));
                    }}
                    >
                    {Services_Options.map((opt) => (
                      <option key={opt} value={opt} className="hover:cursor-pointer font-black hover:bg-black hover:text-white whitespace-normal break-words">
                        {opt}
                      </option>
                      ))}
                    </select>
                  )
                }


                {/* <input
                  className="border rounded-md px-2 py-2"
                  placeholder="التسمية (العنوان)"
                  value={row.label}
                  onChange={(e) => setRows((r) => r.map((x) => (x.id === row.id ? { ...x, label: e.target.value } : x)))}
                /> */}

              <input
                className="border rounded-md px-2 py-2"
                placeholder={lang === "ar" ? "القيمة" : "Value"}
                value={row.value}
                onChange={(e) => setRows((r) => r.map((x) => (x.id === row.id ? { ...x, value: e.target.value } : x)))}
              />

                <div className="flex gap-1 justify-center">
                  <button type="button" onClick={() => move(row.id, -1)} className="px-2 py-2 border rounded hover:bg-black hover:text-white hover:cursor-pointer">
                    ↑
                  </button>
                  <button type="button" onClick={() => move(row.id, 1)} className="px-2 py-2 border rounded hover:bg-black hover:text-white hover:cursor-pointer">
                    ↓
                  </button>
                  <button type="button" onClick={() => removeRow(row.id)} className="px-2 py-2 border rounded text-red-600 hover:bg-red-600 hover:text-black hover:cursor-pointer">
                    —
                  </button>
                  <button
                    type="button"
                    onClick={() => insertRowAfter(row.id)}
                    className="px-2 py-2 border rounded text-green-600 hover:bg-green-600 hover:text-white hover:cursor-pointer "
                  >
                    ＋
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
                className="border rounded-md px-2 py-2"
                value={theme.dir}
                onChange={(e) => setTheme({ ...theme, dir: e.target.value as "rtl" | "ltr" })}
              >
                <option value="rtl">{lang === "ar" ? "يمين ← يسار (عربي)" : "Right To Left (Arabic)"}</option>
                <option value="ltr">{lang === "ar" ? "يسار ← يمين (انجليزي)" : "Left To Right (English)"}</option>
              </select>
            </label> */}
            {/* <label className="flex items-center gap-2">
              {lang === "ar" ? "نوع الخط:" : "Font Type"}
              <select className="border rounded-md px-2 py-2" value={theme.fontFamily} onChange={(e) => setTheme({ ...theme, fontFamily: e.target.value as never })}>
                <option value="sans">Sans</option>
                <option value="serif">Serif</option>
                <option value="mono">Mono</option>
              </select>
            </label> */}
            <label className="flex md:flex-row xxxs:flex-col items-center gap-2">
              {lang === "ar" ? "حجم الخط:" : "Font Size"}
              <input
                type="number"
                className="border rounded-md px-2 py-2 w-24"
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
                className="border rounded-md px-2 py-2 w-24"
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
                      className="flex items-center justify-end px-3 rounded-l"
                      style={{ color: theme.valueText, borderInlineEnd: `1px solid ${theme.rowBorder}`, borderBlock: `1px solid ${theme.rowBorder}` }}
                    >
                      <span className="whitespace-pre-wrap break-all">{row.value || ""}</span>
                    </div>
                  <div
                    className="flex items-center justify-start px-2 rounded-r"
                    style={{
                      background: theme.headerBg,
                      color: theme.headerText,
                      borderInlineStart: `1px solid ${theme.rowBorder}`,
                      borderBlock: `1px solid ${theme.rowBorder}`,
                    }}
                  >
                    <span className="font-medium whitespace-pre-wrap text-right">{row.type || "—"}</span>
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
            <button onClick={() => window.open(currentViewerUrl, "_blank")} className="px-3 py-1.5 border rounded-lg bg-black text-white hover:opacity-90 hover:cursor-pointer hover:bg-white hover:text-black hover:border-black">
              {lang === "ar" ? "فتح رابط المعاينة" : "View Table"}
            </button>
            {/* <a href={viewerUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">
              فتح رابط المعاينة
            </a> */}
            <button onClick={() => navigator.clipboard.writeText(currentViewerUrl)} className="px-3 py-1.5 border rounded-lg bg-black text-white hover:opacity-90 hover:cursor-pointer hover:bg-white hover:text-black hover:border-black" >
              {lang === "ar" ? "نسخ الرابط" : "Copy Link"}
            </button>
          </div>

          <div className="mb-8 text-lg text-center">
            <span className={`${sizeHint.tone === "ok" ? "text-emerald-600" : sizeHint.tone === "warn" ? "text-amber-600" : "text-red-600"}`}>
              {lang === "ar" ? "طول الرابط:" : "Link Length"} {urlLength} — {sizeHint.text}
            </span>
            {/* {issues.length > 0 && (
              <ul className="mt-1 list-disc pr-5 text-red-600">
                {issues.map((i) => (
                  <li key={i.id}>{i.message}</li>
                ))}
              </ul>
            )} */}
          </div>

          <div className="flex flex-wrap gap-6 justify-center">
            {/* {(qr100 && (selectedValue !== "labels" && selectedValue !== "الملصقات")) && (
              <div className="grid place-items-center gap-2">
                <img src={qr100} alt="QR 100" className="w-[100px] h-[100px]" />
                <button onClick={() => download(qr100, "qr-100.png")} className="px-3 py-1.5 border rounded hover:text-white hover:cursor-pointer hover:bg-black font-black">
                  تنزيل 100×100
                </button>
              </div>
            )} */}
            {(qr100 && (selectedValue === "labels" || selectedValue === "الملصقات")) && (
              <div className="grid place-items-center gap-2">
                {/* ✅ Container for Labels QR export */}
                <div ref={qrRef} className="inline-flex flex-col items-center space-y-0 p-0 bg-white">
                  {/* <QRCode value="https://example.com" size={200} includeMargin /> */}
                  <img src={qr100} alt="QR 100" className="w-[100px] h-[100px]" />
                  {/* {doc?.theme?.docTitle === "Product Label" ||
                  doc?.theme?.docTitle === "ملصق المنتج" ? (
                  ) : null} */}
                  <span className="font-bold text-[8px] pb-1">CLOA-GAOA</span>
                </div>
                {/* <button onClick={() => download(qr100, "qr-100.png")} className="px-3 py-1.5 border rounded hover:text-white hover:cursor-pointer hover:bg-black font-black"> */}
                <button onClick={() => download("qr-100.png" , true)} className="px-3 py-1.5 border rounded hover:text-white hover:cursor-pointer hover:bg-black font-black">
                  تنزيل 100×100
                </button>
              </div>
            )}
            {(qr200 && (selectedValue == "Files" || selectedValue == "الملفات")) && (
              <section className="min-w-[30%] flex xxxs:flex-col-reverse xxxs:items-center xxxs:justify-between xxs:flex-row-reverse xxs:items-end xxs:justify-between">
                <div className="grid place-items-center gap-2">
                  <img src={qr200} alt="QR 200" className="w-[200px] h-[200px]" />
                  {/* <button onClick={() => download(qr200, "qr-200.png")} className="px-3 py-1.5 border rounded hover:text-white hover:cursor-pointer hover:bg-black font-black"> */}
                  <button onClick={() => download("qr-200.png", false, qr200)} className="px-3 py-1.5 border rounded hover:text-white hover:cursor-pointer hover:bg-black font-black">
                    تنزيل 200×200
                  </button>
                </div>
                <div className="grid place-items-center gap-2">
                    <img src={qr100} alt="QR 100" className="w-[100px] h-[100px]" />
                    {/* <button onClick={() => download(qr100, "qr-100.png")} className="px-3 py-1.5 border rounded hover:text-white hover:cursor-pointer hover:bg-black font-black"> */}
                    <button onClick={() => download("qr-100.png", false, qr100)} className="px-3 py-1.5 border rounded hover:text-white hover:cursor-pointer hover:bg-black font-black xxxs:mb-12 xxs:mb-0">
                      تنزيل 100×100
                    </button>
                </div>
              </section>
            )}
            {(qr100 && (selectedValue == "Certificates" || selectedValue == "الشهادات" 
            // || selectedValue == "الخدمات المستجدة" || selectedValue == "New Services" 
            || selectedValue == "Services" || selectedValue == "الخدمات")) && (
                <div className="grid place-items-center gap-2">
                    <img src={qr100} alt="QR 100" className="w-[100px] h-[100px]" />
                    {/* <button onClick={() => download(qr100, "qr-100.png")} className="px-3 py-1.5 border rounded hover:text-white hover:cursor-pointer hover:bg-black font-black"> */}
                    <button onClick={() => download("qr-100.png", false, qr100)} className="px-3 py-1.5 border rounded hover:text-white hover:cursor-pointer hover:bg-black font-black">
                      تنزيل 100×100
                    </button>
                </div>
            )}
          </div>
        </section>
            </div>
          )
        }
      </>
    );
  }
