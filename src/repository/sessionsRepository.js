import { userModel } from "../dao/models/user.model.js";

class SessionsRepository {
    // Obtiene un usuario basado en un filtro específico
    async getBy(filter) {
        // Encuentra un usuario que coincida con el filtro y devuelve un objeto plano usando lean()
        return await userModel.findOne(filter).lean();
    }

    // Crea un nuevo usuario en la base de datos
    async create(user) {
        // Crea el usuario y devuelve el objeto JSON correspondiente
        let nuevoUsuario = await userModel.create(user);        
        return nuevoUsuario.toJSON();
    }

    // Actualiza los datos de un usuario basado en un filtro específico
    async update(filter, update) {
        // Encuentra y actualiza el usuario que coincide con el filtro, devolviendo el documento actualizado
        return await userModel.findOneAndUpdate(filter, update, { new: true }).lean();
    }

    // Elimina un usuario de la base de datos por su ID
    async deleteUser(userId) {
        // Busca y elimina el usuario por su ID
        return await userModel.findByIdAndDelete(userId);
    }

    // Obtiene una lista de todos los usuarios con los campos nombre, email y rol
    async get() {
        // Devuelve una lista de usuarios, excluyendo el campo _id
        return userModel.find({}, { _id: 0, nombre: 1, email: 1, rol: 1 });
    }
}

export default new SessionsRepository();
