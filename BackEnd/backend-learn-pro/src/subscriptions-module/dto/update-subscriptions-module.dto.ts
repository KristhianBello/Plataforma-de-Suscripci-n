import { PartialType } from '@nestjs/mapped-types';
import { CreateSubscriptionsModuleDto } from './create-subscriptions-module.dto';

export class UpdateSubscriptionsModuleDto extends PartialType(CreateSubscriptionsModuleDto) {}
