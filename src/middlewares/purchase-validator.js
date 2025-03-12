import Product from "../product/product.model.js";

export const validateProductExistence = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error(`Producto con ID ${productId} no encontrado`);
  }
  return product;
};

export const validateProductStock = async (product, quantity) => {
  if (product.stock < quantity) {
    throw new Error(`No hay suficiente stock para el producto ${product.name}`);
  }
};

export const revertStock = async (items) => {
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (product) {
      product.stock += item.quantity; // Aumentamos el stock original
      await product.save();
    }
  }
};

export const validateNewItemsStock = async (items) => {
  for (const item of items) {
    const product = await Product.findById(item.product);
    await validateProductStock(product, item.quantity); // Validar stock
  }
};

export const validateCartItemsStock = async (items) => {
  for (const item of items) {
    const product = await Product.findById(item.product);
    await validateProductStock(product, item.quantity); // Validar stock
  }
};

export const validateStockForCart = async (productId, quantity) => {
  const product = await Product.findById(productId);
  await validateProductStock(product, quantity); // Validar stock
};