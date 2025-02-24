import Category from './category.model'
export const addCategori= async (req, res) => {
    try {
        const { name } = req.body;


        const category = await Category.create({
            name,
            })

        return res.status(201).json({
            message: "Categori registered successfully",
            categoriDetails: {
                category: category.name
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Categori registration failed",
            error: error.message
        })
    }
 }


export const listCategory = async (req, res) => {
    try {
        const {limite = 10,desde = 0} = req.query;
        const query = {estado:true};

        const [total,categois] = await Promise.all([
            Category.countDocuments(query),
            Category.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
        ])

        res.status(200).json({
            succes: true,
            total,
            categois
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            msg:'Error al obtener usuarios',
            error
        })
    }
}

export const updateCategory = async (req,res = response) =>{
    try {
        const {id} = req.params;
        const { _id, ...data} = req.body;

        const user = await Category.findByIdAndUpdate(id,data,{new:true});

        res.status(200).json({
            success:true,
            msg:'Category Actualizado',
            user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar category',
            error
        })
        
    }
}

export const deleteCategory = async(req,res) => {
    try {
        const{id} = req.params;
        const user = await Category.findByIdAndUpdate(id,{estado:false},{new:true});
        const authenticatedUser = req.user;
        res.status(200).json({
            success: true,
            msg: 'Category desactivado',
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