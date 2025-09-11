// src/lib/email.ts
import nodemailer from 'nodemailer';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

type DemoBookingDetails = {
    name: string;
    email: string;
    selectedDate: string;
    selectedTime: string;
}

// These are now read from your .env file.
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const FROM_EMAIL = process.env.FROM_EMAIL || SMTP_USER; // Use SMTP_USER as fallback for FROM_EMAIL

// Create a transporter object. This will only be used if the required environment variables are set.
const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465, // true for 465, false for other ports like 587
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
    },
});

/**
 * Sends a demo confirmation email to the student.
 * To send real emails, you need to configure your credentials in the .env file.
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
        <p>If you need to reschedule, please contact us at <a href="mailto:${FROM_EMAIL || 'support@francobuddy.com'}">${FROM_EMAIL || 'support@francobuddy.com'}</a>.</p>
        <p>We look forward to seeing you soon!</p>
        <p>Best regards,</p>
        <p>The FrancoBuddy Team</p>
    `;

    // If essential SMTP variables are missing, log to console instead of trying to send.
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
        console.log("--- SIMULATED EMAIL (SMTP not configured) ---");
        console.log(`To: ${email}`);
        console.log(`Subject: Your FrancoBuddy Demo Class is Confirmed!`);
        console.log(`Body (HTML would be sent):\n${emailHtml.replace(/<[^>]*>/g, '\n').replace(/\n\s*\n/g, '\n')}`);
        console.log("-----------------------------------------");
        return;
    }

    try {
        const info = await transporter.sendMail({
            from: `FrancoBuddy <${FROM_EMAIL}>`,
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
