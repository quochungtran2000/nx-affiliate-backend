import { PartialType } from '@nestjs/mapped-types';

export class CreateAccessTraderDto {}

export class UpdateAccessTraderDto extends PartialType(CreateAccessTraderDto) {}
