import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { addProductInCart, createCart, deleteCart, deleteProductsInCart, getCartById, updateProductsInCart } from "../dao/controllers/mongoCartsManager.js";
import { createTicket, deleteTicket } from "../dao/controllers/ticketController.js";



const router = Router();

router.get('/:cid', auth(['admin', 'premium', 'user']), getCartById);
router.post('/', auth(['admin', 'premium', 'user']), createCart);
router.post('/:cid/product/:pid', auth(['admin', 'premium', 'user']), addProductInCart);
router.delete('/:cid/products/:pid', auth(['admin', 'premium', 'user']), deleteProductsInCart);
router.put('/:cid/products/:pid', auth(['admin', 'premium', 'user']), updateProductsInCart);
router.delete('/:cid', auth(['admin', 'premium', 'user']), deleteCart);
router.post('/:cid/purchase', auth(['premium', 'user', 'admin']), createTicket)
router.delete('/delete/:tid', auth(['premium', 'user', 'admin']), deleteTicket);

export default router;
