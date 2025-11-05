export interface Product {
  id: string;               // ObjectId en Mongo, Prisma lo mapea a string
  title: string;
  slug: string;
  price: number;
  stock: number;
  description?: string;
  materials: string[];
  styleTags: string[];
  roomTags: string[];
  widthCm?: number;
  depthCm?: number;
  heightCm?: number;
  weightKg?: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  featured: boolean;
  publishedAt?: string;
  images: string[]; // la primera es la principal
  // relaciones (simplificadas)
  categories?: { id: string; name: string; slug: string }[];
  createdAt: string;
  updatedAt: string;
  discountPercentage?: number;
}
