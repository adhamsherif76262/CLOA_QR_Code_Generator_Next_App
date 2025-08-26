import { Suspense } from "react";
import QRView from "../../../components/qr/QrPreview"; // client component

export default function ViewPage() {
  return (
    <Suspense fallback={<div>Loading QR data...</div>}>
      <QRView />
    </Suspense>
  );
}
