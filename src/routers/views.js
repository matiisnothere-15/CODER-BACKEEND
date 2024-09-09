import { Router } from "express"
import { getProductsService } from "../services/productsManagerDBService.js"
import { getCartByIdService } from "../services/cartsServiceDB.js"
import { auth } from "../middleware/auth.js"
import { generateMockProducts } from "../services/mockingProducts.js"
import cartRepository from "../repository/cartRepository.js"
import UserDTO from "../dao/DTOs/sessionsDTO.js"
import { addProductInCart, deleteProductsInCart } from "../dao/controllers/mongoCartsManager.js"
import { createTicket } from "../dao/controllers/ticketController.js"




const router = Router()

router.get('/', async (req, res) => {

    const { payload } = await getProductsService({})
    return res.render('inicio', { productos: payload })
})

router.get('/realtimeproducts',  (req, res) => {
    return res.render('realTimeProducts')
})

router.get('/chat', (req, res) => {
    return res.render('chat')
})

router.get('/products', async (req, res) => {
    const result = await getProductsService({ ...req.query })
    const userDTO = new UserDTO(req.user);
    return res.render('products', { result, userDTO })
})

router.get('/cart/:cid', auth(['admin', 'premium','user']), async (req, res) => {
    const { cid } = req.params;
    const carrito = await cartRepository.getCartById(cid);
    const userDTO = new UserDTO(req.user);
    return res.render('cart', { carrito, userDTO });
});

router.post('/:cid/product/:pid', auth(['admin', 'premium','user']), addProductInCart);
router.delete('/:cid/product/:pid', auth(['admin', 'premium','user']), deleteProductsInCart);
router.post('/:cid/purchase', auth(['premium','user']), createTicket);

router.get('/mockingproducts', (req, res) => {
    const products = generateMockProducts();
    res.json(products);
});

router.get('/registro',(req,res)=>{

    res.status(200).render('register')
})

router.get('/login',(req,res)=>{

    let {error}=req.query

    res.status(200)
    return res.render('login', {error})
})

router.get('/resetPassword',(req,res)=>{

    let {error}=req.query

    res.status(200)
    return res.render('resetPassword', {error})
})

router.get('/reset-password/:token', (req, res) => {
    res.render('resetPasswordPortal', { token: req.params.token });
});


export default router