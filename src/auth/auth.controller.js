import User from '../user/user.model.js';
import { hash, verify } from 'argon2';
import { generarJWT} from '../helpers/generate-jwt.js';

export const login = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        const user = await User.findOne({
            $or: [{ email: email?.toLowerCase() }, { username }]
        });

        if (!user || !user.estado) {
            return res.status(400).json({ msg: 'Credenciales incorrectas o usuario inactivo' });
        }

        const validPassword = await verify(user.password, password);
        if (!validPassword) {
            return res.status(400).json({ msg: 'Contraseña incorrecta' });
        }

        const token = await generarJWT(user.id, user.role);

        return res.status(200).json({
            msg: 'Inicio de sesión exitoso',
            userDetails: {
                username: user.username,
                role: user.role,
                token
            }
        });

    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Error en el servidor",
            error: e.message
        });
    }
};

export const registerCustomer = async (req, res) => {
    try {
        const { name, username, email, password,preferences,address } = req.body;

        const encryptedPassword = await hash (password);

        const user = await User.create({
            name,
            username,
            email: email.toLowerCase(),
            password: encryptedPassword,
            preferences,
            address,
            role: "CUSTOMER_ROLE",
            })

        return res.status(201).json({
            message: "Customer registered successfully",
            userDetails: {
                customer: user.name
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Customer registration failed",
            error: error.message
        })
    }
}

export const registerAdmin = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        const encryptedPassword = await hash (password);

        const user = await User.create({
            name,
            username,
            email: email.toLowerCase(),
            password: encryptedPassword,
            role: "ADMIN_ROLE",
            })

        return res.status(201).json({
            message: "Admin registered successfully",
            userDetails: {
                admin: user.name
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Admin registration failed",
            error: error.message
        })
    }
}