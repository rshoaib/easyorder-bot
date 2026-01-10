import { Resend } from 'resend';

const FROM_EMAIL = 'EasyOrder <onboarding@resend.dev>'; // Default Resend test email

interface SendEmailParams {
    to: string;
    subject: string;
    html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
        console.warn("⚠️ RESEND_API_KEY is missing. Skipping email send.");
        return;
    }

    try {
        const resend = new Resend(apiKey);
        const data = await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject,
            html,
        });
        console.log("Email sent successfully:", data);
        return data;
    } catch (error) {
        console.error("Failed to send email:", error);
        // Do not throw, so we don't break the registration flow
    }
}

export async function sendWelcomeEmail(email: string, name: string, slug: string) {
    const dashboardUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://orderviachat.com'}/store/${slug}/admin`;
    const html = `
        <h1>Welcome to EasyOrder, ${name}! 🚀</h1>
        <p>Your store is now successfully created.</p>
        <p>You can access your admin dashboard here:</p>
        <p><a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://orderviachat.com'}/admin">Go to Dashboard</a></p>
        <br/>
        <p>If you have any questions, just reply to this email.</p>
    `;

    await sendEmail({
        to: email,
        subject: 'Welcome to EasyOrder!',
        html
    });
}

export async function sendOrderNotification(tenantEmail: string, orderId: string, total: number, customerName: string) {
    const html = `
        <h1>New Order Received! 💰</h1>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Customer:</strong> ${customerName}</p>
        <p><strong>Total:</strong> $${total.toFixed(2)}</p>
        <br/>
        <p><a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://orderviachat.com'}/admin">View Order in Dashboard</a></p>
    `;

    await sendEmail({
        to: tenantEmail,
        subject: `New Order #${orderId} from ${customerName}`,
        html
    });
}
