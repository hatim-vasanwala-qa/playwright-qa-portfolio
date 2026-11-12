import { expect, test } from '../../fixtures/test-fixtures';
import type { ApiErrorResponse, Product } from '../../api/types';
import { assertValidProductSchema } from '../../utils/assertions';
import { buildProductPayload } from '../../utils/test-data';

test.describe('Products REST API CRUD & Validation', () => {
  test('GET /products returns paginated catalog matching expected schema', async ({
    apiClient,
  }) => {
    const limit = 10;
    const skip = 5;
    const response = await apiClient.listProducts(limit, skip);

    expect(response.status).toBe(200);
    expect(response.body.limit).toBe(limit);
    expect(response.body.skip).toBe(skip);
    expect(response.body.total).toBeGreaterThan(0);
    expect(response.body.products).toHaveLength(limit);

    for (const product of response.body.products) {
      assertValidProductSchema(product);
    }
  });

  test('GET /products/search returns relevant records for search keyword', async ({
    apiClient,
  }) => {
    const response = await apiClient.searchProducts('phone');

    expect(response.status).toBe(200);
    expect(response.body.products.length).toBeGreaterThan(0);
    for (const product of response.body.products) {
      assertValidProductSchema(product);
    }
  });

  test('POST/PUT/DELETE /products lifecycle validates create, update, and delete', async ({
    apiClient,
  }) => {
    const newProduct = buildProductPayload();

    const createResponse = await apiClient.createProduct(newProduct);
    expect(createResponse.status).toBe(201);
    expect(createResponse.body.id).toBeGreaterThan(0);
    expect(createResponse.body.title).toBe(newProduct.title);
    expect(createResponse.body.price).toBe(newProduct.price);

    const updatedTitle = `${newProduct.title} - Pro Edition`;
    const updateResponse = await apiClient.updateProduct(1, { title: updatedTitle });
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.id).toBe(1);
    expect(updateResponse.body.title).toBe(updatedTitle);

    const deleteResponse = await apiClient.deleteProduct(1);
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.isDeleted).toBe(true);
    expect(deleteResponse.body.deletedOn).toBeTruthy();
  });

  test('GET /products/:id returns 404 for non-existent product ID', async ({ apiClient }) => {
    const response = await apiClient.getProductById(999_999);

    expect(response.status).toBe(404);
    const error = response.body as ApiErrorResponse;
    expect(error.message).toContain('not found');
  });

  test('GET /products/1 returns single valid product record', async ({ apiClient }) => {
    const response = await apiClient.getProductById(1);

    expect(response.status).toBe(200);
    const product = response.body as Product;
    assertValidProductSchema(product);
    expect(product.id).toBe(1);
  });
});
