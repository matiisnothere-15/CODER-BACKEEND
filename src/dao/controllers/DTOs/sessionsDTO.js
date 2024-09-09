class UserDTO {
    constructor(user) {
        this._id = user._id || user.id || undefined; 
        this.nombre = user.nombre;
        this.email = user.email;
        this.cart = user.cart||user.carrito;
        this.rol = user.rol;
        this.documents = user.documents
    }
}

export default UserDTO;
