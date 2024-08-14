import Product from "../models/product.js";
import APIFilters from "../utils/apiFilters.js";

// Get products => products
export const getProducts = async (req, res, next) => {
  try {
    const apiFilters = new APIFilters(Product, req.query).search();
    let products = await apiFilters.query;

    res.status(200).sendResponse("Products retrieved successfully", products);
  } catch (error) {
    next(error);
  }
};

// Create new Product => admin/products
export const newProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    res.status(200).sendResponse("Product created successfully", product);
  } catch (error) {
    next(error);
  }
};

// Get single product details => products/:id
export const getProductDetails = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next({
        status: 404,
        message: "Product not found"
      });
    }

    res.status(200).sendResponse("Product details retrieved successfully", product);
  } catch (error) {
    next(error);
  }
};

// Update product details => products/:id
export const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return next({
        status: 404,
        message: "Product not found"
      });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).sendResponse("Product updated successfully", product);
  } catch (error) {
    next(error);
  }
};

// Delete product => admin/products/:id
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next({
        status: 404,
        message: "Product not found"
      });
    }

    await product.deleteOne();

    res.status(200).sendResponse("Product deleted successfully", product);
  } catch (error) {
    next(error);
  }
};
