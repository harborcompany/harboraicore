/**
 * Contact Form API Route
 * Handles demo requests and general inquiries
 */

import { Router, Request, Response } from 'express';
import { Resend } from 'resend';

export const contactRouter = Router();

// Initialize Resend only if key is present
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

interface ContactFormBody {
    name: string;
    email: string;
    company?: string;
    message: string;
    type?: 'demo' | 'support' | 'sales' | 'general';
}

/**
 * Submit contact form
 * POST /api/contact
 */
contactRouter.post('/', async (req: Request, res: Response) => {
    const { name, email, company, message, type = 'general' }: ContactFormBody = req.body;

    // Validation
    if (!name || !email || !message) {
        res.status(400).json({
            error: 'Bad Request',
            message: 'name, email, and message are required',
        });
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({
            error: 'Bad Request',
            message: 'Invalid email address',
        });
        return;
    }

    try {
        // Check if Resend is configured
        if (!resend) {
            console.warn('Resend API key missing. Email not sent.');
            res.status(200).json({
                success: true,
                message: 'Demo mode: Message received (Email service not configured).',
                id: 'demo-id',
            });
            return;
        }

        // Send email via Resend
        const { data, error } = await resend.emails.send({
            from: 'Harbor <noreply@harbor.ai>',
            to: ['sales@harbor.ai'],
            replyTo: email,
            subject: `[${type.toUpperCase()}] New inquiry from ${name}${company ? ` at ${company}` : ''}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Type:</strong> ${type}</p>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
                <hr />
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br />')}</p>
            `,
        });

        if (error) {
            console.error('Resend error:', error);
            res.status(500).json({
                error: 'Email Error',
                message: 'Failed to send email. Please try again later.',
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Your message has been sent. We\'ll get back to you soon!',
            id: data?.id,
        });
    } catch (err) {
        console.error('Contact form error:', err);
        res.status(500).json({
            error: 'Server Error',
            message: 'An unexpected error occurred',
        });
    }
});
