import Category from "../category/category.model.js";
import Product from "../product/product.model.js"
export const addCategory = async (req, res) => {
  const { name, description } = req.body;

  try {
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ error: "La category ya existe" });
    }

    // Crear la categoría
    const category = new Category({ name, description });

    // Guardar la categoría
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const listCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const category = await Category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ error: "Category no encontrada" });
    }

    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findByIdAndUpdate(id);
    if (!category) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    let defaultCategory = await Category.findOne({ name: "default" });

    await Product.updateMany({ category: id }, { category: defaultCategory._id });
    await Category.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.status(200).json({ message: "Categoría eliminada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
