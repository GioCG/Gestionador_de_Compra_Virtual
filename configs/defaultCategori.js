import Categori from "../src/category/category.model.js"
 
export const createDefaultCategori = async() =>{
    try{
        const categoriExistent = await  Categori.findOne({ name: "default" });
 
        if(categoriExistent){
            console.log("Ya existe una categoria por default");
            return;
        }
 
        const categoriData ={
            name: "default"
        };
 
        const nuewCategori = new Categori(categoriData);
        await nuewCategori.save();
        console.log("Categoria creada exitosamente")
    }catch(err){
        console.error("Error al crear la categoria por defecto:", err.message);
    }
}