
import { userModel } from "../models/user.model.js";

export class UsersManagerMongo{

    async create(user){
        let nuevoUsuario =await userModel.create(user)
        return nuevoUsuario.toJSON()
    }

    async getBy(filter={}){
        return await userModel.findOne(filter).lean()
    }

    async update(filter, update) {
        return await userModel.findOneAndUpdate(filter, update, { new: true }).lean();
    }
    async deleteUser(req, res){
        return await userModel.findByIdAndDelete(_id);
    }
}

