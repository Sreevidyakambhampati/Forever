import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe'

// global variables
const currency = 'inr'
const deliveryCharge = 10

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const saveNewOrdertoDB = async ({ userId, items, address }, paymentMethod) => {
    try {
        let newOrderId = '';
        if (Array.isArray(items)) {
            for (const item of items) {
                const orderData = {
                    sellerEmail: item?.sellerEmail,
                    userId,
                    items: [item],
                    address,
                    amount: Number(item?.quantity * item?.price),
                    paymentMethod,
                    payment: false,
                    date: Date.now()
                };

                const newOrder = new orderModel(orderData);
                await newOrder.save();
                newOrderId = newOrder?._id;
            }
        }
        return { success: true, newOrderId };
    } catch (error) {
        console.log(error);
        return { success: false, message: error?.message };
    }
};


// Placing orders using COD Method
const placeOrder = async (req, res) => {

    try {

        const { userId } = req.body;

        let { success, message } = await saveNewOrdertoDB(req.body, "COD");
        if (!success) return res.json({ success, message })

        await userModel.findByIdAndUpdate(userId, { cartData: {} })

        res.json({ success: true, message: "Order Placed" })


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// Placing orders using Stripe Method
const placeOrderStripe = async (req, res) => {
    try {

        const { items } = req.body
        const { origin } = req.headers;

        let { success, message, newOrderId } = await saveNewOrdertoDB(req.body, "Stripe");
        if (!success) return res.json({ success, message })

        const line_items = items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: 'Delivery Charges'
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrderId}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrderId}`,
            line_items,
            mode: 'payment',
        })

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Verify Stripe 
const verifyStripe = async (req, res) => {

    const { orderId, success, userId } = req.body

    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} })
            res.json({ success: true });
        } else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({ success: false })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}



// All Orders data for Admin Panel
const allOrders = async (req, res) => {

    try {
        const sellerEmail = req?.user?.email;
        const role = req?.user?.role;
        let filters = {};
        if (role !== 'admin') {
            filters = { sellerEmail };
        }
        const orders = await orderModel.find(filters)
        res.json({ success: true, orders })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// User Order Data For Frontend
const userOrders = async (req, res) => {
    try {

        const { userId } = req.body

        const orders = await orderModel.find({ userId })
        res.json({ success: true, orders })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// update order status from Admin Panel
const updateStatus = async (req, res) => {
    try {

        const { orderId, status } = req.body;

        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({ success: true, message: 'Status Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { verifyStripe, placeOrder, placeOrderStripe, allOrders, userOrders, updateStatus }