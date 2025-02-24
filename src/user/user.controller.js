
import User from '../user/user.model.js';

export const listUser = async (req, res) => {
    try {
        const {limite = 10,desde = 0} = req.query;
        const query = {estado:true};

        const [total,users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
        ])

        res.status(200).json({
            succes: true,
            total,
            users
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            msg:'Error al obtener usuarios',
            error
        })
    }
}


export const updateUser = async (req,res = response) =>{
    try {
        const {id} = req.params;
        const { _id,email, password, ...data} = req.body;

        const user = await User.findByIdAndUpdate(id,data,{new:true});

        res.status(200).json({
            success:true,
            msg:'Usuario Actualizado',
            user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar usuario',
            error
        })
        
    }
}

export const deleteUser = async(req,res) => {
    try {
        const{id} = req.params;
        const user = await User.findByIdAndUpdate(id,{estado:false},{new:true});
        const authenticatedUser = req.user;
        res.status(200).json({
            success: true,
            msg: 'Usuario desactivado',
            user,
            authenticatedUser
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al desactivar usuario',
            error
        })
    }
};