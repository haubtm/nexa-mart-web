import type {
  IPromotionByIdRequest,
  IPromotionDeleteRequest,
  IPromotionDeleteResponse,
  IPromotionListResponse,
  IPromotionByIdResponse,
  IPromotionListRequest,
  IPromotionLinesByHeaderIdRequest,
  IPromotionLinesByHeaderIdResponse,
  IPromotionLineByLineIdRequest,
  IPromotionLineByLineIdResponse,
  IPromotionHeaderCreateRequest,
  IPromotionHeaderCreateResponse,
  IPromotionLineCreateRequest,
  IPromotionLineCreateResponse,
  IPromotionHeaderUpdateRequest,
  IPromotionHeaderUpdateResponse,
  IPromotionLineUpdateRequest,
  IPromotionLineUpdateResponse,
  IPromotionLineDeleteRequest,
  IPromotionLineDeleteResponse,
  IPromotionDetailCreateRequest,
  IPromotionDetailCreateResponse,
  IPromotionDetailUpdateRequest,
  IPromotionDetailUpdateResponse,
  IPromotionDetailDeleteRequest,
  IPromotionDetailDeleteResponse,
  IPromotionCheckRequest,
  IPromotionCheckResponse,
} from '@/dtos';
import { apiService } from '../axiosService';

const BASE_ENDPOINT = '/promotions';

export const promotionApi = {
  list: async (body: IPromotionListRequest) => {
    const response = await apiService.get<IPromotionListResponse>(
      `${BASE_ENDPOINT}`,
      { params: body },
    );

    return response;
  },

  byId: async (body: IPromotionByIdRequest) => {
    const response = await apiService.get<IPromotionByIdResponse>(
      `${BASE_ENDPOINT}/${body.promotionId}`,
    );

    return response;
  },

  byHeaderId: async (body: IPromotionLinesByHeaderIdRequest) => {
    const response = await apiService.get<IPromotionLinesByHeaderIdResponse>(
      `${BASE_ENDPOINT}/${body.promotionId}/lines`,
      { params: body },
    );

    return response;
  },

  byLineId: async (body: IPromotionLineByLineIdRequest) => {
    const response = await apiService.get<IPromotionLineByLineIdResponse>(
      `${BASE_ENDPOINT}/lines/${body.lineId}`,
    );

    return response;
  },

  createPromotionHeader: async (body: IPromotionHeaderCreateRequest) => {
    const response = await apiService.post<IPromotionHeaderCreateResponse>(
      `${BASE_ENDPOINT}/headers`,
      body,
    );

    return response;
  },

  createPromotionLine: async (body: IPromotionLineCreateRequest) => {
    const response = await apiService.post<IPromotionLineCreateResponse>(
      `${BASE_ENDPOINT}/headers/${body.headerId}/lines`,
      body,
    );

    return response;
  },

  createPromotionDetail: async (body: IPromotionDetailCreateRequest) => {
    const response = await apiService.post<IPromotionDetailCreateResponse>(
      `${BASE_ENDPOINT}/lines/${body.lineId}/details`,
      body,
    );
    return response;
  },

  updateProductHeader: async (body: IPromotionHeaderUpdateRequest) => {
    const response = await apiService.put<IPromotionHeaderUpdateResponse>(
      `${BASE_ENDPOINT}/headers/${body.promotionId}`,
      body,
    );

    return response;
  },

  updateProductLine: async (body: IPromotionLineUpdateRequest) => {
    const response = await apiService.put<IPromotionLineUpdateResponse>(
      `${BASE_ENDPOINT}/lines/${body.lineId}`,
      body,
    );

    return response;
  },

  updateProductDetail: async (body: IPromotionDetailUpdateRequest) => {
    const response = await apiService.put<IPromotionDetailUpdateResponse>(
      `${BASE_ENDPOINT}/details/${body.detailId}`,
      body,
    );

    return response;
  },

  delete: async (body: IPromotionDeleteRequest) => {
    const response = await apiService.delete<IPromotionDeleteResponse>(
      `${BASE_ENDPOINT}/${body.ids}`,
    );

    return response;
  },

  deleteLine: async (body: IPromotionLineDeleteRequest) => {
    const response = await apiService.delete<IPromotionLineDeleteResponse>(
      `${BASE_ENDPOINT}/lines/${body.ids}`,
    );

    return response;
  },

  deleteDetail: async (body: IPromotionDetailDeleteRequest) => {
    const response = await apiService.delete<IPromotionDetailDeleteResponse>(
      `${BASE_ENDPOINT}/details/${body.ids}`,
    );
    return response;
  },

  checkPromotion: async (body: IPromotionCheckRequest) => {
    const response = await apiService.post<IPromotionCheckResponse>(
      `${BASE_ENDPOINT}/check`,
      body,
    );

    return response;
  },
};
