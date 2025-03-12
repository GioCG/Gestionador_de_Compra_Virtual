import jwt from "jsonwebtoken";

export const isSameUser = (req, res, next) => {
    const token = req.header("x-token");
  
    if (!token) {
      return res.status(401).json({ error: "Token no proporcionado" });
    }
  
    try {
      // Verificar el token y extraer el id del usuario autenticado
      const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
  
      // Obtener el id del usuario de la petición
      const userId = req.params.id;
  
      // Comparar los IDs
      if (uid !== userId) {
        return res.status(403).json({ error: "Acceso denegado. No puedes modificar datos de otro usuario" });
      }
  
      next();
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  };