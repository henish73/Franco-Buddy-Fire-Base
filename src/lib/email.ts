// src/lib/email.ts
import nodemailer from 'nodemailer';

// No need to call config() here, Next.js handles .env loading.

type DemoBookingDetails = {
    name: string;
    email: string;
    selectedDate: string;
    selectedTime: string;
}

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const FROM_EMAIL = process.env.FROM_EMAIL || SMTP_USER;

const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
    },
});

function generateCalendarLinks(details: DemoBookingDetails, googleMeetLink: string) {
    const { selectedDate, selectedTime } = details;

    // Parse time and create start/end Date objects in UTC
    const [time, period] = selectedTime.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (period === 'PM' && hours < 12) {
        hours += 12;
    }
    if (period === 'AM' && hours === 12) { // Midnight case
        hours = 0;
    }

    const startDate = new Date(selectedDate);
    startDate.setUTCHours(hours, minutes, 0, 0);
    
    // Demo is 30 minutes long
    const endDate = new Date(startDate.getTime() + 30 * 60 * 1000);

    const title = encodeURIComponent("FrancoBuddy TEF Demo Class");
    const description = encodeURIComponent(`Your personalized TEF Canada demo class with a FrancoBuddy expert.\n\nJoin here: ${googleMeetLink}`);

    // Format for Google Calendar (YYYYMMDDTHHMMSSZ)
    const googleFormat = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const googleLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${googleFormat(startDate)}/${googleFormat(endDate)}&details=${description}&location=${encodeURIComponent(googleMeetLink)}`;

    // Simple .ics file content
    const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "BEGIN:VEVENT",
        `DTSTART:${googleFormat(startDate)}`,
        `DTEND:${googleFormat(endDate)}`,
        `SUMMARY:${details.name}'s FrancoBuddy Demo`,
        `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
        `LOCATION:${googleMeetLink}`,
        "END:VEVENT",
        "END:VCALENDAR"
    ].join("\n");
    const icsLink = `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`;

    return { googleLink, icsLink };
}

export async function sendDemoConfirmationEmail(details: DemoBookingDetails): Promise<void> {
    const { name, email, selectedDate, selectedTime } = details;
    const googleMeetLink = `https://meet.google.com/lookup/${Math.random().toString(36).substring(2, 12)}`;
    const { googleLink, icsLink } = generateCalendarLinks(details, googleMeetLink);
    
    const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
    });

    const emailHtml = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Confirmation of Your FrancoBuddy Demo Class</h2>
            <p>Hello ${name},</p>
            <p>Thank you for booking a free demo class with FrancoBuddy! We're excited to help you on your French learning journey.</p>
            <p><strong>Here are your demo details:</strong></p>
            <ul>
                <li><strong>Date:</strong> ${formattedDate}</li>
                <li><strong>Time:</strong> ${selectedTime} (EST)</li>
                <li><strong>Meeting Link:</strong> <a href="${googleMeetLink}">${googleMeetLink}</a></li>
            </ul>
            <p>Please join the meeting a few minutes early to ensure your audio and video are working correctly.</p>
            
            <table cellpadding="0" cellspacing="0" style="margin-top: 20px; border-spacing: 10px;">
                <tr>
                    <td><a href="${googleLink}" target="_blank" style="background-color: #4285F4; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; font-size: 14px;">Add to Google Calendar</a></td>
                    <td><a href="${icsLink}" style="background-color: #333; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; font-size: 14px;">Add to Other Calendar (.ics)</a></td>
                </tr>
            </table>

            <p style="margin-top: 25px;">If you need to reschedule, please contact us at <a href="mailto:${FROM_EMAIL || 'support@francobuddy.com'}">${FROM_EMAIL || 'support@francobuddy.com'}</a>.</p>
            <p>We look forward to seeing you soon!</p>
            <p>Best regards,<br>The FrancoBuddy Team</p>
        </div>
    `;

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
    }
}
