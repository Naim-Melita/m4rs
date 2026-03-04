import image1 from "./assets/image1.jpg";
import image2 from "./assets/image2.jpg";
import image3 from "./assets/image3.jpg";
import image4 from "./assets/image4.jpg";
import galery1 from "./assets/galery1.jpg";
import galery2 from "./assets/galery2.jpg";

export const productos = [
  {
    id: "producto-1",
    name: "Crystal Stone Tee",
    price: 2799.00,
    image: image1,
  },
  {
    id: "producto-2",

    name: "Shark Hoodie",
    price: 2799.00,
    image: image2,
  },
  {
    id: "producto-3",
    name: "Corduroy Shirt",
    price: 2799.00,
    image: image3,
  },
  {
    id: "producto-4",


    name: "Camo Jacket",
    price: 2799.00,
    image: image4,
  },
];

export const productoDestacado = {
  id: "producto-149",
  sku: "M4-149",
  name: "Campera Nebula Softshell",
  price: 89999,
  compareAtPrice: 109999,
  discountPercentage: 18,
  installmentInfo: "3 cuotas sin interés de $29.999,67 con tarjetas seleccionadas.",
  description:
    "Campera técnica confeccionada con tejido softshell de tres capas, interior térmico y exterior con tratamiento repelente al agua. Diseñada para climas fríos urbanos, combina aislamiento, respirabilidad y un perfil minimalista inspirado en la estética techwear.",
  fitGuide: "El modelo mide 1,78 m, pesa 74 kg y usa talle M.",
  stockStatus: "Disponible para envío inmediato.",
  features: [
    "Membrana impermeable 10K / respirable 5K.",
    "Interiores termo sellados y cierres YKK® resistentes al agua.",
    "Capucha ergonómica con ajuste tridireccional y visera rígida.",
    "Bolsillos internos con media malla y salida para cable.",
  ],
  composition: [
    { label: "Exterior", value: "100% poliéster con acabado DWR" },
    { label: "Interior", value: "Forro micro polar térmico" },
    { label: "Peso", value: "620 g (talle M)" },
  ],
  care: [
    "Lavar a mano o en ciclo delicado con agua fría.",
    "No usar blanqueadores ni suavizantes.",
    "Secar a la sombra y no planchar.",
  ],
  shipping: [
    {
      title: "Envíos a todo el país",
      description: "Gratis a partir de $80.000. Entregas 24-72 hs en CABA y GBA.",
    },
    {
      title: "Retiro en tienda",
      description: "Disponible en nuestro showroom de Palermo con cita previa.",
    },
  ],
  payments: [
    "Hasta 6 cuotas fijas con tarjeta Visa, Mastercard y Amex.",
    "Transferencia bancaria con 10% off adicional.",
    "Pagá con Mercado Pago o MODO.",
  ],
  sizes: ["S", "M", "L", "XL"],
  images: [image2, image3],
  categories: [{ id: "outerwear", name: "Abrigos" }],
};
