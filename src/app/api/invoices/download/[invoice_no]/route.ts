import { NextRequest, NextResponse } from "next/server";
import { BaseApiUrl } from "@/configs/settings";
import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ invoice_no: string }> }
) {
  const { invoice_no } = await params;

  try {
    // -------------------- Authenticate --------------------
    const cookie = request.headers.get("cookie") || "";
    const authResponse = await fetch(`${BaseApiUrl}/auth/me`, {
      headers: { Cookie: cookie },
      credentials: "include",
    });

    if (!authResponse.ok) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const authData = await authResponse.json();
    const partner_id = authData.user?.partner_id || authData.user?.id;

    if (!partner_id) {
      return NextResponse.json(
        { error: "Partner ID not found" },
        { status: 400 }
      );
    }

    // -------------------- Fetch invoice detail --------------------
    const invoiceResponse = await fetch(
      `${BaseApiUrl}/partners/invoice/detail?partner_id=${partner_id}&invoice_no=${invoice_no}`,
      { headers: { Cookie: cookie }, credentials: "include" }
    );

    if (!invoiceResponse.ok) {
      const backendError = await invoiceResponse.text();
      return NextResponse.json(
        { error: "Failed to fetch invoice data", details: backendError },
        { status: invoiceResponse.status }
      );
    }

    const invoiceData = await invoiceResponse.json();

    if (!invoiceData) {
      return NextResponse.json(
        { error: "Invoice not found", invoice_no },
        { status: 404 }
      );
    }

    // -------------------- Load Font --------------------
    const fontPath = path.join(process.cwd(), "public", "fonts", "Roboto-Regular.ttf");
    if (!fs.existsSync(fontPath)) {
      return NextResponse.json({ error: "Font file missing on server" }, { status: 500 });
    }
    const fontBuffer = fs.readFileSync(fontPath);

    // -------------------- Create PDF --------------------
    const buffers: Buffer[] = [];
    const doc = new PDFDocument({ margin: 50, font: null });

    const finished = new Promise<Buffer>((resolve, reject) => {
      doc.on("data", (chunk: Buffer) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (err) => reject(err));
    });

    doc.registerFont("Roboto", fontBuffer);
    doc.font("Roboto");

    // -------------------- Header --------------------
    doc.fontSize(22).text("LabsCheck Pvt. Ltd.", { align: "center" });
    doc.moveDown(0.3);
    doc.fontSize(12).text("123 Health Street, Pune, Maharashtra", { align: "center" });
    doc.text("Email: support@labscheck.com | Phone: +91 98765 43210", { align: "center" });
    doc.moveDown(1.2);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

    // -------------------- Invoice Info --------------------
    doc.moveDown(1);
    doc.fontSize(16).text("INVOICE", { align: "center", underline: true });
    doc.moveDown(1);

    const leftStart = 50;
    const rightStart = 350;

    doc.fontSize(12);
    doc.text(`Invoice No: ${invoiceData.invoice_no}`, leftStart);
    doc.text(`Date: ${invoiceData.created_at?.split("T")[0] || new Date().toLocaleDateString()}`);
    doc.moveDown(0.5);
    doc.text(`Partner ID: ${partner_id}`, leftStart);

    const paymentStatusY = doc.y - 20;
    doc.text(`Payment Status: ${invoiceData.status || "Pending"}`, rightStart, paymentStatusY);
    doc.moveDown(1);

    // -------------------- Billed To --------------------
    doc.fontSize(14).text("Billed To:", leftStart);
    doc.fontSize(12);
    doc.text(`${authData.user?.name || "Partner User"}`);
    doc.text(`${authData.user?.email || "N/A"}`);
    doc.moveDown(1);

    // -------------------- Table --------------------
    doc.fontSize(13).text("Description", leftStart, doc.y);
    doc.text("Qty", 300, doc.y);
    doc.text("Price", 400, doc.y);
    doc.text("Total", 480, doc.y);
    doc.moveTo(50, doc.y + 15).lineTo(550, doc.y + 15).stroke();
    doc.moveDown(1);

    doc.fontSize(12);
    const amount = Number(invoiceData.amount || 0);
    doc.text(`${invoiceData.plan_id || "Subscription Plan"}`, leftStart);
    doc.text("1", 310, doc.y - 15);
    doc.text(amount.toFixed(2), 410, doc.y - 15);
    doc.text(amount.toFixed(2), 490, doc.y - 15);

    doc.moveDown(2);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);
    doc.text("Subtotal", 400, doc.y);
    doc.text(amount.toFixed(2), 490, doc.y);
    const gst = amount * 0.18;
    doc.text("GST (18%)", 400, doc.y + 15);
    doc.text(gst.toFixed(2), 490, doc.y + 15);
    doc.moveDown(1);
    doc.fontSize(13).text("Total Amount", 400, doc.y + 15);
    doc.text(String((amount + gst).toFixed(2)), 490, doc.y + 15);

    // -------------------- Footer --------------------
    doc.moveDown(3);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);
    doc.fontSize(10).text("Thank you for your business!", { align: "center" });
    doc.text("This is a system-generated invoice. No signature required.", { align: "center" });

    // -------------------- Finalize PDF --------------------
    doc.end();
    const pdfBuffer = await finished;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice_${invoice_no}.pdf"`,
        "Content-Length": String(pdfBuffer.length),
      },
    });
  } catch (error) {
    console.error("Error downloading invoice:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
