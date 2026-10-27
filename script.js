// Joyería Delux: funcionalidades JavaScript separadas por página.

/* ===== Funcionalidades de index.html ===== */
(function () {
  function iniciarPagina() {
    if (document.body.dataset.page !== "index") return;


        function actualizarContadorCarrito() {

            let carrito = [];

            try {
                const datos = JSON.parse(
                    localStorage.getItem("carritoDelux")
                );

                carrito = Array.isArray(datos) ? datos : [];

            } catch (error) {
                carrito = [];
            }

            const cantidadTotal = carrito.reduce(
                function(total, producto) {
                    return total + Number(producto.cantidad || 0);
                },
                0
            );

            document.getElementById(
                "contadorCarrito"
            ).textContent = cantidadTotal;

        }

        actualizarContadorCarrito();

        window.addEventListener(
            "pageshow",
            actualizarContadorCarrito
        );

    
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarPagina);
  } else {
    iniciarPagina();
  }
})();


/* ===== Funcionalidades de productos.html ===== */
(function () {
  function iniciarPagina() {
    if (document.body.dataset.page !== "productos") return;


        /* ================================= */
        /* BUSCADOR Y FILTROS                */
        /* ================================= */

        const buscador = document.getElementById(
            "buscarProducto"
        );

        const productos = document.querySelectorAll(
            ".producto"
        );

        const botonesFiltro = document.querySelectorAll(
            ".btn-filtro"
        );

        const sinResultados = document.getElementById(
            "sinResultados"
        );

        let categoriaSeleccionada = "todos";


        function filtrarProductos() {

            const textoBusqueda = buscador.value
                .toLowerCase()
                .trim();

            let encontrados = 0;

            productos.forEach(function(producto) {

                const nombre = producto.dataset.nombre
                    .toLowerCase();

                const categoria = producto.dataset.categoria;

                const coincideNombre =
                    nombre.includes(textoBusqueda);

                const coincideCategoria =
                    categoriaSeleccionada === "todos" ||
                    categoria === categoriaSeleccionada;

                if (coincideNombre && coincideCategoria) {

                    producto.style.display = "";
                    encontrados++;

                } else {

                    producto.style.display = "none";

                }

            });

            sinResultados.style.display =
                encontrados === 0 ? "block" : "none";

        }


        buscador.addEventListener(
            "input",
            filtrarProductos
        );


        botonesFiltro.forEach(function(boton) {

            boton.addEventListener("click", function() {

                categoriaSeleccionada =
                    boton.dataset.categoria;

                botonesFiltro.forEach(function(item) {

                    item.classList.remove("activo");

                });

                boton.classList.add("activo");

                filtrarProductos();

            });

        });


        /* ================================= */
        /* CARRITO DE COMPRAS                */
        /* ================================= */

        function obtenerCarrito() {

            try {

                const datos = JSON.parse(
                    localStorage.getItem("carritoDelux")
                );

                return Array.isArray(datos) ? datos : [];

            } catch (error) {

                return [];

            }

        }


        function actualizarContadorCarrito() {

            const carrito = obtenerCarrito();

            const total = carrito.reduce(
                function(acumulado, producto) {

                    return acumulado + Number(producto.cantidad);

                },
                0
            );

            document.getElementById(
                "contadorCarrito"
            ).textContent = total;

        }


        /* ================================= */
        /* AGREGAR PRODUCTOS AL CARRITO      */
        /* ================================= */

        const botonesCarrito = document.querySelectorAll(
            ".btn-carrito"
        );

        botonesCarrito.forEach(function(boton) {

            boton.addEventListener("click", function() {

                const id = boton.dataset.id;
                const nombre = boton.dataset.nombre;
                const precio = Number(boton.dataset.precio);

                const carrito = obtenerCarrito();

                const existente = carrito.find(
                    function(producto) {

                        return producto.id === id;

                    }
                );

                if (existente) {

                    existente.cantidad += 1;

                } else {

                    carrito.push({

                        id: id,
                        nombre: nombre,
                        precio: precio,
                        cantidad: 1

                    });

                }

                localStorage.setItem(
                    "carritoDelux",
                    JSON.stringify(carrito)
                );

                actualizarContadorCarrito();

                const textoOriginal = boton.innerHTML;

                boton.innerHTML =
                    '<i class="bi bi-check-circle"></i> Agregado';

                boton.disabled = true;

                setTimeout(function() {

                    boton.innerHTML = textoOriginal;
                    boton.disabled = false;

                }, 1200);

            });

        });


        /* ================================= */
        /* ACTUALIZAR CONTADOR               */
        /* ================================= */

        actualizarContadorCarrito();

        window.addEventListener(
            "pageshow",
            actualizarContadorCarrito
        );

        window.addEventListener(
            "storage",
            actualizarContadorCarrito
        );

    
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarPagina);
  } else {
    iniciarPagina();
  }
})();


/* ===== Funcionalidades de carrito.html ===== */
(function () {
  function iniciarPagina() {
    if (document.body.dataset.page !== "carrito") return;


        /* ================================= */
        /* ELEMENTOS DE LA PÁGINA            */
        /* ================================= */

        const contenedorCarrito =
            document.getElementById("contenedorCarrito");

        const contadorCarrito =
            document.getElementById("contadorCarrito");

        const cantidadProductos =
            document.getElementById("cantidadProductos");

        const subtotalPedido =
            document.getElementById("subtotalPedido");

        const totalPedido =
            document.getElementById("totalPedido");

        const botonVaciar =
            document.getElementById("vaciarCarrito");

        const botonPedido =
            document.getElementById("enviarPedido");

        const accionesCarrito =
            document.getElementById("accionesCarrito");


        /* ================================= */
        /* LEER PRODUCTOS GUARDADOS          */
        /* ================================= */

        function obtenerCarrito() {

            try {

                const datos = JSON.parse(
                    localStorage.getItem("carritoDelux")
                );

                return Array.isArray(datos) ? datos : [];

            } catch (error) {

                return [];

            }

        }


        /* ================================= */
        /* GUARDAR CARRITO                   */
        /* ================================= */

        function guardarCarrito(carrito) {

            localStorage.setItem(
                "carritoDelux",
                JSON.stringify(carrito)
            );

            mostrarCarrito();

        }


        /* ================================= */
        /* FORMATO DE PRECIOS                */
        /* ================================= */

        function formatoPrecio(cantidad) {

            return new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN"
            }).format(cantidad);

        }


        /* ================================= */
        /* MOSTRAR PRODUCTOS                 */
        /* ================================= */

        function mostrarCarrito() {

            const carrito = obtenerCarrito();

            contenedorCarrito.innerHTML = "";

            let cantidadTotal = 0;
            let subtotal = 0;

            /* SI EL CARRITO ESTÁ VACÍO */

            if (carrito.length === 0) {

                contenedorCarrito.innerHTML = `
                    <div class="carrito-vacio">

                        <i class="bi bi-cart-x"></i>

                        <h3>Tu carrito está vacío</h3>

                        <p>
                            Todavía no has agregado productos.
                            Explora nuestro catálogo para comenzar.
                        </p>

                        <a
                            href="productos.html"
                            class="btn-delux"
                        >
                            Ver productos
                        </a>

                    </div>
                `;

                accionesCarrito.style.display = "none";

                botonPedido.disabled = true;

            } else {

                accionesCarrito.style.display = "flex";

                botonPedido.disabled = false;

                /* RECORRER PRODUCTOS */

                carrito.forEach(function(producto) {

                    const cantidad = Number(producto.cantidad);
                    const precio = Number(producto.precio);

                    cantidadTotal += cantidad;

                    const subtotalProducto =
                        precio * cantidad;

                    subtotal += subtotalProducto;

                    /* CREAR FILA DEL PRODUCTO */

                    const fila = document.createElement("div");

                    fila.className = "producto-carrito";

                    /* ICONO DE PRODUCTO */
                    const imagen = document.createElement("div");

                    imagen.className =
                        "imagen-producto imagen-generica";

                    imagen.innerHTML =
                        '<i class="bi bi-gem"></i>';

                    /* INFORMACIÓN */
                    const info = document.createElement("div");

                    info.className = "info-producto";

                    const nombre = document.createElement("h3");

                    nombre.textContent = producto.nombre;

                    const precioTexto = document.createElement("p");

                    precioTexto.className = "precio-unitario";

                    precioTexto.textContent =
                        formatoPrecio(precio) + " por unidad";

                    /* CONTROLES */
                    const controles = document.createElement("div");

                    controles.className = "control-cantidad";

                    const disminuir = document.createElement("button");

                    disminuir.type = "button";
                    disminuir.textContent = "−";
                    disminuir.setAttribute(
                        "aria-label",
                        "Disminuir cantidad de " + producto.nombre
                    );

                    disminuir.addEventListener("click", function() {

                        cambiarCantidad(producto.id, -1);

                    });

                    const numero = document.createElement("span");

                    numero.textContent = cantidad;

                    const aumentar = document.createElement("button");

                    aumentar.type = "button";
                    aumentar.textContent = "+";
                    aumentar.setAttribute(
                        "aria-label",
                        "Aumentar cantidad de " + producto.nombre
                    );

                    aumentar.addEventListener("click", function() {

                        cambiarCantidad(producto.id, 1);

                    });

                    controles.appendChild(disminuir);
                    controles.appendChild(numero);
                    controles.appendChild(aumentar);

                    info.appendChild(nombre);
                    info.appendChild(precioTexto);
                    info.appendChild(controles);

                    /* SUBTOTAL */
                    const precioFinal = document.createElement("div");

                    precioFinal.className = "subtotal-producto";

                    precioFinal.textContent =
                        formatoPrecio(subtotalProducto);

                    /* ELIMINAR */
                    const eliminar = document.createElement("button");

                    eliminar.className = "btn-eliminar";
                    eliminar.type = "button";

                    eliminar.innerHTML =
                        '<i class="bi bi-trash"></i>';

                    eliminar.setAttribute(
                        "aria-label",
                        "Eliminar " + producto.nombre
                    );

                    eliminar.addEventListener("click", function() {

                        eliminarProducto(producto.id);

                    });

                    /* AGREGAR A LA PÁGINA */
                    fila.appendChild(imagen);
                    fila.appendChild(info);
                    fila.appendChild(precioFinal);
                    fila.appendChild(eliminar);

                    contenedorCarrito.appendChild(fila);

                });

            }

            /* ACTUALIZAR RESUMEN */

            contadorCarrito.textContent = cantidadTotal;

            cantidadProductos.textContent = cantidadTotal;

            subtotalPedido.textContent =
                formatoPrecio(subtotal);

            totalPedido.textContent =
                formatoPrecio(subtotal);

        }


        /* ================================= */
        /* CAMBIAR CANTIDAD                  */
        /* ================================= */

        function cambiarCantidad(id, cambio) {

            const carrito = obtenerCarrito();

            const producto = carrito.find(function(item) {

                return item.id === id;

            });

            if (!producto) {
                return;
            }

            producto.cantidad += cambio;

            /* SI LLEGA A CERO, ELIMINAR */

            const carritoActualizado = carrito.filter(
                function(item) {

                    return item.cantidad > 0;

                }
            );

            guardarCarrito(carritoActualizado);

        }


        /* ================================= */
        /* ELIMINAR PRODUCTO                 */
        /* ================================= */

        function eliminarProducto(id) {

            const carrito = obtenerCarrito();

            const carritoActualizado = carrito.filter(
                function(producto) {

                    return producto.id !== id;

                }
            );

            guardarCarrito(carritoActualizado);

        }


        /* ================================= */
        /* VACIAR TODO EL CARRITO            */
        /* ================================= */

        botonVaciar.addEventListener("click", function() {

            const confirmar = confirm(
                "¿Quieres eliminar todos los productos del carrito?"
            );

            if (confirmar) {

                guardarCarrito([]);

            }

        });


        /* ================================= */
        /* SOLICITAR PEDIDO POR WHATSAPP     */
        /* ================================= */

        botonPedido.addEventListener("click", function() {

            const carrito = obtenerCarrito();

            if (carrito.length === 0) {
                return;
            }

            let mensaje =
                "Hola, quiero solicitar información sobre este pedido de Joyería Delux:\n\n";

            let total = 0;

            carrito.forEach(function(producto) {

                const subtotal =
                    producto.precio * producto.cantidad;

                total += subtotal;

                mensaje +=
                    "• " + producto.nombre + "\n" +
                    "Cantidad: " + producto.cantidad + "\n" +
                    "Subtotal: " + formatoPrecio(subtotal) + "\n\n";

            });

            mensaje +=
                "Total estimado: " + formatoPrecio(total) + "\n\n" +
                "¿Podrían confirmarme disponibilidad y costo final?";

            /* NÚMERO DE WHATSAPP */
            const telefono = "56167989855";

            const enlace =
                "https://wa.me/" +
                telefono +
                "?text=" +
                encodeURIComponent(mensaje);

            window.open(
                enlace,
                "_blank",
                "noopener,noreferrer"
            );

        });


        /* ================================= */
        /* INICIAR PÁGINA                    */
        /* ================================= */

        mostrarCarrito();

        window.addEventListener("pageshow", mostrarCarrito);

        window.addEventListener("storage", mostrarCarrito);

    
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarPagina);
  } else {
    iniciarPagina();
  }
})();


/* ===== Funcionalidades de contacto.html ===== */
(function () {
  function iniciarPagina() {
    if (document.body.dataset.page !== "contacto") return;


        function actualizarContadorCarrito() {

            let carrito = [];

            try {

                carrito = JSON.parse(
                    localStorage.getItem("carritoDelux")
                ) || [];

            } catch (error) {

                carrito = [];

            }

            const cantidadTotal = carrito.reduce(
                function(total, producto) {

                    return total + producto.cantidad;

                },
                0
            );

            document.getElementById(
                "contadorCarrito"
            ).textContent = cantidadTotal;

        }

        actualizarContadorCarrito();

        window.addEventListener(
            "pageshow",
            actualizarContadorCarrito
        );

    
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarPagina);
  } else {
    iniciarPagina();
  }
})();


/* ===== Funcionalidades de especificaciones.html ===== */
(function () {
  function iniciarPagina() {
    if (document.body.dataset.page !== "especificaciones") return;


        /* ================================= */
        /* CATÁLOGO DE PRODUCTOS             */
        /* ================================= */

        const productos = [

            {
                id: "1",
                nombre: "Collar dorado",
                categoria: "Collares",
                precio: 450,
                imagen: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
                descripcion: "Collar de estilo elegante para complementar diferentes atuendos y ocasiones.",
                material: "Por confirmar",
                color: "Dorado",
                medidas: "Por confirmar",
                disponibilidad: "Consultar disponibilidad"
            },

            {
                id: "2",
                nombre: "Collar elegante",
                categoria: "Collares",
                precio: 520,
                imagen: src="img/collar elegante.jpg",
                descripcion: "Accesorio de diseño elegante para ocasiones especiales.",
                material: "Por confirmar",
                color: "Por confirmar",
                medidas: "Por confirmar",
                disponibilidad: "Consultar disponibilidad"
            },

            {
                id: "3",
                nombre: "Pulsera clásica",
                categoria: "Pulseras",
                precio: 350,
                imagen: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80",
                descripcion: "Pulsera de estilo clásico que puede combinarse con otros accesorios.",
                material: "Por confirmar",
                color: "Por confirmar",
                medidas: "Por confirmar",
                disponibilidad: "Consultar disponibilidad"
            },

            {
                id: "4",
                nombre: "Pulsera Delux",
                categoria: "Pulseras",
                precio: 390,
                imagen: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80",
                descripcion: "Pulsera de nuestra colección Delux para complementar tu estilo.",
                material: "Por confirmar",
                color: "Por confirmar",
                medidas: "Por confirmar",
                disponibilidad: "Consultar disponibilidad"
            },

            {
                id: "5",
                nombre: "Esclava clásica",
                categoria: "Esclavas",
                precio: 480,
                imagen: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=800&q=80",
                descripcion: "Esclava de diseño clásico para uso cotidiano o para ocasiones especiales.",
                material: "Por confirmar",
                color: "Por confirmar",
                medidas: "Por confirmar",
                disponibilidad: "Consultar disponibilidad"
            },

            {
                id: "6",
                nombre: "Esclava Delux",
                categoria: "Esclavas",
                precio: 550,
                imagen: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=800&q=80",
                descripcion: "Accesorio de la colección Delux con un diseño pensado para diferentes estilos.",
                material: "Por confirmar",
                color: "Por confirmar",
                medidas: "Por confirmar",
                disponibilidad: "Consultar disponibilidad"
            },

            {
                id: "7",
                nombre: "Aretes elegantes",
                categoria: "Aretes",
                precio: 280,
                imagen: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
                descripcion: "Aretes para complementar tu estilo con un detalle elegante.",
                material: "Por confirmar",
                color: "Por confirmar",
                medidas: "Por confirmar",
                disponibilidad: "Consultar disponibilidad"
            },

            {
                id: "8",
                nombre: "Anillo dorado",
                categoria: "Anillos",
                precio: 420,
                imagen: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
                descripcion: "Anillo de estilo elegante para complementar diferentes combinaciones de joyería.",
                material: "Por confirmar",
                color: "Dorado",
                medidas: "Por confirmar",
                disponibilidad: "Consultar disponibilidad"
            }

        ];


        /* ================================= */
        /* IDENTIFICAR PRODUCTO              */
        /* ================================= */

        const parametros = new URLSearchParams(
            window.location.search
        );

        const idProducto = parametros.get("id");

        const productoActual = productos.find(
            function(producto) {
                return producto.id === idProducto;
            }
        );


        /* ================================= */
        /* FORMATO DE PRECIO                 */
        /* ================================= */

        function formatoPrecio(precio) {

            return new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN"
            }).format(precio);

        }


        /* ================================= */
        /* MOSTRAR ESPECIFICACIONES          */
        /* ================================= */

        if (productoActual) {

            document.getElementById(
                "imagenProducto"
            ).src = productoActual.imagen;

            document.getElementById(
                "imagenProducto"
            ).alt = productoActual.nombre;

            document.getElementById(
                "categoriaProducto"
            ).textContent = productoActual.categoria;

            document.getElementById(
                "nombreProducto"
            ).textContent = productoActual.nombre;

            document.getElementById(
                "precioProducto"
            ).textContent = formatoPrecio(productoActual.precio);

            document.getElementById(
                "descripcionProducto"
            ).textContent = productoActual.descripcion;

            document.getElementById(
                "materialProducto"
            ).textContent = productoActual.material;

            document.getElementById(
                "colorProducto"
            ).textContent = productoActual.color;

            document.getElementById(
                "medidasProducto"
            ).textContent = productoActual.medidas;

            document.getElementById(
                "disponibilidadProducto"
            ).textContent = productoActual.disponibilidad;

            document.title =
                productoActual.nombre + " | Joyería Delux";

        } else {

            document.querySelector(
                ".panel-producto"
            ).innerHTML = `
                <div class="text-center py-5">

                    <h2>Producto no encontrado</h2>

                    <p>
                        Selecciona un artículo
                        desde nuestro catálogo.
                    </p>

                    <a
                        href="productos.html"
                        class="btn-delux"
                    >
                        Volver a productos
                    </a>

                </div>
            `;

        }


        /* ================================= */
        /* CONTROL DE CANTIDAD               */
        /* ================================= */

        if (productoActual) {

            const cantidadInput = document.getElementById(
                "cantidadProducto"
            );

            document.getElementById(
                "aumentarCantidad"
            ).addEventListener("click", function() {

                let cantidad = Number(cantidadInput.value);

                if (cantidad < 99) {
                    cantidadInput.value = cantidad + 1;
                }

            });

            document.getElementById(
                "disminuirCantidad"
            ).addEventListener("click", function() {

                let cantidad = Number(cantidadInput.value);

                if (cantidad > 1) {
                    cantidadInput.value = cantidad - 1;
                }

            });

        }


        /* ================================= */
        /* CARRITO DE COMPRAS                */
        /* ================================= */

        function obtenerCarrito() {

            try {

                const datos = JSON.parse(
                    localStorage.getItem("carritoDelux")
                );

                return Array.isArray(datos) ? datos : [];

            } catch (error) {

                return [];

            }

        }


        function actualizarContador() {

            const carrito = obtenerCarrito();

            const cantidadTotal = carrito.reduce(
                function(total, producto) {

                    return total + Number(producto.cantidad);

                },
                0
            );

            document.getElementById(
                "contadorCarrito"
            ).textContent = cantidadTotal;

        }


        /* ================================= */
        /* AGREGAR PRODUCTO AL CARRITO       */
        /* ================================= */

        if (productoActual) {

            document.getElementById(
                "agregarCarrito"
            ).addEventListener("click", function() {

                const cantidad = Number(
                    document.getElementById(
                        "cantidadProducto"
                    ).value
                );

                const carrito = obtenerCarrito();

                const existente = carrito.find(
                    function(producto) {

                        return producto.id === productoActual.id;

                    }
                );

                if (existente) {

                    existente.cantidad += cantidad;

                } else {

                    carrito.push({

                        id: productoActual.id,
                        nombre: productoActual.nombre,
                        precio: productoActual.precio,
                        cantidad: cantidad

                    });

                }

                localStorage.setItem(
                    "carritoDelux",
                    JSON.stringify(carrito)
                );

                actualizarContador();

                document.getElementById(
                    "mensajeAgregado"
                ).style.display = "block";

            });

        }


        /* INICIAR CONTADOR */

        actualizarContador();

        window.addEventListener(
            "pageshow",
            actualizarContador
        );

    
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarPagina);
  } else {
    iniciarPagina();
  }
})();
