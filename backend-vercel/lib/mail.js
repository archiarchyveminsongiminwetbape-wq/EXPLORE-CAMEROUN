const nodemailer = require('nodemailer');
let PDFDocument; try { PDFDocument = require('pdfkit'); } catch (_) { PDFDocument = null; }

function buildMailer() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

async function generateReceiptPdfBuffer(info) {
  return new Promise((resolve, reject) => {
    if (!PDFDocument) return reject(new Error('pdfkit not available'));
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks = [];
    doc.on('data', (c) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(18).text('Reçu de paiement', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Référence: ${info.tx_ref || ''}`);
    doc.text(`Montant: ${info.amount || ''} ${info.currency || ''}`);
    doc.text(`Statut: ${info.status || ''}`);
    if (info.email) doc.text(`Client: ${info.email}`);
    doc.moveDown();
    const now = new Date();
    doc.text(`Date: ${now.toLocaleString()}`);
    doc.moveDown();
    doc.text('Merci pour votre confiance.', { align: 'left' });

    doc.end();
  });
}

async function sendReceiptEmail(to, payload) {
  const transporter = buildMailer();
  if (!transporter || !to) return;
  const subject = `Reçu de paiement - ${payload?.tx_ref || ''}`;
  const text = `Merci pour votre paiement.\n\nRéférence: ${payload?.tx_ref}\nMontant: ${payload?.amount} ${payload?.currency}\nStatut: ${payload?.status}\n`;
  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
  };
  if (PDFDocument) {
    try {
      const buf = await generateReceiptPdfBuffer({
        tx_ref: payload?.tx_ref,
        amount: payload?.amount,
        currency: payload?.currency,
        status: payload?.status,
        email: to,
      });
      mailOptions.attachments = [{ filename: `receipt_${payload?.tx_ref || 'payment'}.pdf`, content: buf }];
    } catch (e) {
      console.warn('PDF generation failed, sending email without attachment', e);
    }
  }
  await transporter.sendMail(mailOptions);
}

module.exports = { sendReceiptEmail, generateReceiptPdfBuffer };
