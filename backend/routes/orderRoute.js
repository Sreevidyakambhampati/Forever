import express from 'express'
import {placeOrder, placeOrderStripe, allOrders, userOrders, updateStatus, verifyStripe} from '../controllers/orderController.js'
import authUser from '../middleware/auth.js'
import hasAccessToAdminPanel from '../middleware/hasAccessToAdminPanel.js'

const orderRouter = express.Router()

// Admin Features
orderRouter.post('/list',hasAccessToAdminPanel,allOrders)
orderRouter.post('/status',hasAccessToAdminPanel,updateStatus)

// Payment Features
orderRouter.post('/place',authUser,placeOrder)
orderRouter.post('/stripe',authUser,placeOrderStripe)

// User Feature 
orderRouter.post('/userorders',authUser,userOrders)

// verify payment
orderRouter.post('/verifyStripe',authUser, verifyStripe)

export default orderRouter