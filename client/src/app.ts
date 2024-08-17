import {
    Stripe,
    StripeElements,
    loadStripe,
} from '@stripe/stripe-js';
import dotenv from 'dotenv';
dotenv.config();
import { STRIPE_PUBLIC_KEY } from './ref';

(function () {
    const el = <HTMLElement>document.getElementById('payment');
    const amountEl = <HTMLElement>document.getElementById('amount');
    const btn = <HTMLButtonElement>document.getElementById('submit');
    let stripe: Stripe;
    let elements: StripeElements;

    async function load() {
        if (!el) {
            return;
        }
        const payload = {
            userId: "66a8bb0235415f1959c39d30",
            amount: 20000,  // assuming amount is in the smallest currency unit (e.g., paise for INR)
            currency: "usd"
        };
        const amountDisplay = document.getElementById('amount');
        amountDisplay.textContent = `Amount to be paid: $${(payload.amount / 100).toFixed(2)}`;

        const rprom = await fetch(`/v1/stripe/createPaymentIntent`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        stripe = await loadStripe(STRIPE_PUBLIC_KEY) as Stripe;

        const res = await rprom;
        const data = await res.json();

        elements = stripe?.elements({
            clientSecret: data.data.clientSecret,
            loader: 'auto',
        });

        const payEl = elements?.create('payment', {
            layout: 'tabs',
        });

        payEl?.mount(el);
    }

    btn?.addEventListener('click', async () => {
        const sResult = await stripe?.confirmPayment({
            elements,
            redirect: 'if_required',
            confirmParams: {
                return_url: 'http://localhost:3000/server/src/views/success.html',
            },
        });

        if (!!sResult?.error) {
            alert(sResult.error.message);
            return;
        }

        const container = document.querySelector('.container');
        const success = document.querySelector('.success');

        if (!!container) {
            container.classList.add('hide');
        }

        if (!!success) {
            success.textContent += ` ${sResult.paymentIntent.id}`;
            success.classList.remove('hide');
        }
    });

    load();
})();