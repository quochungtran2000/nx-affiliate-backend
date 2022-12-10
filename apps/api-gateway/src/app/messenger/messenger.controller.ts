import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateMessengerDto, UpdateMessengerDto } from '@shared/models/dtos';
import { MessengerService } from './messenger.service';

@Controller('messenger')
export class MessengerController {
  constructor(private readonly messengerService: MessengerService) {}

  @Post()
  create(@Body() createMessengerDto: CreateMessengerDto) {
    return this.messengerService.create(createMessengerDto);
  }

  @Get()
  findAll() {
    return this.messengerService.ping();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messengerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessengerDto: UpdateMessengerDto) {
    return this.messengerService.update(+id, updateMessengerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messengerService.remove(+id);
  }
}
