interface OpenFoodFactsProduct {
  product: {
    product_name: string;
    ingredients_text: string;
  };
  status: number;
}

export async function getProductByBarcode(barcode: string): Promise<{ name: string; ingredients: string } | null> {
  try {
    const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: OpenFoodFactsProduct = await response.json();

    if (data.status === 1 && data.product?.product_name && data.product?.ingredients_text) {
      return {
        name: data.product.product_name,
        ingredients: data.product.ingredients_text,
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching product from Open Food Facts:", error);
    return null;
  }
}
