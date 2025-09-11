import { IResponse } from '../common';

export interface IAttributeValueByIdRequest {
  id: number;
}

interface AttributeValueByIdData {
  id: number;
  value: string;
  description: string;
  attribute: {
    id: number;
    name: string;
    createdDate: string;
    modifiedDate: string;
  };
  createdDate: string;
  modifiedDate: string;
}

export interface IAttributeValueByIdResponse
  extends IResponse<AttributeValueByIdData[]> {}
