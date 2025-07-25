import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentsModuleDto } from './create-payments-module.dto';

export class UpdatePaymentsModuleDto extends PartialType(CreatePaymentsModuleDto) {}
