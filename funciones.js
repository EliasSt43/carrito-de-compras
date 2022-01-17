let carritoDeCompras = (function() {
    /**
     * Propiedades y métodos privados 
    */ 
    carrito = [];
    
    // Constructor
    class Item {
    constructor(nombre, precio, cantidad) {
      this.nombre = nombre;
      this.precio = precio;
      this.cantidad = cantidad;
    }
  }
    
    // Guardar carrito
    function guardarCarrito() {
      sessionStorage.setItem('carritoDeCompras', JSON.stringify(carrito));
    }
    
      // Cargar carrito
    function cargarCarrito() {
      carrito = JSON.parse(sessionStorage.getItem('carritoDeCompras'));
    }
    if (sessionStorage.getItem("carritoDeCompras") != null) {
      cargarCarrito();
    }
    
  
    /**
     * Propiedades y métodos publicos
     */

    let obj = {};
    
    // Agregar al carrito
    obj.añadirarticuloCarrito = function(nombre, precio, cantidad) {
      for(let item in carrito) {
        if(carrito[item].nombre === nombre) {
          carrito[item].cantidad ++;
          guardarCarrito();
          return;
        }
      }
      let item = new Item(nombre, precio, cantidad);
      carrito.push(item);
      guardarCarrito();
    }
    // Establecer cantidad del articulo
    obj.cantidadPorArticulo = function(nombre, cantidad) {
      for(let i in carrito) {
        if (carrito[i].nombre === nombre) {
          carrito[i].cantidad = cantidad;
          break;
        }
      }
    };
    // Quitar articulo del carrito
    obj.eliminarArticulo = function(nombre) {
        for(let item in carrito) {
          if(carrito[item].nombre === nombre) {
            carrito[item].cantidad --;
            if(carrito[item].cantidad === 0) {
              carrito.splice(item, 1);
            }
            break;
          }
      }
      guardarCarrito();
    }
  
    // Eliminar todos los elementos del carrito
    obj.eliminarArticuloAll = function(nombre) {
      for(let item in carrito) {
        if(carrito[item].nombre === nombre) {
          carrito.splice(item, 1);
          break;
        }
      }
      guardarCarrito();
    }
  
    // Borrar carrito
    obj.borrarCarrito = function() {
      carrito = [];
      guardarCarrito();
    }
  
    // Cantidad dentro del carrito 
    obj.totalcantidad = function() {
      let totalcantidad = 0;
      for(let item in carrito) {
        totalcantidad += carrito[item].cantidad;
      }
      return totalcantidad;
    }
  
    // Total carrito
    obj.totalCarrito = function() {
      let totalCarrito = 0;
      for(let item in carrito) {
        totalCarrito += carrito[item].precio * carrito[item].cantidad;
      }
      return Number(totalCarrito.toFixed(2));
    }
  
    // Listq carrito
    obj.listaCarrito = function() {
      let copiaCarrito = [];
      for(i in carrito) {
        item = carrito[i];
        itemCopy = {};
        for(p in item) {
          itemCopy[p] = item[p];
  
        }
        itemCopy.total = Number(item.precio * item.cantidad).toFixed(2);
        copiaCarrito.push(itemCopy)
      }
      return copiaCarrito;
    }
    return obj;
  })();
  
  
  /**
   * Activadores / Eventos 
  */
  
  // Añadir articulo
  $('.añadir-al-carrito').click(function(event) {
    event.preventDefault();
    let nombre = $(this).data('nombre');
    let precio = Number($(this).data('precio'));
    carritoDeCompras.añadirarticuloCarrito(nombre, precio, 1);
    displayCarrito();
  });
  
  // Borrar articulos
  $('.borrar-carrito').click(function() {
    carritoDeCompras.borrarCarrito();
    displayCarrito();
  });
  
  
  function displayCarrito() {
    let carritoArray = carritoDeCompras.listaCarrito();
    let output = "";
    for(let i in carritoArray) {
      output += "<tr>"
        + "<td>" + carritoArray[i].nombre + "</td>" 
        + "<td>(" + carritoArray[i].precio + ")</td>"
        + "<td><div class='input-group'><button class='menos-articulos input-group-addon btn btn-primary' data-nombre=" + carritoArray[i].nombre + ">-</button>"
        + "<input type='number' class='articulo-cantidad form-control' data-nombre='" + carritoArray[i].nombre + "' value='" + carritoArray[i].cantidad + "'>"
        + "<button class='mas-articulos btn btn-primary input-group-addon' data-nombre=" + carritoArray[i].nombre + ">+</button></div></td>"
        + "<td><button class='borrar-articulo btn btn-danger' data-nombre=" + carritoArray[i].nombre + ">X</button></td>"
        + " = " 
        + "<td>" + carritoArray[i].total + "</td>" 
        +  "</tr>";
    }
    $('.show-carrito').html(output);
    $('.total-carrito').html(carritoDeCompras.totalCarrito());
    $('.total-cantidad').html(carritoDeCompras.totalcantidad());
  }
  
  // Boton de borrar articulo
  
  $('.show-carrito').on("click", ".borrar-articulo", function(event) {
    let nombre = $(this).data('nombre')
    carritoDeCompras.eliminarArticuloAll(nombre);
    displayCarrito();
  })
  
  
  // -1
  $('.show-carrito').on("click", ".menos-articulos", function(event) {
    let nombre = $(this).data('nombre')
    carritoDeCompras.eliminarArticulo(nombre);
    displayCarrito();
  })
  // +1
  $('.show-carrito').on("click", ".mas-articulos", function(event) {
    let nombre = $(this).data('nombre')
    carritoDeCompras.añadirarticuloCarrito(nombre);
    displayCarrito();
  })
  
  // Entrada de cantidad de artículo
  $('.show-carrito').on("change", ".articulo-cantidad", function(event) {
     let nombre = $(this).data('nombre');
     let cantidad = Number($(this).val());
    carritoDeCompras.cantidadPorArticulo(nombre, cantidad);
    displayCarrito();
  });
  
  displayCarrito();
  