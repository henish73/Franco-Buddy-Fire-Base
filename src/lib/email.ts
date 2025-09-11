// src/lib/email.ts
import nodemailer from 'nodemailer';

type DemoBookingDetails = {
    name: string;
    email: string;
    selectedDate: string;
    selectedTime: string;
}

const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const FROM_EMAIL = process.env.FROM_EMAIL || SMTP_USER;

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
        "END:CALENDAR"
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
    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASSWORD,
        },
    });

    try {
        console.log("Attempting to send email via Nodemailer using 'gmail' service...");
        const info = await transporter.sendMail({
            from: `FrancoBuddy <${FROM_EMAIL}>`,
            to: email, // The recipient's email address
            subject: 'Your FrancoBuddy Demo Class is Confirmed!',
            html: emailHtml,
        });
        console.log('Message sent successfully! Message ID: %s', info.messageId);
    } catch (error) {
        console.error("--- NODEMAILER GMAIL SERVICE ERROR ---");
        console.error("User:", SMTP_USER);
        console.error(error);
        console.error("--- END OF NODEMAILER ERROR ---");
        // Re-throwing the error so the calling action knows it failed
        throw new Error("Failed to send email. Check server logs for detailed error.");
    }
}
