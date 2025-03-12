import jwt from "jsonwebtoken";

export const tieneRole = (...roles) =>{
    return (req, res, next) =>{
        
        if(!req.usuario){
            return res.status(500).json({
                success: false,
                msg: 'Se quiere verificar un role sin validar el token primero'
            })
        }
    

        if(!roles.includes(req.usuario.role)){
            return res.status(401).json({
                success: false,
                msg:`Usuario no autorizado, posee un rol ${req.usuario.role} el role autorizado es ${roles}`
            })
        }
        next();
    }
}

export const isAdmin = (req, res, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  try {
    const { role } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    if (role !== "ADMIN_ROLE") {
      return res.status(403).json({ error: "Acceso denegado. Solo para administradores" });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};