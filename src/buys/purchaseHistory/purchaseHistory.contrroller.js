import Bill from "../bill/bill.model.js";
import jwt from "jsonwebtoken";

export const listPurchaseHistory = async (req, res) => {
  const token = req.header("x-token"); 

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    const bills = await Bill.find({ user: uid })
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
        purchase: `Purchase #${index + 1}`, 
        total: bill.total,
        items: bill.items, 
      };
    });

    res.status(200).json(formattedBills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};