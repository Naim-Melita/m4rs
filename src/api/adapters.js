// Transforma la respuesta de la API al shape que usan los componentes.
export function adaptProduct(p) {
  const sortedImages = [...(p.images ?? [])].sort((a, b) => a.order - b.order);
  const primaryImage = sortedImages.find((i) => i.isPrimary) ?? sortedImages[0];

  const sizes = (p.variants ?? [])
    .map((v) => v.size)
    .filter(Boolean);

  const price = p.variants?.[0]?.price ?? 0;

  return {
    id: p.slug,
    slug: p.slug,
    name: p.name,
    description: p.description,
    fitGuide: p.fitGuide ?? "",
    price,
    compareAtPrice: null,
    discountPercentage: 0,
    installmentInfo: null,
    stockStatus: null,
    sizes,
    images: sortedImages.map((i) => i.url),
    image: primaryImage?.url ?? "",
    features: (p.features ?? [])
      .sort((a, b) => a.order - b.order)
      .map((f) => f.text),
    composition: p.composition ?? [],
    care: (p.care ?? [])
      .sort((a, b) => a.order - b.order)
      .map((c) => c.text),
    shipping: [],
    payments: [],
    categories: (p.categories ?? []).map((c) => ({
      id: c.category.slug,
      name: c.category.name,
    })),
    variants: p.variants ?? [],
  };
}

export function adaptProducts(list) {
  return list.map(adaptProduct);
}
