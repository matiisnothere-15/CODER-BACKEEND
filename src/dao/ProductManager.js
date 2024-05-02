import fs  from "fs";
import {v4 as uuidv4} from "uuid";
import { Product } from './models.js';

async function getProducts() {
    return await Product.find();
}


export class ProductManager {

        constructor() {
            this.PATH = "./src/data/products.json";
            this.products = [];
        }; 
        

    addProduct = async ({title, description, price, thumbnail, code, stock, status, category}) => { 
        const id = uuidv4()

        let newProduct =  { id , title, description, price, thumbnail, code, stock, status, category}

        this.products = await this.getProducts();     
        this.products.push(newProduct)

        await fs.promises.writeFile(this.PATH, JSON.stringify(this.products))
        return newProduct;
        
    }


    getProducts = async  ()=> {
        const response = await fs.promises.readFile(this.PATH, 'utf-8');
        const responseParse =  JSON.parse(response);  
        return  responseParse ;
    };


    getProductById = async(id) =>  {
        const response =await this.getProducts();
        const product = response.find(product => product.id === id)

        if (product){
            return product
        }else{
            console.log("Producto no encontrado")
        }
    }


    updateProduct = async (id, {...data}) => {
         const products = await this.getProducts();
         const index =products.findIndex( product => product.id === id);

         if(index !== -1){
            products[index] = {id, ...data}
            await fs.promises.writeFile(this.PATH ,JSON.stringify(products))
            return console.log("Se ha actualizado el producto")
         } else {
            console.log('El Producto no existe')
         }
    }

    deleteProductById = async(id) => {
        const products = await this.getProducts();
        const index =products.findIndex(product => product.id === id);

        if(index !== -1){
            products.splice(index, 1)
            await fs.promises.writeFile(this.PATH ,JSON.stringify(products))
         } else {
            console.log('El Producto no existe')
         }
    }


}
export { getProducts };