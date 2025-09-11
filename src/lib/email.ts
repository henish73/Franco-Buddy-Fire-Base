// src/lib/email.ts
import nodemailer from 'nodemailer';

type DemoBookingDetails = {
    name: string;
    email: string;
    selectedDate: string;
    selectedTime: string;
}

// In a real application, these would be in environment variables
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.example.com';
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
const SMTP_USER = process.env.SMTP_USER || 'user@example.com';
const SMTP_PASSWORD = process.env.SMTP_PASSWORD || 'password';
const FROM_EMAIL = process.env.FROM_EMAIL || '"FrancoBuddy" <no-reply@francobuddy.com>';

// Create a transporter object using the default SMTP transport
// You will need to configure this with your actual email service provider details.
const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465, // true for 465, false for other ports
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
    },
});

/**
 * Sends a demo confirmation email to the student.
 * To send real emails, you need to configure the transporter above and set environment variables.
 */
export async function sendDemoConfirmationEmail(details: DemoBookingDetails): Promise<void> {
    const { name, email, selectedDate, selectedTime } = details;

    // Simulate Google Meet link generation
    const googleMeetLink = `https://meet.google.com/lookup/${Math.random().toString(36).substring(2, 12)}`;
    
    const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    const emailHtml = `
        <h1>Confirmation of Your FrancoBuddy Demo Class</h1>
        <p>Hello ${name},</p>
        <p>Thank you for booking a free demo class with FrancoBuddy! We're excited to help you on your French learning journey.</p>
        <p><strong>Here are your demo details:</strong></p>
        <ul>
            <li><strong>Date:</strong> ${formattedDate}</li>
            <li><strong>Time:</strong> ${selectedTime} (EST)</li>
            <li><strong>Meeting Link:</strong> <a href="${googleMeetLink}">${googleMeetLink}</a></li>
        </ul>
        <p>Please join the meeting a few minutes early to ensure your audio and video are working correctly.</p>
        <p>If you need to reschedule, please contact us at <a href="mailto:${FROM_EMAIL}">${FROM_EMAIL}</a>.</p>
        <p>We look forward to seeing you soon!</p>
        <p>Best regards,</p>
        <p>The FrancoBuddy Team</p>
    `;

    // If SMTP variables are the default ones, log to console instead of trying to send.
    if (SMTP_HOST === 'smtp.example.com' || !process.env.SMTP_HOST) {
        console.log("--- SIMULATED EMAIL (SMTP not configured) ---");
        console.log(`To: ${email}`);
        console.log(`Subject: Your FrancoBuddy Demo Class is Confirmed!`);
        console.log(`Body (HTML would be sent):\n${emailHtml.replace(/<[^>]*>/g, '\n').replace(/\n\s*\n/g, '\n')}`);
        console.log("-----------------------------------------");
        return;
    }

    try {
        const info = await transporter.sendMail({
            from: FROM_EMAIL,
            to: email,
            subject: 'Your FrancoBuddy Demo Class is Confirmed!',
            html: emailHtml,
        });
        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error("Failed to send email:", error);
        // We will not re-throw the error to prevent the user-facing action from failing.
        // The lead is already created. Logging the error is sufficient for now.
    }
}
