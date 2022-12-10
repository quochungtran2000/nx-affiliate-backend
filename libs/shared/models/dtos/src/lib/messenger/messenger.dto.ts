import { PartialType } from '@nestjs/mapped-types';

export class CreateMessengerDto {}

export class UpdateMessengerDto extends PartialType(CreateMessengerDto) {}
