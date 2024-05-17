import express from "express";
import {registerController,loginController,testController, forgotPasswordController, updateProfileController, getOrdersController} from '../controller/authController.js'
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import userModel from '../models/userModel.js';
import LoyaltyModel from '../models/LoyaltyModel.js';
import orderModel from '../models/orderModel.js';// router 
import ProductModel from "../models/ProductModel.js";


const router = express.Router()

//ROUTING

//REGISTER

router.post('/register', registerController)
//LOGIN

router.post('/login', loginController)

//forget password

router.post('/forgot-password',forgotPasswordController)


//test rouutes
router.get('/test', requireSignIn, isAdmin, testController)


//protected User Routes
router.get('/user-auth', requireSignIn,(req,res) =>{
    res.status(200).send({ok: true});
})


//protected  Admin Routes
router.get('/admin-auth', requireSignIn,isAdmin,(req,res) =>{
    res.status(200).send({ok: true});
})


//update profile
router.put("/profile", requireSignIn, updateProfileController);


//orders
router.get("/orders", requireSignIn, getOrdersController);



// Calculate and update loyalty points for the authenticated user when an order is placed
router.post('/calculate-loyalty', requireSignIn, async (req, res) => {
    try {
      const userId = req.user._id;
  
      if (!userId) {
        console.error('User ID not found');
        return res.status(401).json({ message: 'User not authenticated' });
      }
  
      // Fetch the user by ID
      const user = await userModel.findById(userId);
  
      if (!user) {
        console.error('User not found');
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Calculate loyalty points based on the new order placed
      const orderId = req.body.orderId;
      const order = await orderModel.findById(orderId).populate('products');
  
      if (!order) {
        console.error('Order not found');
        return res.status(404).json({ message: 'Order not found' });
      }
  
      if (order.buyer.toString() !== userId.toString()) {
        console.error('Unauthorized to update loyalty points for this order');
        return res.status(403).json({ message: 'Unauthorized' });
      }
  
      if (order.payment.success) {
        // Check if the order has already been confirmed for loyalty points
        if (order.isConfirmedForLoyaltyPoints) {
          console.log('Order already confirmed for loyalty points');
          return res.status(200).json({ message: 'Order already confirmed for loyalty points' });
        }
  
        let totalPurchaseAmount = 0;
  
        for (const product of order.products) {
          // Ensure that the product has a valid price before adding it to the total
          if (product.price) {
            totalPurchaseAmount += product.price;
          }
        }
  
        console.log('Total Purchase Amount:', totalPurchaseAmount);
  
        const loyaltyPointsEarned = Math.floor(totalPurchaseAmount / 10);
  
        console.log('Loyalty Points Earned:', loyaltyPointsEarned);
  
        // Update user's loyalty points
        user.loyaltyPoints += loyaltyPointsEarned;
        await user.save();
  
        // Mark the order as confirmed for loyalty points
        order.isConfirmedForLoyaltyPoints = true;
        await order.save();
  
        // Create a loyalty points record
        const loyaltyPoint = new LoyaltyModel({
          user: userId,
          pointsEarned: loyaltyPointsEarned,
        });
        await loyaltyPoint.save();
  
        return res.status(200).json({ message: 'Loyalty points updated successfully' });
      } else {
        console.error('Payment for the order has not been successful');
        return res.status(400).json({ message: 'Payment for the order has not been successful' });
      }
    } catch (error) {
      console.error('Error calculating loyalty points:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  

export default router;