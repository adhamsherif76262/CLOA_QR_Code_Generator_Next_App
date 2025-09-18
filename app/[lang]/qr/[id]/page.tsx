import { notFound } from "next/navigation";
import QRPreview from "../../../../components/qr/QrPreview";
import { QRDocument } from "../../../../types/qr";
// import QRPreview from "../../components/qr/QrPreview";
// import { QRDocument } from "../../types/qr";

async function getDocument(id: string): Promise<QRDocument | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/data/${id}.json`, {
      cache: "no-store",
    });

    if (!res.ok) return null;
    return (await res.json()) as QRDocument;
  } catch {
    return null;
  }
}

  
//   const params = useParams<{ id: string }>();
//   const [doc, setDoc] = useState<QRDocument | null>(null);
//   // 🔹 fetch JSON by id
//   useEffect(() => {
//     async function fetchDoc() {
//       try {
//         const res = await fetch(`/data/${params.id}.json`, { cache: "no-store" });
//         if (res.ok) {
//           const data = (await res.json()) as QRDocument;
//           setDoc(data);
//         } else {
//           setDoc(null);
//         }
//       } catch {
//         setDoc(null);
//       }
//     }
//     fetchDoc();
//   }, [params.id]);
  
interface PageProps {
  params: Promise<{ lang: string; id: string }>;
}

// export default async function QRViewPage({ params }: { params: { lang:string; id: string } }) {
// export default async function QRViewPage({ params }: { params: {id: string } }) {
//   const doc = await getDocument(params.id);
export default async function QRViewPage({ params }: PageProps) {
  const {id} = await params
  const doc = await getDocument(id);

  if (!doc) return notFound();

  return (
    // <div className="p-4">
    //   <h1 className="text-xl font-bold mb-4">{doc.theme.docTitle}</h1>
    // </div>
      <QRPreview doc={doc} />
  );
}
