import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentsModuleService } from './payments-module.service';
import { CreatePaymentsModuleDto } from './dto/create-payments-module.dto';
import { UpdatePaymentsModuleDto } from './dto/update-payments-module.dto';

@Controller('payments-module')
export class PaymentsModuleController {
  constructor(private readonly paymentsModuleService: PaymentsModuleService) {}

  @Post()
  create(@Body() createPaymentsModuleDto: CreatePaymentsModuleDto) {
    return this.paymentsModuleService.create(createPaymentsModuleDto);
  }

  @Get()
  findAll() {
    return this.paymentsModuleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsModuleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentsModuleDto: UpdatePaymentsModuleDto) {
    return this.paymentsModuleService.update(+id, updatePaymentsModuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentsModuleService.remove(+id);
  }
}
