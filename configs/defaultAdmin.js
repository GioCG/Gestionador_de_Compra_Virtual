import bcrypt from "bcrypt"
import User from "../src/user/user.model.js"

export const createAdmin = async() =>{
    try{
        const adminData = {
            name: "Admin",
            username: "admin",
            email: "admin@example.com",
            password: "admin12345",
            preferences: "comida",
            role: "ADMIN_ROLE"
        };

        const saltos = await bcrypt.genSalt(10);
        adminData.password = await bcrypt.hash(adminData.password, saltos);

        const newAdmin = new User(adminData);
        await newAdmin.save();

        console.log("Administrador por defecto creado exitosamente.");
    }catch(err){
        console.error("Error al crear el administrador por defecto:", err.message);
    }
}