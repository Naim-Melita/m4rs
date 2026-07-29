// Inserta /f_auto,q_auto/ en URLs de Cloudinary para optimizar entrega
function optimizeUrl(url) {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  return url.replace("/upload/", "/upload/f_auto,q_auto/");
}

export function adaptProduct(p) {
  const sortedImages = [...(p.images ?? [])].sort((a, b) => a.order - b.order);
  const primaryImage = sortedImages.find((i) => i.isPrimary) ?? sortedImages[0];

  const sizes = (p.variants ?? [])
    .map((v) => v.size)
    .filter(Boolean);

  const variantPrices = (p.variants ?? []).map((v) => v.price).filter((n) => n > 0);
  const price = variantPrices.length ? Math.min(...variantPrices) : 0;

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
    images: sortedImages.map((i) => optimizeUrl(i.url)),
    image: optimizeUrl(primaryImage?.url ?? ""),
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
