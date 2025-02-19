const express = require('express');
const Razorpay = require('razorpay');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const twilio = require('twilio');

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Twilio Setup
const twilioClient = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Payment API
app.post('/create-order', async (req, res) => {
    const { amount, name, phone, product, quantity } = req.body;

    try {
        const order = await razorpay.orders.create({
            amount: amount * 100,
            currency: "INR",
            receipt: `order_rcptid_${Date.now()}`
        });

        // Send WhatsApp Confirmation
        const message = `Hi ${name}, your order for ${quantity} ${product}(s) is confirmed! Total: ₹${amount}. Payment Pending.`;
        await sendWhatsApp(phone, message);

        res.json(order);
    } catch (error) {
        res.status(500).send(error);
    }
});

// WhatsApp Function
function sendWhatsApp(to, message) {
    return twilioClient.messages.create({
        from: 'whatsapp:+14155238886',
        to: `whatsapp:${to}`,
        body: message
    });
}

app.listen(5000, () => console.log("Server running on port 5000"));
