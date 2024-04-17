/*
socketClient.on("products", (data) => {
    render(data);
});
 */
const socketClient = io();
socketClient.on("sendProducts", (object)=>{
    updateProductsList(object)

});

function updateProductsList(productList){
const productsDiv = document.getElementById("list-products");
let productsHTML = "";

productList.forEach(product => {
    productsHTML += `  <div class="card h-100 bg-white mx-4 my-3" style="max-width:30rem">
                             <div class="card-header bg-second text-success">
                                 <i class="bi bi-tag"></i>Code: ${product.code}
                             </div>
                            <div class="card-body">
                                <h5 class="card-title text-black">${product.title}</h5>
                                <ul class="card-text">
                                    <li class="fw-normal"><i class="fw-bold ">  ID: </i> ${product.id}</li>
                                    <li class="fw-normal"><i class="fw-bold ">  Descripcion: </i>${product.description}</li>
                                    <li class="fw-normal"><i class="fw-bold ">  Precio: </i>${product.price}</li>
                                    <li class="fw-normal"><i class="fw-bold ">  Categoria: </i>${product.category}</li>
                                    <li class="fw-normal"><i class="fw-bold ">  Estado: </i>${product.status}</li>
                                    <li class="fw-normal"><i class="fw-bold ">  Stock: </i>${product.stock}</li>
                                   
                                        <i class="fw-bold "> Imagen: </i> <img src="${product.thumbnail}" class="img-thumbnail img-fluid mt-2">
                                  
                                </ul>

                                <div class=d-flex justify-content-center mb-4>
                                    <button class= "btn btn-danger delete-btn" onclick="deleteProduct(${product.id})">Eliminar</button>
                                </div>
                            </div>
                        </div>
    `
    
});
productsDiv.innerHTML = productsHTML
}

////////agregar un producto///////////

let form = document.getElementById("formProduct");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
    let title = form.elements.title.value;//esto vienen del name del formulario
    let description = form.elements.description.value;
    let stock = form.elements.stock.value;
    let thumbnail = form.elements.thumbnail.value;
    let category = form.elements.category.value;
    let price = form.elements.price.value;
    let code = form.elements.code.value;
    let status= form.elements.status.checked;

    socketClient.emit("addProduct", {
        title,
        description,
        stock,
        thumbnail,
        category,
        price,
        code,
        status
    });

form.reset();//esto es para que quede el formulario vacio

})

////////eliminar  un producto///////////
//elimino por ID
document.getElementById("delete-id-btn").addEventListener('click', function(){
    const inputTheId = document.getElementById("id-prod")//esto viene del form en realTimePrioducts.handlebars
   const deleteId = (inputTheId.value).toString();
   inputTheId.value = "";
   socketClient.emit("deleteProduct", deleteId)

  
})
//elimino por unidad
function deleteProduct(productId){
    socketClient.emit("deleteProduct", productId)
}