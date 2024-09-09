import { request as req, response as res } from "express";
import { cartModel as carritoDB } from "../models/carts.js";
import { ticketModel as ticketDB } from "../models/ticket.js";
import { productModel as productoDB } from "../models/products.js";
import { sendEmail as enviarCorreo } from "../../services/mailingService.js";
import { CustomError as ErrorPersonalizado } from "../../utils/customError.js";
import { ERROR_TYPES as TIPOS_ERROR } from "../../utils/errorTypes.js";
import log from "../config/logger.js";

export const generarTicket = async (req = req, res = res) => {
    const { cid } = req.params;
    const usuario = req.user;

    try {
        if (!usuario) {
            log.error("Usuario no autenticado");
            return res.status(401).json({ msg: "Usuario no autenticado" });
        }

        log.debug("Usuario autenticado", usuario);

        const carrito = await carritoDB.findById(cid).populate('products.id');
        if (!carrito) {
            log.error(`El carrito con id ${cid} no existe`);
            ErrorPersonalizado.createError(
                "ErrorCarrito",
                `El carrito con id ${cid} no existe`,
                TIPOS_ERROR.CART_NOT_FOUND.message,
                TIPOS_ERROR.CART_NOT_FOUND.code
            );
        }

        log.debug("Carrito encontrado", carrito);

        let precioTotal = 0;
        const productosTicket = [];
        const productosNoProcesados = [];
        let detallesCorreo = "";

        for (const item of carrito.products) {
            log.debug("Procesando producto en el carrito", item);

            try {
                const producto = await productoDB.findById(item.id._id);
                const cantidad = item.quantity;

                if (!producto) {
                    log.warn(`Producto con id ${item.id._id} no encontrado`);
                    productosNoProcesados.push(item.id._id);
                    continue;
                }

                log.debug("Producto encontrado", producto);

                if (producto.stock >= cantidad) {
                    producto.stock -= cantidad;
                    await producto.save();

                    const precio = producto.price;
                    precioTotal += precio * cantidad;

                    productosTicket.push({
                        productId: producto._id,
                        quantity: cantidad,
                        price: precio,
                        title: producto.title,
                        description: producto.description,
                    });

                    log.debug("Producto añadido al ticket", {
                        productId: producto._id,
                        quantity: cantidad,
                        price: precio,
                        title: producto.title,
                        description: producto.description,
                    });

                    detallesCorreo += `
                        <p><b>${producto.title}</b></p>
                        <p>Descripción: ${producto.description}</p>
                        <p>Precio unitario: ${precio.toFixed(2)} (Cantidad: ${cantidad})</p>
                        <hr>`;
                } else {
                    log.warn(`Producto con id ${item.id._id} no tiene suficiente stock`);
                    productosNoProcesados.push(item.id._id);
                }
            } catch (error) {
                log.error(`Error al procesar producto con id ${item.id._id}: ${error.message}`);
                productosNoProcesados.push(item.id._id);
            }
        }

        if (productosTicket.length === 0) {
            log.error("No se pudieron procesar los productos por falta de stock");
            ErrorPersonalizado.createError(
                "ErrorStock",
                "No se pudieron procesar los productos por falta de stock",
                TIPOS_ERROR.OUT_OF_STOCK.message,
                TIPOS_ERROR.OUT_OF_STOCK.code
            );
        }

        const nuevoTicket = new ticketDB({
            user: usuario._id,
            cart: cid,
            totalPrice: precioTotal,
            products: productosTicket
        });

        await nuevoTicket.save();
        log.debug(`Ticket creado y guardado en la base de datos ${nuevoTicket}`);

        carrito.products = carrito.products.filter(item => productosNoProcesados.includes(item.id._id));
        await carrito.save();
        log.debug("Carrito actualizado después de crear el ticket", carrito);

        const asunto = 'Confirmación de compra';
        const htmlCorreo = `
            <p>Estimado/a <b>${usuario.nombre}</b>,</p>
            <p>Su compra fue exitosa. A continuación los detalles de los productos adquiridos:</p>
            ${detallesCorreo}
            <p><b>Total: ${precioTotal.toFixed(2)}</b></p>
        `;

        await enviarCorreo(usuario.email, asunto, htmlCorreo);
        log.info(`Usuario con correo ${usuario.email} completó la compra exitosamente.`);

        return res.json({ msg: 'Ticket creado y correo enviado correctamente', ticket: nuevoTicket, productosNoProcesados });
    } catch (error) {
        log.error('Error al crear el ticket:', error);
        return res.status(error.code || 500).json({ msg: error.message });
    }
};

export const eliminarTicket = async (req = req, res = res) => {
    const { tid } = req.params;

    try {
        const ticket = await ticketDB.findByIdAndDelete(tid);
        if (!ticket) {
            ErrorPersonalizado.createError(
                "ErrorTicket",
                `El ticket con id ${tid} no existe`,
                TIPOS_ERROR.PRODUCT_NOT_FOUND.message,
                TIPOS_ERROR.PRODUCT_NOT_FOUND.code
            );
        }

        return res.json({ msg: 'Ticket eliminado correctamente -- APTO PARA REALIZAR UNA NUEVA COMPRA', ticket });
    } catch (error) {
        log.error('Error al eliminar el ticket:', error);
        return res.status(error.code || 500).json({ msg: error.message });
    }
};
