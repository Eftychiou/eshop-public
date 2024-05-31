import AXIOS from 'axios';
import { signOut } from 'next-auth/react';
import * as types from './api.types';
import { getSession } from 'next-auth/react';

const axios = AXIOS.create({
  baseURL: process.env.SERVER_DOMAIN,
  timeout: 5000
});

class Api {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handleError(err): any {
    if (err.isAxiosError && err.response) {
      if (err.response.status === 401) {
        signOut({ redirect: true });
      }
      throw new Error(err.response.data.message);
    } else if (err.isAxiosError && err.request) {
      throw new Error(err.message);
    }
    throw err;
  }

  private getHeaderWithAccToken = () => {
    return getSession()
      .then((session) => {
        if (!session) {
          throw new Error('Session Expired');
        }
        return {
          headers: { Authorization: 'Bearer ' + session.accessToken }
        };
      })
      .catch((err: Error) => {
        setTimeout(() => {
          window.location.href = process.env.DOMAIN;
        }, 2400);
        throw err;
      });
  };

  getCategories(): types.GetCategoriesResponse {
    return axios(`/shop/categories`).catch(this.handleError);
  }

  getCategory(request: types.GetCategoryRequest): types.GetCategoryResponse {
    return axios(`/shop/categories/${request.categoryId}`).catch(this.handleError);
  }

  getCategoriesByPath(request: types.GetCategoriesByPathRequest): types.GetCategoriesByPathResponse {
    return axios(`/shop/categories/by_path/${request.categoryId}`).catch(this.handleError);
  }

  addCategory(request: types.AddCategoryRequest): types.AddCategoryResponse {
    return this.getHeaderWithAccToken()
      .then((headers) => {
        const formData = new FormData();
        const requestWithoutImages = { ...request };
        delete requestWithoutImages.image;

        const formDataToJson = JSON.stringify(requestWithoutImages);

        formData.append('categories', request.image);
        formData.append('formData', formDataToJson);
        return axios.post(`/admin/categories`, formData, { ...headers });
      })
      .catch(this.handleError);
  }

  updateCategory(request: types.UpdateCategoryRequest): types.UpdateCategoryResponse {
    console.log({ request });

    return this.getHeaderWithAccToken()
      .then((headers) => {
        const formData = new FormData();
        const requestWithoutImages = { ...request };
        delete requestWithoutImages.image;

        const formDataToJson = JSON.stringify(requestWithoutImages);

        formData.append('categories', request.image);
        formData.append('formData', formDataToJson);
        return axios.put(`/admin/categories`, formData, { ...headers });
      })
      .catch(this.handleError);
  }

  deleteCategory(request: types.DeleteCategoryRequest): types.DeleteCategoryResponse {
    return this.getHeaderWithAccToken()
      .then((headers) => {
        return axios.delete(`/admin/categories`, { ...headers, data: request });
      })
      .catch(this.handleError);
  }

  register(request: types.RegisterRequest): types.RegisterResponse {
    return axios.post(`/user/create-user`, request).catch(this.handleError);
  }

  forgotPassword(request: types.ForgotPasswordRequest): types.ForgotPasswordResponse {
    return axios.post(`/user/forgot-password`, request).catch(this.handleError);
  }

  addProduct(request: types.AddProductRequest): types.AddProductResponse {
    return this.getHeaderWithAccToken().then((headers) => {
      const formData = new FormData();
      const requestWithoutImages = { ...request };
      delete requestWithoutImages.images;

      const formDataToJson = JSON.stringify(requestWithoutImages);
      request.images.forEach((img) => formData.append('products', img));
      formData.append('formData', formDataToJson);

      return axios.post('/admin/products', formData, { ...headers }).catch(this.handleError);
    });
  }

  updateProduct(request: types.UpdateProductRequest): types.UpdateProductResponse {
    return this.getHeaderWithAccToken().then((headers) => {
      const formData = new FormData();
      const requestWithoutImages = { ...request };
      delete requestWithoutImages.images;

      const formDataToJson = JSON.stringify(requestWithoutImages);

      request.images.forEach((img) => formData.append('products', img));
      formData.append('formData', formDataToJson);
      return axios.put('/admin/products', formData, { ...headers }).catch(this.handleError);
    });
  }

  deleteProduct(request: types.DeleteProductRequest): types.DeleteProductResponse {
    console.log({ request });
    return this.getHeaderWithAccToken()
      .then((headers) => {
        return axios.delete(`/admin/products/${request.productId}`, { ...headers, data: request });
      })
      .catch(this.handleError);
  }

  getImage(request: types.GetImageRequest): types.GetImageResponse {
    return axios(request.url, { responseType: 'arraybuffer' }).catch(this.handleError);
  }

  getCompanyInformation(): types.GetCompanyInformationResponse {
    return axios('/shop/company').catch(this.handleError);
  }

  updateCompanyInformation(request: types.UpdateCompanyInformationRequest): types.UpdateCompanyInformationResponse {
    return this.getHeaderWithAccToken().then((headers) => {
      const formData = new FormData();
      const requestWithoutImages = { ...request };
      delete requestWithoutImages.banner;
      delete requestWithoutImages.logo;

      const formDataToJson = JSON.stringify(requestWithoutImages);
      formData.append('logo', request.logo);
      formData.append('banner', request.banner);
      formData.append('topProductsImage', request.topProductsImage);
      formData.append('discountsImage', request.discountsImage);

      formData.append('formData', formDataToJson);
      return axios.put('/admin/company', formData, { ...headers }).catch(this.handleError);
    });
  }

  getProducts(request: types.GetProductsRequest): types.GetProductsResponse {
    let filter = '';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filterList: Array<any> = Object.entries(request)
      .filter(([_, value]) => !!value)
      .map(([name, value]) => ({ name, value: value }));
    if (filterList.length > 0) {
      filter = `?filter=${filterList.map((f) => `${f.name}==${f.value}`).join(',')}`;
    }

    return axios.get(`/shop/products/${filter}`).catch(this.handleError);
  }

  changePassword(request: types.ChangePasswordRequest): types.ChangePasswordResponse {
    return this.getHeaderWithAccToken()
      .then((headers) => {
        return axios.patch(`/user/change-password`, request, { ...headers });
      })
      .catch(this.handleError);
  }

  swapProductsIndex(request: types.SwapProductsIndexRequest): types.SwapProductsIndexResponse {
    return this.getHeaderWithAccToken()
      .then((headers) => {
        return axios.patch(`/admin/products/swap-products-index`, request, { ...headers });
      })
      .catch(this.handleError);
  }

  getUsers(): types.GetUsersResponse {
    return this.getHeaderWithAccToken()
      .then((headers) => {
        return axios.get(`/admin/users`, { ...headers });
      })
      .catch(this.handleError);
  }

  toggleUser(request: types.ToggleUserRequest): types.ToggleUserResponse {
    return this.getHeaderWithAccToken()
      .then((headers) => {
        return axios.patch(`/admin/users/toggle_user/${request.userId}`, {}, { ...headers });
      })
      .catch(this.handleError);
  }

  getProductsById(request: types.GetProductsByIdRequest): types.GetProductsByIdResponse {
    return axios.get(`shop/products/by_id/?filter=${request.products.join(',')}`).catch(this.handleError);
  }

  authorizeUser(request: types.AuthorizeUserRequest): types.AuthorizeUserResponse {
    return axios.post(`/user/authorize`, request).catch(this.handleError);
  }
  getUserBlockStatus(request: types.GetUserBlockStatusRequest): types.GetUserBlockStatusResponse {
    return axios.get(`/user/block_status/?email=${request.email}`).catch(this.handleError);
  }

  validateToken(request: types.ValidateTokenRequest): types.ValidateTokenResponse {
    return axios.post(`/user/validate_token`, request).catch(this.handleError);
  }

  resetPassword(request: types.ResetPasswordRequest): types.ResetPasswordResponse {
    return axios.post(`/user/reset_password`, request).catch(this.handleError);
  }
  verifyEmail(request: types.ValidateConfirmEmailTokenRequest): types.ValidateConfirmEmailTokenResponse {
    return axios.post(`/user/verify_email`, request).catch(this.handleError);
  }

  getTopSaleAndDiscountProductsIds(): types.GetTopSaleAndDiscountProductsIdsResponse {
    return axios.get(`/shop/get_top_sale_and_discount_products_ids`);
  }

  getProductById(request: types.GetProductRequest): types.GetProductResponse {
    return axios.get(`/shop/products/${request.productId}`).catch(this.handleError);
  }

  createCheckoutSession(request: types.CreateCheckoutSessionRequest): types.CreateCheckoutSessionResponse {
    return axios.post(`/shop/create_checkout_session`, request).catch(this.handleError);
  }

  finalizeSale(request: types.FinalizeSaleRequest): types.FinalizeSaleResponse {
    return axios.post(`/shop/finalize_sale`, request).catch(this.handleError);
  }
}
export const ApiInstance = new Api();
