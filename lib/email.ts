import { Resend } from 'resend';
import { CLOSURE_MESSAGE, CONTACT_EMAIL } from '@/lib/config';

const FROM_EMAIL = 'OrderViaChat <onboarding@resend.dev>'; // Default Resend test email

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
        <h1>Welcome to OrderViaChat, ${name}! 🚀</h1>
        <p>Your store is now successfully created.</p>
        <p>You can access your admin dashboard here:</p>
        <p><a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://orderviachat.com'}/admin">Go to Dashboard</a></p>
        <br/>
        <p>If you have any questions, just reply to this email.</p>
    `;

    await sendEmail({
        to: email,
        subject: 'Welcome to OrderViaChat!',
        html
    });
}

export async function sendClosureNotice(email: string, name?: string) {
    const greeting = name ? `Hi ${name},` : 'Hello,';
    const html = `
        <div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 560px; margin: 0 auto; color: #1e293b;">
            <h1 style="font-size: 20px;">OrderViaChat — Service Closure Notice</h1>
            <p>${greeting}</p>
            <p>${CLOSURE_MESSAGE}</p>
            <p>We're grateful for the time you spent building your store with us.</p>
            <p>If you have any questions, just reply to this email or reach us at
                <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>.
            </p>
            <p style="color:#64748b; font-size: 13px; margin-top: 24px;">— The OrderViaChat Team</p>
        </div>
    `;

    return sendEmail({
        to: email,
        subject: 'Important: OrderViaChat has been permanently closed',
        html,
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
