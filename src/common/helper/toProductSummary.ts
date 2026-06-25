import { Product, ProductSummary } from '../types/search-products.type';

export const toProductSummary = (product: Product): ProductSummary => ({
  displayTitle: product.displayTitle,
  price: product.price,
  variants: product.variants,
  productType: product.productType,
  url: product.url,
});
