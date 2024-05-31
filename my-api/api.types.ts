import { AxiosResponse } from 'axios';

export type User = {
  admin: boolean;
  blocked: boolean;
  dateCreated: string;
  email: string;
  lastLogin: string;
  registrationConfirmed: boolean;
  username: string;
  _id: string;
};

export type Product = {
  brand: string;
  categories: Array<{
    categoryName: string;
    categorySlug: string;
    parent: string;
    path: Array<string>;
    subcategories: Array<string>;
    __v: number;
    _id: string;
  }>;
  dateCreated: string;
  finalPrice: number;
  imagesUrl: Array<string>;
  index: number;
  longDescription: string;
  meta: {
    discount: number;
    topSale: boolean;
  };
  model: string;
  price: number;
  shortDescription: string;
  stock: number;
  title: string;
  __v: number;
  _id: string;
};

export type ProductWithQuantity = Product & { quantity: number };

export type Category = {
  categoryName: string;
  categorySlug: string;
  parent: string;
  subcategories: Category[];
  _id: string;
  path: string[];
  imageUrl: string;
};

export type GetCategoriesResponse = Promise<AxiosResponse<Category[]>>;

export type GetCategoryRequest = {
  categoryId: string;
};

export type GetCategoriesByPathRequest = {
  categoryId: string;
};

export type GetCategoriesByPathResponse = Promise<AxiosResponse<Category[]>>;

export type GetCategoryResponse = Promise<AxiosResponse<Category>>;

export type AddCategoryRequest = {
  parentId: string;
  categoryName: string;
  image: File;
};

export type UpdateCategoryRequest = {
  newCategoryName: string;
  categoryId: string;
  image: File;
};

export type UpdateCategoryResponse = Promise<AxiosResponse<{ message: string }>>;

export type AddCategoryResponse = Promise<AxiosResponse<{ message: string }>>;

export type DeleteCategoryRequest = {
  categoryId: string;
};
export type DeleteCategoryResponse = Promise<AxiosResponse<{ message: string }>>;

export type RegisterRequest = {
  email: string;
  password: string;
  username: string;
  confirmPassword: string;
};

export type RegisterResponse = Promise<AxiosResponse<{ message: string }>>;

export type ForgotPasswordRequest = {
  email: string;
};

export type ForgotPasswordResponse = Promise<AxiosResponse<{ message: string }>>;

export type AddProductRequest = {
  brand: string;
  categories: string[];
  discount: string;
  images: File[];
  longDescription: string;
  model: string;
  price: string;
  shortDescription: string;
  stock: string;
  title: string;
  topSale: string;
};

export type DeleteProductRequest = {
  productId: string;
};

export type DeleteProductResponse = Promise<AxiosResponse<{ message: string }>>;

export type AddProductResponse = Promise<AxiosResponse<{ message: string }>>;

export type UpdateProductRequest = AddProductRequest & { _id: string };

export type UpdateProductResponse = Promise<AxiosResponse<{ message: string }>>;

export type GetImageRequest = {
  url: string;
};

export type GetImageResponse = Promise<AxiosResponse>;

export type CompanyInformation = {
  address: string;
  email: string;
  fax: string;
  phoneNumber: string;
  firstTextField: string;
  secondTextField: string;
  companyName: string;
  bannerUrl: string;
  logoUrl: string;
  topProductsUrl: string;
  discountsUrl: string;
};

export type GetCompanyInformationResponse = Promise<AxiosResponse<CompanyInformation>>;

export type UpdateCompanyInformationRequest = {
  address: string;
  email: string;
  fax: string;
  phoneNumber: string;
  firstTextField: string;
  secondTextField: string;
  companyName: string;
  banner: File;
  logo: File;
  topProductsImage: File;
  discountsImage: File;
};

export type UpdateCompanyInformationResponse = Promise<AxiosResponse<{ message: string }>>;

export type GetProductsRequest = {
  brand?: string;
  category?: string;
  topSale?: boolean;
  withDiscount?: boolean;
};

export type GetProductsResponse = Promise<AxiosResponse<Array<Product>>>;

export type ChangePasswordRequest = {
  newPassword: string;
  oldPassword: string;
};

export type ChangePasswordResponse = Promise<AxiosResponse<{ message: string }>>;

export type SwapProductsIndexRequest = {
  sourceProduct: {
    id: string;
    index: string;
  };
  destinationProduct: {
    id: string;
    index: string;
  };
};
export type SwapProductsIndexResponse = Promise<AxiosResponse<{ message: string }>>;

export type GetUsersResponse = Promise<AxiosResponse<Array<User>>>;

export type ToggleUserRequest = {
  userId: string;
};

export type ToggleUserResponse = Promise<AxiosResponse<{ message: string }>>;

export type GetProductsByIdRequest = {
  products: Array<string>;
};

export type GetProductsByIdResponse = Promise<AxiosResponse<Array<Product>>>;

export type AuthorizeUserRequest = {
  email: string;
  password: string;
};

export type AuthorizeUserResponse = Promise<
  AxiosResponse<{
    _id: string;
    email: string;
    username: string;
    lastLogin: string;
    isAdmin: boolean;
    dateCreated: string;
    token: string;
  }>
>;

export type GetUserBlockStatusRequest = {
  email: string;
};

export type GetUserBlockStatusResponse = Promise<AxiosResponse<{ message: string }>>;

export type ValidateTokenRequest = {
  token: string;
};

export type ValidateTokenResponse = Promise<AxiosResponse<{ isValidated: boolean }>>;

export type ResetPasswordRequest = {
  newPassword: string;
  firstTokenValidation: string;
  token: string;
};

export type ResetPasswordResponse = Promise<AxiosResponse<{ passwordChanged: boolean; message: string }>>;

export type ValidateConfirmEmailTokenRequest = {
  token: string;
};

export type ValidateConfirmEmailTokenResponse = Promise<AxiosResponse<{ isValidated: boolean }>>;

export type GetTopSaleAndDiscountProductsIdsResponse = Promise<AxiosResponse<Array<string>>>;

export type GetProductRequest = {
  productId: string;
};

export type GetProductResponse = Promise<AxiosResponse<Product>>;

export type CreateCheckoutSessionRequest = {
  products: Array<{ itemId: string; quantity: number }>;
};

export type CreateCheckoutSessionResponse = Promise<AxiosResponse<{ sessionId: string }>>;

export type FinalizeSaleRequest = Array<{ _id: string; quantity: number }>;

export type FinalizeSaleResponse = Promise<AxiosResponse<{ message: string }>>;
