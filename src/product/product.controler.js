import Product from "../product/product.model.js";
import Category from "../category/category.model.js";

// ADMIN_ROLE: Agregar producto (si ya existe, aumentar el stock)
export const addProduct = async (req, res) => {
  const { name, description, price, categoryName, stock, image } = req.body;

  try {
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res.status(400).json({ error: "Categoría no encontrada" });
    }

    // Verificar si el producto ya existe
    let product = await Product.findOne({ name });

    if (product) {
      // Si el producto existe, aumentar el stock
      product.stock += stock;
    } else {
      // Si no existe, crear un nuevo producto
      product = new Product({
        name,
        description,
        price,
        category: category._id,
        stock,
        image,
      });
    }

    await product.save();
    res.status(201).json({
      success: true,
      id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADMIN_ROLE: Buscar producto por nombre
export const searchProduct = async (req, res) => {
  try {
    const { name } = req.params;

    const products = await Product.find({
      name: { $regex: new RegExp(name, "i") },
    }).populate("category");

    if (products.length === 0) {
      return res.status(404).json({ error: "No se encontraron productos" });
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADMIN_ROLE: Listar todos los productos
export const listProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CLIENT_ROLE: Listar productos filtrados por categoría
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

// ADMIN_ROLE: Editar nombre, descripción y precio de un producto
export const editProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { name, description, price },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADMIN_ROLE: Editar solo el stock de un producto
export const editProductStock = async (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;

  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { stock },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADMIN_ROLE: Eliminar un producto
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.status(200).json({ message: "Producto eliminado correctamente" });
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