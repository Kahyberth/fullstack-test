export type Product = {
  displayTitle: string;
  embeddingText: string;
  url: string;
  imageUrl: string;
  productType: string;
  discount: number;
  price: string;
  variants: string;
  createDate: string;
};

export type EmbeddedProduct = {
  product: Product;
  embedding: number[];
};

export type ProductSummary = Pick<
  Product,
  'displayTitle' | 'price' | 'variants' | 'productType' | 'url'
>;
