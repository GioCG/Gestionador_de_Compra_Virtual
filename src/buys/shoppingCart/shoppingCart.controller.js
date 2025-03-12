import jwt from "jsonwebtoken";
import ShoppingCart from "./shoppingCart.model.js";
import Bill from "../bill/bill.model.js"
import { validateStockForCart, validateCartItemsStock } from "../../middlewares/purchase-validator.js";

export const addProductToCart = async (req, res) => {
  let { productId, quantity } = req.body;
  
  quantity = Number(quantity); 

  if (isNaN(quantity) || quantity <= 0) {
    return res.status(400).json({ error: "La cantidad debe ser un número mayor que cero" });
  }

  const token = req.header("x-token");
  
  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    // Validar si hay suficiente stock antes de agregar el producto al carrito
    await validateStockForCart(productId, quantity);

    let cart = await ShoppingCart.findOne({ user: uid });

    if (!cart) {
      cart = new ShoppingCart({ user: uid, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const confirmPurchase = async (req, res) => {
  const token = req.header("x-token");

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    // Obtener el carrito del usuario
    const cart = await ShoppingCart.findOne({ user: uid }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "El carrito está vacío" });
    }

    let totalAmount = 0;
    const billItems = [];

    await validateCartItemsStock(cart.items);

    for (const item of cart.items) {
      const product = item.product;
      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;

      product.stock -= item.quantity;
      product.sales += item.quantity; 

      await product.save();

      billItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        subtotal: subtotal,
      });
    }

    const bill = new Bill({
      user: uid,
      items: billItems,
      total: totalAmount,
    });

    await bill.save();

    // Vaciar el carrito
    await ShoppingCart.findOneAndUpdate({ user: uid }, { $set: { items: [] } });

    res.status(201).json({
      message: "Compra confirmada y factura generada",
      bill,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};