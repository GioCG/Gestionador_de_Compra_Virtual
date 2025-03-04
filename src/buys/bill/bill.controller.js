import Bill from "../bill/bill.model.js";
import User from "../../user/user.model.js";


export const listBillFromUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const bills = await Bill.find({ user: userId }).populate("items.product");
    res.status(200).json(bills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};