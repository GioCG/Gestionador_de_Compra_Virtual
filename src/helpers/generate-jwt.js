import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const generarJWT = (uid = "", role = "", password = "") => {
    return new Promise(async (resolve, reject) => {
        try {
            const hashedPassword = await bcrypt.hash(password, 10); 

            const payload = { uid, role, password: hashedPassword }; 

            jwt.sign(
                payload,
                process.env.SECRETORPRIVATEKEY,
                { expiresIn: "3h" },
                (err, token) => {
                    if (err) {
                        console.log(err);
                        reject("No se pudo generar el token");
                    } else {
                        resolve(token);
                    }
                }
            );
        } catch (error) {
            reject("Error al cifrar la contraseña");
        }
    });
};
