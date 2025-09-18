// src/lib/qr.ts
import QRCode from "qrcode";

export async function qrToDataUrl(text: string, size: number) {
  // if(size>=150){
  //   return QRCode.toDataURL(text, {
  //     width: size,
  //     errorCorrectionLevel: "M",
  //     margin: 1,
  //     scale: undefined,
  //   });
  // }
  return QRCode.toDataURL(text, {
    width: size,
    errorCorrectionLevel: "H",
    margin: 1,
    scale: undefined,
  });
  // else{
  //   // if(text.length<500){

  //   //   return QRCode.toDataURL(text, {
  //   //     errorCorrectionLevel: "M",
  //   //     margin: 1,
  //   //     scale: size/70,
  //   //   });

  //   // }
  //   // else if(text.length<=1000 && text.length >=500){

  //   //   return QRCode.toDataURL(text, {
  //   //     errorCorrectionLevel: "M",
  //   //     margin: 1,
  //   //     scale: size/105,
  //   //   });
  //   // }
  //   // else if(text.length<=1500 && text.length > 1000){
  //   //   return QRCode.toDataURL(text, {
  //   //     errorCorrectionLevel: "M",
  //   //     margin: 1,
  //   //     scale: size/130,
  //   //   });
  //   // }
  //   // return QRCode.toDataURL(text, {
  //   //   errorCorrectionLevel: "M",
  //   //   margin: 1,
  //   //   scale: undefined,
  //   //   // scale: size/140,
  //   // });
  // }
}
