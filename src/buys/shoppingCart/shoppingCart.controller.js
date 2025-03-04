import jwt from "jsonwebtoken"
import ShoppingCart from "./shoppingCart.model.js";
import Bill from "../bill/bill.model.js";

export const addProductToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

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
  
  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    const cart = await ShoppingCart.findOne({ user: uid }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "El carrito está vacío" });
    }

    let totalAmount = 0;
    const billItems = [];

    for (const item of cart.items) {
      const product = item.product;
      const subtotal = product.price * item.quantity; 
      totalAmount += subtotal;

      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `No hay suficiente stock de ${product.name}` });
      }

      product.stock -= item.quantity;
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

    await ShoppingCart.findOneAndUpdate({ user: uid }, { $set: { items: [] } });

    res.status(201).json({
      message: "Compra confirmada y factura generada",
      bill,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};