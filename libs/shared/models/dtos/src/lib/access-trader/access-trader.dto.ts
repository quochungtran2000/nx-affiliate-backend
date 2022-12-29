import { PartialType } from '@nestjs/mapped-types';

export class CreateAccessTraderDto {}

export class UpdateAccessTraderDto extends PartialType(CreateAccessTraderDto) {}

export class AccessTraderToken {
  accessToken: string;

  public static from(dto: Partial<AccessTraderToken>) {
    const response = new AccessTraderToken();

    response.accessToken = dto.accessToken;

    return response;
  }
}

export type GetMerchantResponse = {
  display_name: [string];
  id: string;
  login_name: string;
  logo: string;
  total_offer: number;
};

export class CreateMerchantDTO {
  key: string;
  active: boolean;
  display_name: string;
  type: 'coupon' | 'coupon_hot';
  merchant_id: string;
  logo: string;
  path: string;
  target: string;
  total_offer: number;

  public static from(dto: Partial<GetMerchantResponse>) {
    const response = new CreateMerchantDTO();
    response.key = dto.login_name;
    response.display_name = dto.display_name[0] || '';
    response.type = 'coupon';
    response.merchant_id = dto.id;
    response.total_offer = dto.total_offer;
    response.active = false;
    response.logo = '';
    response.path = '';
    response.target = '_self';
    response.total_offer = dto.total_offer || 0;
    return response;
  }

  public static froms(dtos: Partial<GetMerchantResponse[]>) {
    const response = [];
    dtos.forEach((element) => {
      const item = CreateMerchantDTO.from(element);
      response.push(item);
    });
    return response;
  }
}
