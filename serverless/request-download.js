// Serverless function for handling download requests
// This would be deployed as a Vercel serverless function or Netlify function

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const {
            name,
            email,
            institution,
            purpose,
            publicationId,
            agreeToTerms
        } = req.body;

        // Validate required fields
        if (!name || !email || !purpose || !publicationId || !agreeToTerms) {
            return res.status(400).json({
                error: 'Missing required fields'
            });
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: 'Invalid email address'
            });
        }

        // In production, you would:
        // 1. Validate the publication exists
        // 2. Check for spam/abuse
        // 3. Store request in database
        // 4. Send notification emails

        // For demo, simulate processing
        const requestId = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Simulate sending notification email
        const adminNotification = {
            to: process.env.ADMIN_EMAIL,
            subject: `New Download Request: ${publicationId}`,
            text: `
                New download request received:

                Request ID: ${requestId}
                Publication: ${publicationId}
                Name: ${name}
                Email: ${email}
                Institution: ${institution}
                Purpose: ${purpose}
                Timestamp: ${new Date().toISOString()}

                Review and approve at: ${process.env.ADMIN_DASHBOARD_URL}
            `
        };

        const userConfirmation = {
            to: email,
            subject: 'Download Request Received',
            text: `
                Dear ${name},

                Your request to download "${publicationId}" has been received.

                Request ID: ${requestId}
                Status: Pending Review

                Our team will review your request and contact you within 3-5 business days.
                Approved requests will receive a time-limited download link via email.

                Please note: All downloads are tracked and subject to our terms of use.

                Best regards,
                Byiringiro Albert Academic Portfolio
            `
        };

        // In production, use a real email service like SendGrid, AWS SES, etc.
        // await sendEmail(adminNotification);
        // await sendEmail(userConfirmation);

        // Log request (in production, store in database)
        console.log('Download request:', {
            requestId,
            publicationId,
            name,
            email,
            institution,
            purpose,
            timestamp: new Date().toISOString(),
            ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
        });

        // Return success response
        return res.status(200).json({
            success: true,
            requestId,
            message: 'Request received. You will receive a confirmation email shortly.',
            nextSteps: 'Your request is under review. You will receive download instructions via email if approved.'
        });

    } catch (error) {
        console.error('Error processing request:', error);

        return res.status(500).json({
            error: 'Internal server error',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

// Example email sending function (would be implemented based on your email service)
async function sendEmail(emailData) {
    // Implementation depends on your email service
    // Example with SendGrid:
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    await sgMail.send({
        to: emailData.to,
        from: process.env.FROM_EMAIL,
        subject: emailData.subject,
        text: emailData.text,
        html: emailData.html
    });
    */
}
