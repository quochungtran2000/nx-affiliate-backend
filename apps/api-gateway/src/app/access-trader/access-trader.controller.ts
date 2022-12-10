import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateAccessTraderDto, UpdateAccessTraderDto } from '@shared/models/dtos'
import { AccessTraderService } from './access-trader.service';

@Controller('access-trader')
export class AccessTraderController {
  constructor(private readonly accessTraderService: AccessTraderService) {}

  @Post()
  create(@Body() createAccessTraderDto: CreateAccessTraderDto) {
    return this.accessTraderService.create(createAccessTraderDto);
  }

  @Get()
  findAll() {
    return this.accessTraderService.ping();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accessTraderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccessTraderDto: UpdateAccessTraderDto) {
    return this.accessTraderService.update(+id, updateAccessTraderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accessTraderService.remove(+id);
  }
}
