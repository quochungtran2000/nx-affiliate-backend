import { PartialType } from '@nestjs/mapped-types';

export class CreateMessengerDto {}

export class UpdateMessengerDto extends PartialType(CreateMessengerDto) {}


export class GetWebhookQueryDTO {
  'hub.mode': string;
  'hub.verify_token': string;
  'hub.challenge': string | number;
}