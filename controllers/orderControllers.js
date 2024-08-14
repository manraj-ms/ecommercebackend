import Product from "../models/product.js";
import Order from "../models/order.js";

// Helper function to retrieve product price
const getProductPrice = async (productName) => {
  const product = await Product.findOne({ name: productName });
  if (!product) {
    throw new Error(`Product with name ${productName} not found`);
  }
  return product.price;
};

// Helper function to calculate total amount for an order
const getOrderTotalAmount = async (order) => {
  let total = 0;
  for (const item of order.orderItems) {
    const price = await getProductPrice(item.name);
    total += price * item.quantity;
  }
  return total;
};

// Create new Order => orders/new
export const newOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingInfo } = req.body;

    // Validate order items and populate product details
    const items = await Promise.all(orderItems.map(async (item) => {
      const product = await Product.findOne({ name: item.name });
      if (!product) {
        return next({
          status: 404,
          message: `Product with name ${item.name} not found`
        });
      }
      return {
        name: product.name,
        quantity: item.quantity,
        product: product._id
      };
    }));

    const order = await Order.create({
      orderItems: items,
      shippingInfo,
      user: req.user.name
    });

    // Calculate total amount for the order
    const totalAmount = await getOrderTotalAmount(order);

    // Add totalAmount to the order data
    const responseData = {
      ...order.toObject(),
      totalAmount
    };

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: responseData
    });
  } catch (error) {
    next(error);
  }
};

// Get current user orders => me/orders
export const myOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.name });

    const ordersWithTotalAmount = await Promise.all(orders.map(async (order) => {
      const totalAmount = await getOrderTotalAmount(order);
      return {
        ...order.toObject(),
        totalAmount
      };
    }));

    res.status(200).sendResponse("User orders retrieved", ordersWithTotalAmount);
  } catch (error) {
    next(error);
  }
};

// Get order details => orders/:id
export const getOrderDetails = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next({
        status: 404,
        message: "Order not found"
      });
    }

    const totalAmount = await getOrderTotalAmount(order);

    res.status(200).sendResponse("Order details fetched successfully", {
      ...order.toObject(),
      totalAmount,
    });
  } catch (error) {
    next(error);
  }
};

// Get all orders - ADMIN => admin/orders
export const allOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();

    const ordersWithTotalAmount = await Promise.all(orders.map(async (order) => {
      const totalAmount = await getOrderTotalAmount(order);
      return {
        ...order.toObject(),
        totalAmount
      };
    }));

    res.status(200).sendResponse("All orders retrieved", ordersWithTotalAmount);
  } catch (error) {
    next(error);
  }
};

// Update Order - ADMIN => admin/orders/:id
export const updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next({
        status: 404,
        message: "No such order with this id"
      });
    }

    if (order.orderStatus === "Delivered") {
      return next({
        status: 400,
        message: "Order already delivered"
      });
    }

    // Update products stock
    await Promise.all(order.orderItems.map(async (item) => {
      const product = await Product.findById(item.product.toString());
      if (!product) {
        return next({
          status: 404,
          message: `No such product with id ${item.product}`
        });
      }
      product.stock = product.stock - item.quantity;
      await product.save();
    }));

    order.orderStatus = req.body.status;

    await order.save();

    res.status(200).sendResponse("Order updated successfully", order);
  } catch (error) {
    next(error);
  }
};

// Delete order => admin/orders/:id
export const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next({
        status: 404,
        message: "No such order with this id"
      });
    }

    await order.deleteOne();

    res.status(200).sendResponse("Order deleted successfully", order);
  } catch (error) {
    next(error);
  }
};