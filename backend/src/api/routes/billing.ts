
import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import { config } from '../../config/index.js';
import { requireScope } from '../middleware/auth.js';

export const billingRouter = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16', // Use a recent API version
});

/**
 * Create a Stripe Checkout Session
 * POST /api/billing/create-checkout-session
 */
billingRouter.post('/create-checkout-session', async (req: Request, res: Response) => {
    const { priceId, successUrl, cancelUrl } = req.body;

    if (!priceId) {
        return res.status(400).json({ error: 'priceId is required' });
    }

    try {
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: successUrl || `${process.env.FRONTEND_URL || 'http://localhost:5173'}/app/settings?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: cancelUrl || `${process.env.FRONTEND_URL || 'http://localhost:5173'}/pricing`,
        });

        res.json({ url: session.url });
    } catch (error: any) {
        console.error('Stripe Checkout Error:', error);
        res.status(500).json({ 
            error: 'Failed to create checkout session', 
            details: error.message 
        });
    }
});
