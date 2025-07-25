import { Injectable } from '@nestjs/common';
import { CreateSubscriptionsModuleDto } from './dto/create-subscriptions-module.dto';
import { UpdateSubscriptionsModuleDto } from './dto/update-subscriptions-module.dto';

@Injectable()
export class SubscriptionsModuleService {
  create(createSubscriptionsModuleDto: CreateSubscriptionsModuleDto) {
    return 'This action adds a new subscriptionsModule';
  }

  findAll() {
    return `This action returns all subscriptionsModule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subscriptionsModule`;
  }

  update(id: number, updateSubscriptionsModuleDto: UpdateSubscriptionsModuleDto) {
    return `This action updates a #${id} subscriptionsModule`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscriptionsModule`;
  }
}
