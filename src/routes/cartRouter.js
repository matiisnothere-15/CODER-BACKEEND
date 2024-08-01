import { Router } from 'express';
import mongoose, { isValidObjectId } from "mongoose";
import CartManager from '../dao/CartManagerMONGO.js';
import ProductManager from '../dao/ProductManagerMONGO.js';

export const router = Router();
const cartManager = new CartManager();
const productManager = new ProductManager();
const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartController');
const { authorizeUser } = require('../middleware/authorization');

/**
 * @swagger
 * /carts/{cid}/purchase:
 *   post:
 *     summary: Finalizar la compra de un carrito
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         description: ID del carrito
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Compra finalizada
 */
router.post('/:cid/purchase', authorizeUser, CartController.purchase);

router.get('/', async (req, res) => {
  /**
   * @swagger
   * /carts:
   *   get:
   *     summary: Obtener todos los carritos
   *     responses:
   *       200:
   *         description: Lista de carritos
   */
  try {
    res.setHeader('Content-Type', 'application/json')
    const cart = await cartManager.getCarts()

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: `Error inesperado en el servidor`, detalle: `${error.message}` });
  }
});

router.get('/:cid', async (req, res) => {
  /**
   * @swagger
   * /carts/{cid}:
   *   get:
   *     summary: Obtener un carrito por ID
   *     parameters:
   *       - in: path
   *         name: cid
   *         required: true
   *         description: ID del carrito
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Información del carrito
   */
  try {
    res.setHeader('Content-Type', 'application/json')
    const cid = req.params.cid

    if (!isValidObjectId(cid)) {
      return res.status(400).json({
        error: `Ingrese un ID de MongoDB válido`,
      });
    }

    const cart = await cartManager.getCartsBy({ _id: cid })
    if (cart) {
      res.status(200).json(cart);
    } else {
      return res.status(404).json({ error: `No existe un carrito con el ID: ${cid}` });
    }
  } catch (error) {
    res.status(500).json({ error: `Error inesperado en el servidor`, detalle: `${error.message}` });
  }
});

router.post('/', async (req, res) => {
  /**
   * @swagger
   * /carts:
   *   post:
   *     summary: Crear un nuevo carrito
   *     responses:
   *       200:
   *         description: Carrito creado
   */
  try {
    res.setHeader('Content-Type', 'application/json')
    const newCart = await cartManager.createCart();
    res.status(200).json(`Carrito creado: ${newCart}`)
  } catch (error) {
    res.status(500).json({ error: `Error inesperado en el servidor`, detalle: `${error.message}` });
  }
});

router.post('/:cid/products/:pid', async (req, res) => {
  /**
   * @swagger
   * /carts/{cid}/products/{pid}:
   *   post:
   *     summary: Agregar un producto al carrito
   *     parameters:
   *       - in: path
   *         name: cid
   *         required: true
   *         description: ID del carrito
   *         schema:
   *           type: string
   *       - in: path
   *         name: pid
   *         required: true
   *         description: ID del producto
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Producto agregado al carrito
   */
  res.setHeader('Content-Type', 'application/json')
  const { cid, pid } = req.params;

  if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
    return res.status(400).json({
      error: `Ingrese un ID de MongoDB válido`,
    });
  }

  let productExists = await productManager.getProductsBy({ _id: pid });
  if (!productExists) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(400).json({ error: `No existe un producto con el ID: ${pid}` })
  }

  let cartExists = await cartManager.getCartsBy({ _id: cid })
  if (!cartExists) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(404).json({ error: `No existe un carrito con el ID: ${cid}` })
  }
  try {
    let resultado = await cartManager.addProductToCart(cid, pid);
    res.status(200).json({ success: true, message: 'Producto agregado exitosamente', resultado })
  } catch (error) {
    res.status(500).json({ error: `Error inesperado en el servidor`, detalle: `${error.message}` });
  }
});

router.put('/:cid', async (req, res) => {
  /**
   * @swagger
   * /carts/{cid}:
   *   put:
   *     summary: Actualizar un carrito
   *     parameters:
   *       - in: path
   *         name: cid
   *         required: true
   *         description: ID del carrito
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Carrito actualizado
   */
  res.setHeader('Content-Type', 'application/json')
  let cid = req.params.cid
  let products = req.body;
  if (!isValidObjectId(cid)) {
    return res.status(400).json({
      error: `Ingrese un ID de MongoDB válido`,
    });
  }
   
  let cartExists = await cartManager.getCartsBy({ _id: cid })
  if (!cartExists) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(404).json({ error: `No existe un carrito con el ID: ${cid}` })
  }

  try {
    const newCart = await cartManager.updateCart(cid, products);
    return res.status(200).json(newCart);
  } catch (error) {
    res.status(500).json({ error: `Error inesperado en el servidor`, detalle: `${error.message}` });
  }
});

router.put('/:cid/products/:pid', async (req, res) => {
  /**
   * @swagger
   * /carts/{cid}/products/{pid}:
   *   put:
   *     summary: Actualizar la cantidad de un producto en el carrito
   *     parameters:
   *       - in: path
   *         name: cid
   *         required: true
   *         description: ID del carrito
   *         schema:
   *           type: string
   *       - in: path
   *         name: pid
   *         required: true
   *         description: ID del producto
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Producto actualizado en el carrito
   */
  res.setHeader('Content-Type', 'application/json')
  const { cid, pid } = req.params;
  let { quantity } = req.body;

  if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
    return res.status(400).json({
      error: `Ingrese un ID de MongoDB válido`,
    });
  }

  let productExists = await productManager.getProductsBy({ _id: pid });
  if (!productExists) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(400).json({ error: `No existe un producto con el ID: ${pid}` })
  }

  let cartExists = await cartManager.getCartsBy({ _id: cid })
  if (!cartExists) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(404).json({ error: `No existe un carrito con el ID: ${cid}` })
  }

  try {
    const result = await cartManager.updateProductQ(cid, pid, quantity);
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: `Error inesperado en el servidor`, detalle: `${error.message}` })
  }
});

router.delete('/:cid', async (req, res) => {
  /**
   * @swagger
   * /carts/{cid}:
   *   delete:
   *     summary: Eliminar todos los productos de un carrito
   *     parameters:
   *       - in: path
   *         name: cid
   *         required: true
   *         description: ID del carrito
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Todos los productos eliminados del carrito
   */
  res.setHeader('Content-Type', 'application/json')
  const cid = req.params.cid

  if (!isValidObjectId(cid)) {
    return res.status(400).json({
      error: `Ingrese un ID de MongoDB válido`,
    });
  }

  let cartExists = await cartManager.getCartsBy({ _id: cid })
  if (!cartExists) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(404).json({ error: `No existe un carrito con el ID: ${cid}` })
  }

  try {
    let carritoEliminado = await cartManager.deleteAllProductsFromCart(cid)
    if (carritoEliminado) {
      res.status(200).json({ message: 'All products removed from cart', carritoEliminado });
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json(
      {
        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
        detalle: `${error.message}`
      }
    )
  }
});

router.delete('/:cid/products/:pid', async (req, res) => {
  /**
   * @swagger
   * /carts/{cid}/products/{pid}:
   *   delete:
   *     summary: Eliminar un producto del carrito
   *     parameters:
   *       - in: path
   *         name: cid
   *         required: true
   *         description: ID del carrito
   *         schema:
   *           type: string
   *       - in: path
   *         name: pid
   *         required: true
   *         description: ID del producto
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Producto eliminado del carrito
   */
  res.setHeader('Content-Type', 'application/json')
  const { cid, pid } = req.params;

  if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
    return res.status(400).json({
      error: `Ingrese un ID de MongoDB válido`,
    });
  }

  let productExists = await ProductManager.getProductsBy({ _id: pid });
  if (!productExists) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(400).json({ error: `No existe un producto con el ID: ${pid}` })
  }

  let cartExists = await cartManager.getCartsBy({ _id: cid })
  if (!cartExists) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(404).json({ error: `No existe un carrito con el ID: ${cid}` })
  }

  try {
    const cart = await cartManager.deleteProductFromCart(cid, pid);

    if (cart) {
      res.status(200).json({ message: 'Product removed from cart', cart });
    } else {
      res.status(404).json({ message: 'Cart or product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product from cart', error });
  }
});

module.exports = router;
