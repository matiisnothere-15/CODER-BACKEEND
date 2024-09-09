import CartRepository from "../repository/cartRepository.js";
import productsRepository from "../repository/ProductsRepository.js"; 
import ticketRepository from "../repository/ticketRepository.js";

// Servicio para procesar la compra de un carrito
export const purchaseCartService = async (cid, email) => {
    // Obtiene el carrito por su ID
    const cart = await CartRepository.getCartById(cid);
    if (!cart) throw new Error("Cart not found");  // Si no se encuentra el carrito, lanza un error

    let totalAmount = 0;  // Variable para almacenar el monto total de la compra
    const productsToBuy = [];  // Lista de productos que se comprarán
    const productsNotProcessed = [];  // Lista de productos que no pudieron ser procesados debido a falta de stock

    // Itera sobre los productos en el carrito
    for (const item of cart.products) {
        const product = await productsRepository.getProductById(item.pid);  // Obtiene el producto por su ID

        // Verifica si hay suficiente stock del producto
        if (product.stock >= item.quantity) {
            // Calcula el total de la compra multiplicando el precio por la cantidad
            totalAmount += product.price * item.quantity;
            productsToBuy.push(item);  // Añade el producto a la lista de productos a comprar

            // Actualiza el stock del producto restando la cantidad comprada
            await productsRepository.updateProduct(item.pid, { stock: product.stock - item.quantity });
        } else {
            // Si no hay suficiente stock, agrega el producto a la lista de productos no procesados
            productsNotProcessed.push(item.pid);
        }
    }

    // Si hay productos procesados (con suficiente stock), crea un ticket de compra
    if (productsToBuy.length > 0) {
        const ticketData = {
            amount: totalAmount,  // Monto total de la compra
            purchaser: email      // Correo del comprador
        };
        await ticketRepository.createTicket(ticketData);  // Crea el ticket en el repositorio de tickets
    }

    // Actualiza el carrito para eliminar los productos que no fueron procesados
    cart.products = cart.products.filter(item => productsNotProcessed.includes(item.pid));
    await cart.save();  // Guarda el carrito actualizado

    // Devuelve el resultado del procesamiento de la compra
    return {
        message: "Compra procesada",  // Mensaje de éxito
        productsNotProcessed          // Lista de productos que no fueron procesados por falta de stock
    };
};
