const socket = io();
let btnDeleteProduct = document.getElementById('delete-product-btn')

btnDeleteProduct.addEventListener('click', ()=>{
    socket.emit('deleteAllProducts')
})

socket.on ('productos', productos => {
    
    const tbody =  document.getElementById('productos-body');
    
    tbody.innerHTML = '-';

    productos.forEach(producto => {
        const row = tbody.insertRow();
        row.innerHTML = `
        <td>${producto._id} </td>
        <td>${producto.title} </td>
        <td>${producto.description} </td>
        <td>${producto.price} </td>
        <td>${producto.code} </td>
        <td>${producto.stock} </td>
        <td>${producto.category} </td>
        <td>${producto.status ? 'activo' : 'desactivado'} </td>
        <td>${producto.thumbnails.length > 0 ? producto.thumbnails[0] : 'No hay imagen'} </td>
        `;
    })

})

const formulario = document.getElementById('producto-form');

formulario.addEventListener('submit', function (event) {
    event.preventDefault();
    const tituloInput = document.getElementById('titulo').value;
    const descripcionInput = document.getElementById('descripcion').value;
    const precioInput = document.getElementById('precio').value;
    const codigoInput = document.getElementById('codigo').value;
    const stockInput = document.getElementById('stock').value;
    const categoriaSelect = document.getElementById('categoria').value;

    const producto = {
        title:tituloInput,
        description:descripcionInput,
        price:precioInput,
        code:codigoInput,
        stock:stockInput,
        category:categoriaSelect
    };

    socket.emit('agregarProducto', producto);

})