import { PartialType } from '@nestjs/mapped-types';
import { CreateProgressModuleDto } from './create-progress-module.dto';

export class UpdateProgressModuleDto extends PartialType(CreateProgressModuleDto) {}
