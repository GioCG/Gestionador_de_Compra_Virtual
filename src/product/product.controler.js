import Product from "../product/product.model.js";
import Category from "../category/category.model.js";

export const addProduct = async (req, res) => {
  const { name, description, price, categoryName, stock, image } = req.body;

  try {
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res.status(400).json({ error: "Categoría no encontrada" });
    }

    const product = new Product({
      name,
      description,
      price,
      category: category._id,
      stock,
      image,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const searchProduct = async (req, res) => {
  const { name } = req.query;

  try {
    const products = await Product.find({
      name: { $regex: name, $options: "i" }, 
    }).populate("category");

    if (products.length === 0) {
      return res.status(404).json({ error: "No se encontraron productos" });
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const listProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const listProductsFilteredByCategory = async (req, res) => {
  const { categoryName } = req.params;

  try {
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    const products = await Product.find({ category: category._id }).populate("category");
    if (products.length === 0) {
      return res.status(404).json({ error: "No se encontraron productos en esta categoría" });
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const productStock = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const isOutOfStock = product.stock === 0;
    res.status(200).json({
      product: product.name,
      stock: product.stock,
      isOutOfStock,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const mostSaledProduct = async (req, res) => {
  try {
    const products = await Product.find().sort({ sales: -1 }).limit(1);
    if (products.length === 0) {
      return res.status(404).json({ error: "No se encontraron productos" });
    }
    res.status(200).json(products[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const mostSaledProducts = async (req, res) => {
  const { limit = 10 } = req.query; 

  try {
    const products = await Product.find().sort({ sales: -1 }).limit(parseInt(limit));
    if (products.length === 0) {
      return res.status(404).json({ error: "No se encontraron productos" });
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const mostSaledProductFromName = async (req, res) => {
  const { name } = req.query;

  try {
    const products = await Product.find({
      name: { $regex: name, $options: "i" },
    }).sort({ sales: -1 }).limit(1);

    if (products.length === 0) {
      return res.status(404).json({ error: "No se encontraron productos" });
    }
    res.status(200).json(products[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};