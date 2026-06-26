const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const CATALOG = {
  image:    { name: 'Image Cook',                single: 10000,  family: 25000  },
  content:  { name: 'Content Cook',              single: 30000,  family: 75000  },
  album:    { name: 'Album / Cover Art Cook',    single: 25000,  family: 62500  },
  social:   { name: 'Social Graphics Cook',      single: 20000,  family: 50000  },
  logo:     { name: 'Logo Cook',                 single: 30000,  family: 75000  },
  theme:    { name: 'Theme / Style Cook',        single: 40000,  family: 100000 },
  merch:    { name: 'Merch Cook',                single: 40000,  family: 100000 },
  video:    { name: 'Promo Video Cook',          single: 75000,  family: 187500 },
  webpage:  { name: 'Webpage Cook',              single: 50000,  family: 125000 },
  vibecode: { name: 'Vibe Code Cook',            single: 50000,  family: 125000 },
  feedback: { name: 'Beta Test / Feedback Cook', single: 25000,  family: 62500  },
  event:    { name: 'Event Branding Cook',       single: 250000, family: 625000 },
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Payment not configured.' });
  }

  try {
    const { cook, serving, rush, name, email, brief, assets } = req.body;

    const item = CATALOG[cook];
    if (!item) return res.status(400).json({ error: 'Unknown cook.' });

    let amount = serving === 'family' ? item.family : item.single;
    const isRush = rush === 'rush';
    if (isRush) amount = Math.round(amount * 1.5);

    const label = `${item.name} — ${serving === 'family' ? 'Family Style' : 'Single Serving'}${isRush ? ' (Rush)' : ''}`;
    const origin = (req.headers.origin || 'https://candycookz.com').replace(/\/$/, '');

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          unit_amount: amount,
          product_data: {
            name: label,
            description: 'Candy Cookz · candycookz.com',
          },
        },
        quantity: 1,
      }],
      customer_email: email || undefined,
      metadata: {
        cook,
        serving,
        rush: isRush ? 'rush' : 'standard',
        client_name: (name || '').slice(0, 499),
        brief: (brief || '').slice(0, 499),
        assets: (assets || '').slice(0, 499),
      },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cook?cook=${encodeURIComponent(cook)}`,
    });

    return res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err.message);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
};
