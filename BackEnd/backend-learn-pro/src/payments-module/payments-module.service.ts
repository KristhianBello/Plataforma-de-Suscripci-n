import { Injectable } from '@nestjs/common';
import { CreatePaymentsModuleDto } from './dto/create-payments-module.dto';
import { UpdatePaymentsModuleDto } from './dto/update-payments-module.dto';

@Injectable()
export class PaymentsModuleService {
  create(createPaymentsModuleDto: CreatePaymentsModuleDto) {
    return 'This action adds a new paymentsModule';
  }

  findAll() {
    return `This action returns all paymentsModule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} paymentsModule`;
  }

  update(id: number, updatePaymentsModuleDto: UpdatePaymentsModuleDto) {
    return `This action updates a #${id} paymentsModule`;
  }

  remove(id: number) {
    return `This action removes a #${id} paymentsModule`;
  }
}
