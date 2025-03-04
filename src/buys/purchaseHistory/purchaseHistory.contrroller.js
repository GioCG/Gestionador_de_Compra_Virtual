import PurchaseHistory from "../purchaseHistory/purchaseHistory.model.js"; 

export const listPurchaseHistory = async (req, res) => {
  const userId = req.user.id; 
 
  try {
    const history = await PurchaseHistory.find({ user: userId })
      .populate({
        path: "bill", 
        populate: {
          path: "items.product", 
          model: "Product",
        },
      })
      .sort({ date: -1 }); 
 
    if (history.length === 0) {
      return res.status(404).json({ message: "No se encontró historial de compras" });
    }
 
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};