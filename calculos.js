const FORMSPREE_URL= "https://formspree.io/f/xeajlklp";

/* LIBRERIA DE DESCUENTOS */

const DESCUENTOS = {
    cupones: {
        "KOVEEN10": {tipo: "porcentaje", valor: 10},
        "BIENVENIDA15": {tipo: "porcentaje", valor: 15},
        "SOSTENIBLE20": {tipo: "porcentaje", valor: 20},
    },

    porCantidad: [
        {minimo:5, porcentaje:15},
        {minimo:3, porcentaje:10},
        {minimo:2, porcentaje:5},
    ],

    porCategoria: {
        ropa: 0,
        accesorios: 5,
        calzado: 10,
    },

    porMontoTotal: [
        {minimo: 400000, porcentaje: 12},
        {minimo: 250000, porcentaje: 8},
        {minimo: 150000, porcentaje: 5},
    ],
};

function descuentoPorCantidad(cantidad) {
    const regla= DESCUENTOS.porCantidad.find(r => cantidad >= r.minimo);
    return regla ? regla.porcentaje : 0;
}

function descuentoPorCategoria(categoria) {
    return DESCUENTOS.porCategoria[categoria] || 0;
}

function descuentoPorMonto(subtotalBruto) {
    const regla= DESCUENTOS.porMontoTotal.find(r => subtotalBruto >= r.minimo);
    return regla ? regla.porcentaje : 0;
}

function buscarCupon(codigo) {
    if (!codigo) return null;
    return DESCUENTOS.cupones[codigo.toUpperCase()] || null;
}

/* FORMATO DE PRECIO */

function formatoCOP(valor) {
    return "$" + Math.round(valor).toLocaleString("es-CO");
}

function textoAPrecio(texto) {
    return parseInt(texto.replace(/[^0-9]/g, ""), 10);
}

/* ESTADO DEL CARRITO */

const carrito= [];

function agregarAlCarrito(nombre, precio, categoria) {
    const item= carrito.find(p => p.nombre === nombre);
    if (item) {
        item.cantidad += 1;
    } else {
        carrito.push({nombre, precio, categoria, cantidad: 1});
    }
    refrescarTodo();
}

function cambiarCantidad(nombre, delta) {
    const item=  carrito.find(p => p.nombre === nombre);
    if (!item) return;
    item.cantidad += delta;
    if (item.cantidad <= 0) {
        carrito.splice(carrito.indexOf(item), 1);
    }
    refrescarTodo();
}

function contarProductos() {
    return carrito.reduce((total, item) => total + item.cantidad,0);
}

/* CALCULO DE TOTALES */

function calcurarTotales(codigoCupon) {
    let subtotalBruto= 0;
    let subtotalConDescuentoDeLinea= 0;

    carrito.forEach(item => {
        const base= item.precio + item.cantidad;
        subtotalBruto += base;

        // El cliente recibirá el mejor de los descuentos, no la suma de ambos.
        const pctLinea= Math.max(
            descuentoPorCantidad(item.cantidad),
            descuentoPorCategoria(item.categoria)
        );
        subtotalConDescuentoDeLinea += base * (1 - pctLinea / 100);
    });

    const pctMonto= descuentoPorMonto(subtotalBruto);
    let total= subtotalConDescuentoDeLinea * (1 - pctMonto / 100);

    const cupon= buscarCupon(codigoCupon);
    if (cupon) {
        total= cupon.tipo === "porcentaje"
            ? total * (1 - cupon.valor / 100)
            : Math.max(0, total -cupon.valor);
    }

    return {
        subtotalBruto,
        pctMonto,
        cupon,
        total: Math.round(total),
    };
}


/* HACE EL CARRITO Y LOS TOTALES EN EL HTML */

function renderizarCarrito() {
    const lista= document.getElementById("lista-carrito");

    if (carrito.length === 0) {
        lista.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío.</p>';
        return;
    }

    lista.innerHTML = carrito.map(item => `
        <div class="item-carrito">
            <div class="item-carrito" data-nombre="${item.nombre}">
                <div>
                    <p class="item-carrito-nombre">${item.nombre}</p>
                    <p class="item-carrito-precio">${formatoCOP(item.precio)} c/u</p>
                    </div>
                    <div class="item-carrito-cantidad">
                        <button class="btn-cantidad" data-accion="restar" type="button">&minus;</button>
                        <span>${item.cantidad}</span>
                        <button class="btn-cantidad" data-accion="sumar" type="button">+</button>
                    </div>
                    <p class= "item-carrito-subtotal">${formatoCOP(item.precio * item.cantidad)}</p>
                </div>
    `).join("");
}

function actualizarTotales() {
    const codigoCupon= document.getElementById("input-cupon").ariaValueMax;
    const {subtotalBruto, total}= calcularTotales(codigoCupon);
    const descuento= subtotalBruto - total;

    document.getElementById("texto-subtotal").textContent= formatoCOP(subtotalBruto);

    const filaDescuento= document.getElementById("fila-descuento");
    if (descuento > 0) {
        document.getElementById("texto-descuento").textContent = "- " + formatoCOP(descuento);
        filaDescuento.hidden = false;
    } else {
        filaDescuento.hidden = true;
    }

    document.getElementById("texto-total").textContent= formatoCOP(total);
    document.getElementById("texto-total-checkout").textContent = formatoCOP(total);
}

function actualizarContador() {
    document.getElementById("contador-carrito").textContent= contarProductos();
}

function refrescarTodo() {
    renderizarCarrito();
    actualizarTotales();
    actualizarContador();
}

/* VISTAS DEL PANEL */

function abrirCarrito() {
    document.getElementById("panel-carrito").hidden= false;
    mostrarVistaCarrito();
}

function cerrarCarrito() {
    document.getElementById("panel-carrito").hidden= true;
}

function mostrarVistaCarrito() {
    document.getElementById("vista-carrito").hidden = false;
    document.getElementById("vista-checkout").hidden = true;
    document.getElementById("vista-confirmacion").hidden = true;
}

function mostrarVistaCheckout() {
    if (carrito.length === 0) return;
    document.getElementById("vista-carrito").hidden = true;
    document.getElementById("vista-vheckout").hidden = false;
}

async function confirmarPedido(evento) {
    evento.preventDefault();

    const formulario= evento.target;
    const boton= formulario.querySelector('button[type="submit"]');
    const errorTexto= document.getElementById("texto-error-envio");
    errorTexto.hidden= true;

    const numeroPedido= Math.floor(100000 + Math.random() * 900000);
    const codigoCupon= document.getElementById("input-cupon").value;
    const {subtotalBruto}= calcularTotales(codigoCupon);


    const datos= new FormData(formulario);
    datos.set("_subject", `Nuevo pedido Koveen #${numeroPedido}`);
    datos.append("numero_pedido", numeroPedido);
    datos.append("pedido", carrito.map(item =>
        `${item.nombre} x${item.cantidad} - ${formatoCOP(item.precio * item.cantidad)}`
    ).join("\n"))
    datos.append("subtotal", formatoCOP(subtotalBruto));
    datos.append("total_final", formatoCOP(total));

    boton.disabled= true;
    boton.textContent= "Enviando...";

    try {
        const respuesta= await fetch(FORMSPREE_URL, {
            method: "POST",
            body: datos,
            headers: {"Accept": "application/json"},
        });

        if (respuesta.ok) {
            document.getElementById("vista-checkout").hidden = true;
            document.getElementById("vista-confirmacion").hidden= false;
            document.getElementById("texto-confirmacion").textContent = `Pedido #${numeroPedido} enviado. Te vamos a contactar al ${datos.get("telefono")} ` +
            `para coordinar el pago y la entrega.`;

            carrito.length= 0;
            formulario.reset();
            refrescarTodo();
        } else {
            errorTexto.textContent= "No se pudo enviar el pedido. Intenta de nuevo o escribenos directamente.";
            errorTexto.hidden= false;
        }
    } catch (error) {
        errorTexto.textContent= "No se pudo enviar el pedido - revisa tu conexión e intenta de nuevo.";
        errorTexto.hidden= false;
    } finally {
        boton.textContent = "Confirmar Pedido";
    }
}

/* INICIALIZACION */

function iniciar() {
    document.querySelectorAll(".boton").forEach(boton => {
        boton.addEventListener("click", function (evento) {
            const tarjeta= boton.closest(".caja");
            if (!tarjeta) return;
            evento.preventDefault();

            const seccion= tarjeta.closest(".catalogo");
            const categoria= seccion ? seccion.id : "otros";
            const nombre = tarjeta.querySelector("h3").textContent.trim();
            const precio= textoAPrecio(tarjeta.querySelector(".precio").textContent);

            agregarAlCarrito(nombre, precio, categoria);
        });
    });

    //Abrir / cerrar el panel
    document.getElementById("btn-abrir-carrito").addEventListener("click", abrirCarrito);
    document.getElementById("btn-cerrar-carrito").addEventListener("click", cerrarCarrito);
    document.getElementById("carrito-fondo").addEventListener("click", cerrarCarrito);

// Cambiar cantidad eentro del carrito

    document.getElementById("lista-carrito").addEventListener("click", function (evento) {
        const boton = evento.target.closest(".btn-cantidad");
        if (!boton) return;
        const fila= boton.closest(".item-carrito");
        cambiarCantidad(fila.dataset.nombre, boton.dataset.accion === "sumar" ? 1 : -1);
    });

    //Cupon
    document.getElementById("input-cupon").addEventListener("input", actualizarTotales);


    document.getElementById("btn-finalizar").addEventListener("click", mostrarVistaCheckout);
    document.getElementById("btn-volver").addEventListener("click", cerrarCarrito);
    document.getElementById("btn-nueva-compra").addEventListener("click", cerrarCarrito);


    // ENVIO DEL FORMULARIO

    document.getElementById("vista-checkout").addEventListener("submit", confirmarPedido);
}

document.addEventListener("DOMContentLoaded", iniciar);
