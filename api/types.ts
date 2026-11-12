/** Wrapper combining HTTP status code with parsed JSON payload. */
export interface ApiResponse<T> {
  status: number;
  body: T;
}

export interface AuthLoginRequest {
  username: string;
  password: string;
  expiresInMins?: number;
}

export interface AuthLoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  accessToken: string;
  refreshToken: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
}

export interface Product {
  id: number;
  title: string;
  description?: string;
  category: string;
  price: number;
  stock?: number;
  brand?: string;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface CreateProductRequest {
  title: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  brand: string;
}

export type UpdateProductRequest = Partial<CreateProductRequest>;

export interface DeletedProductResponse extends Product {
  isDeleted: boolean;
  deletedOn: string;
}

export interface ApiErrorResponse {
  message: string;
}
