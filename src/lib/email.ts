import nodemailer from "nodemailer";

interface OrderEmailData {
    to: string;
    customerName: string;
    orderId: string;
    items: { title: string; price: number }[];
    total: number;
    downloadLinks: { title: string; url: string; expiresAt: string }[];
}

function getTransporter() {
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
        return null; // Fallback to console logging
    }

    return nodemailer.createTransport({
        host,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: false,
        auth: { user, pass },
    });
}

export async function sendOrderConfirmation(data: OrderEmailData) {
    const transporter = getTransporter();

    const itemsHtml = data.items
        .map(
            (item) =>
                `<tr><td style="padding:8px;border-bottom:1px solid #eee">${item.title}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">₹${item.price}</td></tr>`
        )
        .join("");

    const downloadsHtml = data.downloadLinks
        .map(
            (link) =>
                `<li style="margin:8px 0"><a href="${link.url}" style="color:#4f46e5;text-decoration:none;font-weight:600">${link.title}</a> <span style="color:#94a3b8;font-size:12px">(expires ${link.expiresAt})</span></li>`
        )
        .join("");

    const html = `
    <div style="max-width:600px;margin:0 auto;font-family:system-ui,sans-serif;color:#1e293b">
      <div style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:32px;text-align:center;border-radius:12px 12px 0 0">
        <h1 style="color:#fff;margin:0;font-size:24px">Order Confirmed! 🎉</h1>
      </div>
      <div style="padding:32px;background:#fff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px">
        <p>Hi ${data.customerName},</p>
        <p>Thank you for your purchase! Your order <strong>#${data.orderId.slice(-8).toUpperCase()}</strong> has been confirmed.</p>
        
        <h3 style="color:#4f46e5;border-bottom:2px solid #e0e7ff;padding-bottom:8px">Order Summary</h3>
        <table style="width:100%;border-collapse:collapse">
          ${itemsHtml}
          <tr style="font-weight:700">
            <td style="padding:12px 8px">Total</td>
            <td style="padding:12px 8px;text-align:right">₹${data.total}</td>
          </tr>
        </table>

        <h3 style="color:#4f46e5;border-bottom:2px solid #e0e7ff;padding-bottom:8px;margin-top:24px">Your Downloads</h3>
        <ul style="list-style:none;padding:0">${downloadsHtml}</ul>
        
        <div style="background:#f8fafc;padding:16px;border-radius:8px;margin-top:24px">
          <p style="margin:0;font-size:13px;color:#64748b">
            Download links expire after ${process.env.DOWNLOAD_EXPIRY_HOURS || 24} hours or ${process.env.DOWNLOAD_MAX_COUNT || 3} downloads. 
            If you have issues, contact us at support@collegedigital.com
          </p>
        </div>
      </div>
    </div>
  `;

    if (!transporter) {
        console.log("📧 Email (console fallback):");
        console.log(`  To: ${data.to}`);
        console.log(`  Subject: Order Confirmed - #${data.orderId.slice(-8).toUpperCase()}`);
        console.log(`  Downloads: ${data.downloadLinks.map((l) => l.url).join(", ")}`);
        return;
    }

    await transporter.sendMail({
        from: process.env.EMAIL_FROM || "store@collegedigital.com",
        to: data.to,
        subject: `Order Confirmed - #${data.orderId.slice(-8).toUpperCase()} | College Digital Store`,
        html,
    });
}
