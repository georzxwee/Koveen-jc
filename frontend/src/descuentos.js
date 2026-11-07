export const DESCUENTOS = {
  cupones: { KOVEEN10: 10, BIENVENIDA: 5 },
  porCantidad: [{ minimo: 5, porcentaje: 10 }, { minimo: 3, porcentaje: 5 }],
  porCategoria: { calzado: 5 },
  porMontoTotal: [{ minimo: 300000, porcentaje: 5 }],
};

const descuentoPorCantidad = (cantidad) => {
  const regla = DESCUENTOS.porCantidad.find((r) => cantidad >= r.minimo);
  return regla ? regla.porcentaje : 0;
};

const descuentoPorCategoria = (categoria) => DESCUENTOS.porCategoria[categoria] || 0;

const descuentoPorMonto = (subtotal) => {
  const regla = DESCUENTOS.porMontoTotal.find((r) => subtotal >= r.minimo);
  return regla ? regla.porcentaje : 0;
};

export const formatoCOP = (valor) => "$" + Math.round(valor).toLocaleString("es-CO");

export function agregarAlCarrito(carrito, producto) {
  const item = carrito.find((p) => p._id === producto._id);
  if (item) return carrito.map((p) => (p._id === producto._id ? { ...p, cantidad: p.cantidad + 1 } : p));
  return [...carrito, { _id: producto._id, nombre: producto.nombre, precio: producto.precio, categoria: producto.categoria, cantidad: 1 }];
}

export function cambiarCantidad(carrito, id, cambio) {
  return carrito.map((p) => (p._id === id ? { ...p, cantidad: p.cantidad + cambio } : p)).filter((p) => p.cantidad > 0);
}

export const contarProductos = (carrito) => carrito.reduce((total, item) => total + item.cantidad, 0);

export function calcularTotales(carrito, cupon) {
  let subtotal = 0;
  let conDescuento = 0;

  carrito.forEach((item) => {
    const base = item.precio * item.cantidad;
    subtotal += base;
    const porcentaje = Math.max(descuentoPorCantidad(item.cantidad), descuentoPorCategoria(item.categoria));
    conDescuento += base * (1 - porcentaje / 100);
  });

  let total = conDescuento * (1 - descuentoPorMonto(subtotal) / 100);
  const porcentajeCupon = DESCUENTOS.cupones[cupon.toUpperCase()];
  if (porcentajeCupon) total = total * (1 - porcentajeCupon / 100);

  return { subtotal, total: Math.round(total) };
}