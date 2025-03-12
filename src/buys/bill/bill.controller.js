import Bill from "../bill/bill.model.js";
import jwt from "jsonwebtoken";
import {validateProductExistence,revertStock,validateNewItemsStock,} from "../../middlewares/purchase-validator.js";

export const listBillFromUser = async (req, res) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    const bills = await Bill.find({ user: uid })
      .populate({
        path: "user",
        select: "name",
      })
      .populate({
        path: "items.product",
        model: "Product",
        select: "name price image",
      })
      .sort({ date: -1 });

    if (bills.length === 0) {
      return res.status(404).json({ message: "No se encontró historial de compras" });
    }

    const formattedBills = bills.map((bill, index) => {
      return {
        purchase: `Bill #${index + 1}`,
        bill,
      };
    });

    res.status(200).json(formattedBills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const editBill = async (req, res) => {
  const { id } = req.params;
  const { items } = req.body; 

  try {
    const bill = await Bill.findById(id).populate("items.product");
    if (!bill) {
      return res.status(404).json({ error: "Factura no encontrada" });
    }

    await revertStock(bill.items);

    bill.items = [];
    let totalAmount = 0;

    await validateNewItemsStock(items);

    for (const item of items) {
      const product = await validateProductExistence(item.product);

      const previousItem = bill.items.find(
        (existingItem) => existingItem.product.toString() === item.product.toString()
      );

      let quantityDifference = 0;

      if (previousItem) {
        quantityDifference = previousItem.quantity - item.quantity; 
      }

      if (quantityDifference > 0) {
        product.stock += quantityDifference; 
      }

      if (item.quantity > (previousItem ? previousItem.quantity : 0)) {
        const quantityToSubtract = item.quantity - (previousItem ? previousItem.quantity : 0);
        if (product.stock < quantityToSubtract) {
          throw new Error(`Stock insuficiente para el producto ${product.name}`);
        }
        product.stock -= quantityToSubtract;
      }

      await product.save();

      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;

      bill.items.push({
        product: item.product,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        subtotal,
      });
    }

    bill.total = totalAmount;

    await bill.save();

    res.status(200).json({
      message: "Factura actualizada correctamente",
      bill,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};