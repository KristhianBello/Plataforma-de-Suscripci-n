import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubscriptionsModuleService } from './subscriptions-module.service';
import { CreateSubscriptionsModuleDto } from './dto/create-subscriptions-module.dto';
import { UpdateSubscriptionsModuleDto } from './dto/update-subscriptions-module.dto';

@Controller('subscriptions-module')
export class SubscriptionsModuleController {
  constructor(private readonly subscriptionsModuleService: SubscriptionsModuleService) {}

  @Post()
  create(@Body() createSubscriptionsModuleDto: CreateSubscriptionsModuleDto) {
    return this.subscriptionsModuleService.create(createSubscriptionsModuleDto);
  }

  @Get()
  findAll() {
    return this.subscriptionsModuleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subscriptionsModuleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubscriptionsModuleDto: UpdateSubscriptionsModuleDto) {
    return this.subscriptionsModuleService.update(+id, updateSubscriptionsModuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscriptionsModuleService.remove(+id);
  }
}
