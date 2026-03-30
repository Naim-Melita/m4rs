
import galery1 from "./assets/galery1.jpg";
import galery2 from "./assets/galery2.jpg";
import galery3 from "./assets/galery3.jpg";

import fragmento01Front from "./assets/products/fragmento01/fragmento01.jpeg";
import fragmento01Detail from "./assets/products/fragmento01/fragmento01-detalle.jpeg";
import fragmento01Back from "./assets/products/fragmento01/fragmento02-trasero.jpeg";
import patchFront from "./assets/products/patch/patch1.jpg";
import patchDetail from "./assets/products/patch/patch2.jpg";
import patchSide from "./assets/products/patch/patch3.jpg";

export const productos = [
  {
    id: "fragmento-01",
    sku: "M4-FRAG-01",
    name: "Fragmento 01",
    slug: "fragmento-01",
    price: 48000,
    compareAtPrice: null,
    discountPercentage: 0,
    installmentInfo: "3 cuotas sin interés de $16.000 con tarjetas seleccionadas.",
    description:
      "FRAGMENTO 01 nace del concepto de ruptura dentro del sistema. Una base negra limpia intervenida por fragmentos azules que irrumpen como código alterado. No siguen reglas. No buscan simetría. No piden permiso. Diseñada para quienes entienden que lo diferente no se corrige, se potencia.",
    fitGuide: "Calce relajado y versátil para uso diario.",
    stockStatus: "Disponible para envío inmediato.",
    features: [
      "Base negra minimalista.",
      "Intervenciones azules en pierna y bolsillo trasero.",
      "Cintura elastizada con ajuste.",
      "Silueta cómoda y versátil.",
    ],
    composition: [
      { label: "Exterior", value: "Gabardina liviana de tacto suave" },
      { label: "Calce", value: "Relaxed fit de uso urbano" },
      { label: "Detalle", value: "Intervenciones azules de alto contraste" },
    ],
    care: [
      "Lavar con agua fría y colores similares.",
      "No usar blanqueador.",
      "Secar a la sombra.",
    ],
    shipping: [
      {
        title: "Envíos a todo el país",
        description: "Gratis a partir de $80.000. Entrega estimada de 2 a 5 días hábiles.",
      },
      {
        title: "Retiro en showroom",
        description: "Podés retirar coordinando previamente por mensaje.",
      },
    ],
    payments: [
      "Hasta 3 cuotas sin interés con tarjetas seleccionadas.",
      "Transferencia bancaria.",
      "Mercado Pago y billeteras virtuales.",
    ],
    sizes: ["M", "L", "XXL"],
    images: [fragmento01Front, fragmento01Detail, fragmento01Back],
    image: fragmento01Front,
    categories: [{ id: "shorts", name: "Shorts" }],
  },
  {
    id: "patch-m4rs",
    sku: "M4-PATCH-01",
    name: "PATCH - M4RS",
    slug: "patch-m4rs",
    price: 42000,
    compareAtPrice: null,
    discountPercentage: 0,
    installmentInfo: "3 cuotas sin interés de $14.000 con tarjetas seleccionadas.",
    description:
      "PATCH es la línea permanente de reconfiguración de M4RS. Construida a partir de retazos de denim y telas limitadas, cada pieza nace de la unión de fragmentos distintos. Cada pieza es única. Cada combinación es irrepetible. Etiqueta M4RS en un lado. Hebilla metálica y módulos de cinta en el otro. Mini formato. Identidad máxima. PATCH no recicla. Reconfigura.",
    fitGuide: "",
    stockStatus: "Pieza única disponible.",
    features: [
      "Construida a partir de retazos de denim y telas limitadas.",
      "Cada combinación es irrepetible.",
      "Etiqueta M4RS en un lado.",
      "Hebilla metálica y módulos de cinta en el otro.",
    ],
    composition: [
      { label: "Exterior", value: "Denim y textiles de edición limitada" },
      { label: "Formato", value: "Mini bag de uso diario" },
      { label: "Herrajes", value: "Hebilla metálica y módulos de cinta" },
    ],
    care: [
      "Limpiar con paño húmedo.",
      "No lavar a máquina.",
      "Guardar en lugar seco y ventilado.",
    ],
    shipping: [
      {
        title: "Envíos a todo el país",
        description: "Entrega estimada de 2 a 5 días hábiles según destino.",
      },
    ],
    payments: [
      "Hasta 3 cuotas sin interés con tarjetas seleccionadas.",
      "Transferencia bancaria.",
      "Mercado Pago y billeteras virtuales.",
    ],
    sizes: [],
    images: [patchFront, patchDetail, patchSide],
    image: patchFront,
    categories: [{ id: "accessories", name: "Accesorios" }],
  },
 
  
];

export const productoDestacado = productos[0];

export const promoGalleryCards = [
  {
    id: "gallery-1",
    image: galery1,
    alt: "Look editorial M4RS en primer plano",
    className: "md:col-span-1",
    imageClassName: "h-[720px] md:h-[1000px]",
    overlay: "bg-gradient-to-t from-black/80 via-black/20 to-transparent",
  },
  {
    id: "gallery-2",
    image: galery2,
    alt: "Look editorial M4RS en composición completa",
    className: "md:col-span-1",
    imageClassName: "h-[720px] md:h-[1000px]",
    overlay: "",
  },

   {
    id: "gallery-2",
    image: galery3,
    alt: "Look editorial M4RS en composición completa",
    className: "md:col-span-1",
    imageClassName: "h-[720px] md:h-[1000px]",
    overlay: "",
  },
];

export const getProductById = (id) =>
  productos.find((product) => product.id === id);
