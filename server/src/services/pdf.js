import PdfPrinter from "pdfmake";

// Define fonts
const fonts = {
  Roboto: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    italics: "Helvetica-Oblique",
    bolditalics: "Helvetica-BoldOblique",
  },
};

const printer = new PdfPrinter(fonts);

export const generateBookingPDF = (bookingData) => {
  return new Promise((resolve, reject) => {
    const docDefinition = {
      content: [
        { text: "FlyAnyTrip Booking Voucher", style: "header" },
        { text: `Booking ID: ${bookingData.id}`, margin: [0, 10, 0, 10] },
        { text: `Traveler: ${bookingData.travelerName}` },
        { text: `Details: ${bookingData.details}` },
      ],
      styles: {
        header: {
          fontSize: 22,
          bold: true,
        },
      },
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    const chunks = [];

    pdfDoc.on("data", (chunk) => chunks.push(chunk));
    pdfDoc.on("end", () => resolve(Buffer.concat(chunks)));
    pdfDoc.on("error", (err) => reject(err));
    pdfDoc.end();
  });
};
