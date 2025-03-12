import bcrypt from "bcryptjs";
import User from "../user/user.model.js";
import argon2 from "argon2";

export const listUser = async (req, res) => {
  try {
    const { limite = 10, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, users] = await Promise.all([
      User.countDocuments(query),
      User.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.status(200).json({
      success: true,
      total,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error al obtener usuarios",
      error,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, username, address, preferences } = req.body;

    const user = await User.findById(id);

    if (name) user.name = name;
    if (username) user.username = username;
    if (address) user.address = address;
    if (preferences) user.preferences = preferences;

    await user.save();

    const { password, __v, role, ...userData } = user.toObject();
    userData.uid = user._id;

    res.status(200).json({
      success: true,
      msg: "Perfil actualizado",
      user: userData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error al actualizar perfil",
      error,
    });
  }
};

export const updatePassword = async (req, res) => {
  
  try {
    const { id } = req.params;
    const { contraAntigua, contraNueva } = req.body;

    if (!contraNueva) {
      return res.status(400).json({
        success: false,
        message: "Se debe proporcionar una nueva contraseña"
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "Usuario no encontrado"
      });
    }

    if (contraAntigua) {
      const passwordMatch = await argon2.verify(user.password, contraAntigua);
      if (!passwordMatch) {
        return res.status(400).json({
          success: false,
          msg: "La contraseña actual es incorrecta"
        });
      }
    }

    user.password = await argon2.hash(contraNueva);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Contraseña actualizada correctamente",
      user: {
        id: user._id,
        email: user.email, 
        role: user.role
      }
    });
    
  } catch (err) {
    console.error("Error en updatePassword:", err);
    return res.status(500).json({
      success: false,
      message: "Error al actualizar la contraseña",
      error: err.message || "Error desconocido"
    });
  }
  
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    const user = await User.findById(id);

    if (password) {
      const passwordMatch = await argon2.verify(user.password, password);
      if (!passwordMatch) {
        return res.status(400).json({
          success: false,
          msg: "La contraseña actual es incorrecta"
        });
      }
    }
    const deletedUser = await User.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.status(200).json({
      success: true,
      msg: "Usuario desactivado",
      user: deletedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error al desactivar usuario",
      error,
    });
  }
};
