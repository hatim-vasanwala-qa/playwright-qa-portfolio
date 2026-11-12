import type { APIRequestContext, APIResponse } from '@playwright/test';
import type {
  ApiErrorResponse,
  ApiResponse,
  AuthLoginRequest,
  AuthLoginResponse,
  CreateProductRequest,
  DeletedProductResponse,
  Product,
  ProductListResponse,
  UpdateProductRequest,
  UserProfile,
} from './types';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

/** Typed REST API client wrapping Playwright's APIRequestContext. */
export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  private async send<T>(
    method: HttpMethod,
    path: string,
    options?: {
      data?: unknown;
      params?: Record<string, string | number>;
      token?: string;
    },
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (options?.token) {
      headers.Authorization = `Bearer ${options.token}`;
    }

    const response: APIResponse = await this.request.fetch(path, {
      method,
      headers,
      data: options?.data,
      params: options?.params,
    });

    const body = (await response.json()) as T;
    return { status: response.status(), body };
  }

  /** Authenticates against `/auth/login` and returns user metadata plus tokens. */
  async login(
    payload: AuthLoginRequest,
  ): Promise<ApiResponse<AuthLoginResponse | ApiErrorResponse>> {
    return this.send('POST', '/auth/login', { data: payload });
  }

  /** Retrieves the currently authenticated profile via `/auth/me`. */
  async getCurrentUser(token?: string): Promise<ApiResponse<UserProfile | ApiErrorResponse>> {
    return this.send('GET', '/auth/me', { token });
  }

  /** Fetches a paginated slice of products from `/products`. */
  async listProducts(limit = 10, skip = 0): Promise<ApiResponse<ProductListResponse>> {
    return this.send('GET', '/products', { params: { limit, skip } });
  }

  /** Searches products matching a query string via `/products/search`. */
  async searchProducts(query: string): Promise<ApiResponse<ProductListResponse>> {
    return this.send('GET', '/products/search', { params: { q: query } });
  }

  /** Fetches a single product record by ID. */
  async getProductById(id: number): Promise<ApiResponse<Product | ApiErrorResponse>> {
    return this.send('GET', `/products/${id}`);
  }

  /** Simulates creating a product via `POST /products/add`. */
  async createProduct(payload: CreateProductRequest): Promise<ApiResponse<Product>> {
    return this.send('POST', '/products/add', { data: payload });
  }

  /** Simulates updating an existing product via `PUT /products/:id`. */
  async updateProduct(id: number, payload: UpdateProductRequest): Promise<ApiResponse<Product>> {
    return this.send('PUT', `/products/${id}`, { data: payload });
  }

  /** Simulates deleting a product via `DELETE /products/:id`. */
  async deleteProduct(id: number): Promise<ApiResponse<DeletedProductResponse>> {
    return this.send('DELETE', `/products/${id}`);
  }
}
