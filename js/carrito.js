addEventListener("load", () => {
  console.log("Sitio cargado correctamente");
});

/*/////////////////////////////////////////// TIENDA /////////////////////////////////////////*/
let carritoArray = [];
let productos = [];

const contenedorProducto = document.getElementById("contenedorProducto");
const selector = document.getElementById("selector");

const contadorCarrito = document.getElementById("contadorCarrito");
const botonesAgregarAlCarrito = document.getElementsByClassName(
  "producto__carrito--btn"
);

const carrito = document.querySelector(".elCarrito");
const totalCarrito = document.querySelector(".total");

const botonComprar = document.querySelector(".btnComprar");
const botonVaciarCarrito = document.querySelector(".btnVaciar");

const busqueda = document.querySelector(".busqueda");

const alertProductoAgregado = document.querySelector(".hide");

///////////////////////////////////////////// FILTRO /////////////////////////////////////////
selector.addEventListener("change", () => {
  if (selector.value == "todos") {
    mostrarProductos(productos);
  } else if (selector.value == "menorPrecio") {
    mostrarProductos(
      productos.sort((a, b) => {
        if (a.precio > b.precio) {
          return 1;
        } else if (a.precio < b.precio) {
          return -1;
        } else {
          return 0;
        }
      })
    );
  } else if (selector.value == "mayorPrecio") {
    mostrarProductos(
      productos.sort((a, b) => {
        if (b.precio > a.precio) {
          return 1;
        } else if (b.precio < a.precio) {
          return -1;
        } else {
          return 0;
        }
      })
    );
  } else if (selector.value == "cuadrosChicos") {
    mostrarProductos(productos.filter((e) => e.medidas == "small"));
  } else if (selector.value == "cuadrosMedianos") {
    mostrarProductos(productos.filter((e) => e.medidas == "medium"));
  } else {
    mostrarProductos(productos.filter((e) => e.medidas == "big"));
  }
});

///////////////////////////////////////////// BUSCADOR ///////////////////////////////////////
busqueda.addEventListener("input", () => {
  let input = productos.filter((e) =>
    e.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
  );
  let filtro = mostrarProductos(input);

  busqueda.value === "" ? mostrarProductos(productos) : filtro;

  input.length === 0
    ? (contenedorProducto.innerHTML = `<h5 class="h2 text-light">Producto no encontrado</h5>`)
    : filtro;
});

///////////////////////////////////////////// BIENVENIDA ///////////////////////////////////////
const traducciones = {
  bienvenida: {
    espaniol: "Bienvenido",
    italiano: "Benvenuto",
    frances: "Bienvenue",
    ingles: "Welcome",
  },
  adios: {
    espaniol: "Adios",
    italiano: "arrivederci",
    frances: "Au revoir",
    ingles: "Good bye",
  },
};
const { bienvenida, adios } = traducciones;

const select = document.querySelector("#paises");
const mostrarIdioma = document.getElementById("mostrarIdioma");

select.addEventListener("change", () => {
  mostrarIdioma.textContent = obtenerTraduccion(select.value);
  mostrarIdioma.classList.add("animate__fadeInLeft");
  setTimeout(quitar, 1000);
  function quitar() {
    mostrarIdioma.classList.remove("animate__fadeInLeft");
  }
});

const obtenerTraduccion = (idioma) => {
  return bienvenida[idioma].toUpperCase();
};

///////////////////////////////// IMG DE CARGA //////////////////////////////////
contenedorProducto.innerHTML = `
<img src="https://roc21cdn-roc21.netdna-ssl.com/blog/wp-content/uploads/2016/05/preloader-en-formato-gif-cinco.gif" alt="Ver las imágenes de origen" class=" nofocus" tabindex="0" style="position: relative; height: 100%; width: 100%; inset: 0px; margin: auto;" data-bm="23"></img>`;


                                
///////////////////////////////// FETCH PARA PEDIR PRODUCTOS //////////////////////////////////
fetch("stockProductos.json")
  .then((response) => response.json())
  .then((data) => {
    setTimeout(() => {
      mostrarProductos(data), contenedorProducto.classList.add("gridTienda");
    }, 2000);
    data.forEach((e) => productos.push(e));
  })
  .then(() => {
    recuperar();
  })
  .catch((error) => console.error(error));

/////////////////////////////////////////// ECOMMERCE /////////////////////////////////////////
// mostrarProductos(productos)
function mostrarProductos(array) {
  contenedorProducto.innerHTML = "";
  contenedorProducto.classList.add("animate__animated", "animate__slideInUp");
  setTimeout(() => {
    contenedorProducto.classList.remove("animate__slideInUp");
  }, 1000);

  for (const producto of array) {
    let div = document.createElement("div");
    div.innerHTML += `
                    <div class="producto">
                      <h2 class="producto__nombre">${producto.nombre}</h2>
                      <a class="producto__link" href="producto.html">
                        <img class="producto__imagen" src="${producto.img}" alt="${producto.nombre}">
                      </a>
                        <div class="producto__informacion">
                          
                          <p class="producto__descripcion">${producto.descripcion}</p>
                          <p class="producto__precio">€${producto.precio}</p>
                          <button id="${producto.id}" class="producto__carrito--btn" type="button">Agregar al carrito</button>
                        </div>
    
                    </div>
    `;
    contenedorProducto.appendChild(div);
  }

  for (const botonAgregar of botonesAgregarAlCarrito) {
    botonAgregar.addEventListener("click", agregarAlCarritoClick);
  }
}

//////////////////////////////////// ALERT PROD. AGREGADO A CARRITO ///////////////////////////////////////
function alertProductoAgregadoCarrito() {
  alertProductoAgregado.classList.remove("hide");
  alertProductoAgregado.classList.add("textoAlertAgregado");
  alertProductoAgregado.classList.add("animate__fadeInDown");
  alertProductoAgregado.textContent = `Producto agregado! Tienes ${carritoArray.length} productos en el carrito.`;
  setTimeout(alert, 2000);

  function alert() {
    alertProductoAgregado.classList.add("hide");
  }
}

//////////////////////////////////// AGREGAR AL CARRITO CLICK ///////////////////////////////////////
function agregarAlCarritoClick(e) {
  const boton = e.target;
  const producto = boton.closest(".producto");

  const tituloProducto =
    producto.querySelector(".producto__nombre").textContent;
  const precioProducto =
    producto.querySelector(".producto__precio").textContent;
  const imgProducto = producto.querySelector(".producto__imagen").src;

  agregarAlCarrito(tituloProducto, precioProducto, imgProducto);
  alertProductoAgregadoCarrito();
}

/////////////////////////////////////// AGREGAR AL CARRITO ///////////////////////////////////
function agregarAlCarrito(tituloProducto, precioProducto, imgProducto) {
  const titulo = carrito.getElementsByClassName("tituloProducto");

  for (let i = 0; i < titulo.length; i++) {
    if (titulo[i].innerHTML === tituloProducto) {
      let cantidadElemento = titulo[
        i
      ].parentElement.parentElement.parentElement.querySelector(
        ".cantidadItemCarrito"
      );
      cantidadElemento.value++;
      let repetido = carritoArray.find((e) => e.nombre == tituloProducto);
      carritoArray.push(repetido);
      actualizarCarrito();
      localStorage.setItem("carrito", JSON.stringify(carritoArray));
      return;
    }
  }

  let productoAgregado = productos.find((e) => e.nombre == tituloProducto);
  carritoArray.push(productoAgregado);

  const carritoFlotante = document.createElement("div");
  const carritoFlotanteContenido = `
  <div class="card rounded-3 mb-4 productoCarrito shadow bg-light">
              <div class="card-body p-4">
                <div class="row d-flex justify-content-between align-items-center">
                  <div class="col-md-2 col-lg-2 col-xl-2">
                    <img src="${imgProducto}"
                      class="img-fluid rounded-3" alt="#">
                  </div>
                  <div class="col-md-3 col-lg-3 col-xl-3">
                    <p class="lead fw-normal mb-2 tituloProducto">${tituloProducto}</p>
                  </div>
                  <div class="col-md-3 col-lg-3 col-xl-2 d-flex">
                    <button class="btn btn-link px-2 botonMenos"
                      onclick="this.parentNode.querySelector('input[type=number]').stepDown()">
                      <i class="fas fa-minus"></i>
                    </button>
    
                    <input id="form1" min="0" name="quantity" value="1" readonly type="number"
                      class="form-control form-control-sm cantidadItemCarrito text-center" />
    
                    <button class="btn btn-link px-2 botonMas"
                      onclick="this.parentNode.querySelector('input[type=number]').stepUp()">
                      <i class="fas fa-plus"></i>
                    </button>
                  </div>
                  <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                    <h5 class="mb-0 totalRealPrecio">${precioProducto}</h5>
                  </div>
                  <div class="col-md-1 col-lg-1 col-xl-1 text-end">
                    <a href="#!" class="text-danger"><i class="fas fa-trash fa-lg borrarItemCarrito"></i></a>
                  </div>
                </div>
              </div>
            </div>
  `;

  carritoFlotante.innerHTML += carritoFlotanteContenido;
  carrito.appendChild(carritoFlotante);

  /////////////////////////////// EVENTOS BOTONES CARRITO ///////////////////////////////////
  let botonEliminar = carritoFlotante.querySelector(".borrarItemCarrito");
  botonEliminar.addEventListener("click", () => {
    botonEliminar.closest(".productoCarrito").remove();
    carritoArray = carritoArray.filter((e) => e.nombre != tituloProducto);
    actualizarCarrito();
    Toastify({
      text: "Producto eliminado",
      className: "prod-eliminado",
      duration: 1500,
      style: {
        background: "linear-gradient(to right, #9b1b22, #471012)",
      },
    }).showToast();

    localStorage.setItem("carrito", JSON.stringify(carritoArray));
  });

  //
  carritoFlotante
    .querySelector(".cantidadItemCarrito")
    .addEventListener("change", (e) => {
      e.target;
      actualizarCarrito();
    });

  ////////////////////////////////////// BOTON MAS //////////////////////////////////////////
  carritoFlotante.querySelector(".botonMas").addEventListener("click", (e) => {
    e.target;
    btnMenos.disabled = false;
    let repetido = productos.find((e) => e.nombre == tituloProducto);
    carritoArray.push(repetido);
    actualizarCarrito();
    Toastify({
      text: "Producto agregado",
      className: "prod-agregado",
      duration: 1500,
      style: {
        background: "linear-gradient(to right, #e2c74f, #8b7b2f)",
      },
    }).showToast();
    localStorage.setItem("carrito", JSON.stringify(carritoArray));
  });

  ////////////////////////////////////// BOTON MENOS ////////////////////////////////////////
  const btnMenos = carritoFlotante.querySelector(".botonMenos");
  btnMenos.addEventListener("click", () => {
    let repetido = carritoArray.find((e) => e.nombre == tituloProducto);
    carritoArray.splice(repetido, 1);
  
    let cant = btnMenos.nextElementSibling.value;
    if (cant == 0) {
      btnMenos.disabled = true;
    }
    Toastify({
      text: "Producto eliminado",
      className: "prod-eliminado",
      duration: 1500,
      style: {
        background: "linear-gradient(to right, #9b1b22, #471012)",
      },
    }).showToast();
    actualizarCarrito();
    localStorage.setItem("carrito", JSON.stringify(carritoArray));
  });
  actualizarCarrito();
  localStorage.setItem("carrito", JSON.stringify(carritoArray));
}

/////////////////////////////////////// ACTUALIZAR CARRITO ///////////////////////////////////
function actualizarCarrito() {
  let total = 0;
  let cantidadTotal = 0;

  const itemsCarrito = document.querySelectorAll(".productoCarrito");

  itemsCarrito.forEach(item => {
    const precioItemCarritoElemento = item.querySelector(".totalRealPrecio");
    const precioItemCarrito = Number(
      precioItemCarritoElemento.textContent.replace(`€`, "")
    );
    const cantidadItemCarritoElemento = item.querySelector(
      ".cantidadItemCarrito"
    );
    const cantidadItemCarrito = Number(cantidadItemCarritoElemento.value);

    cantidadTotal = cantidadTotal + cantidadItemCarrito;
    total = total + precioItemCarrito * cantidadItemCarrito;
  });

  contadorCarrito.innerText = cantidadTotal;
  totalCarrito.innerHTML = `€${total}`;
}

/////////////////////////////////////// BOTON COMPRAR ////////////////////////////////////////
botonComprar.addEventListener("click", botonComprarClick);

function botonComprarClick() {
  if (carritoArray.length > 0 && totalCarrito.innerHTML > "€0") {
    Swal.fire({
      title: "Compra realizada correctamente",
      text: `El total de su compra es: ${totalCarrito.textContent}`,
      icon: "success",
      confirmButtonText: "Ok",
    });
    carritoArray = [];
    carrito.innerHTML = "";
    actualizarCarrito();
    localStorage.clear();
  } else {
    Swal.fire({
      title: "Lo siento",
      text: `No hay nada en el carrito`,
      icon: "error",
      confirmButtonText: "Ok",
    });

    setTimeout(borrar, 2000);
    function borrar() {
      carrito.innerHTML = "";
    }
  }
}

/////////////////////////////////////// BOTON VACIAR CARRITO /////////////////////////////////
botonVaciarCarrito.addEventListener("click", () => {
  carrito.innerHTML = "";
  carritoArray = [];
  Swal.fire({
    title: "Carrito vacio.",
    icon: "warning",
    confirmButtonText: "Ok",
  });
  actualizarCarrito();
  localStorage.clear();
});

/////////////////////////////////////// RECUPERAR LOCAL STORAGE /////////////////////////////////////////
function recuperar() {
  let recuperoLocalStorage = JSON.parse(localStorage.getItem("carrito"));

  if (recuperoLocalStorage) {
    for (item of recuperoLocalStorage) {
      agregarAlCarrito(item.nombre, item.precio, item.img);
    }
  }
}

// <div style="width:100%;height:0;padding-bottom:100%;position:absolute;"><iframe src="https://giphy.com/embed/YPcHIrjwX5RD8rsDlx" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div>
