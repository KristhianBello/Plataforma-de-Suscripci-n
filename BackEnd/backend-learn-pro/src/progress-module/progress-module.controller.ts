import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProgressModuleService } from './progress-module.service';
import { CreateProgressModuleDto } from './dto/create-progress-module.dto';
import { UpdateProgressModuleDto } from './dto/update-progress-module.dto';

@Controller('progress-module')
export class ProgressModuleController {
  constructor(private readonly progressModuleService: ProgressModuleService) {}

  @Post()
  create(@Body() createProgressModuleDto: CreateProgressModuleDto) {
    return this.progressModuleService.create(createProgressModuleDto);
  }

  @Get()
  findAll() {
    return this.progressModuleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.progressModuleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProgressModuleDto: UpdateProgressModuleDto) {
    return this.progressModuleService.update(+id, updateProgressModuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.progressModuleService.remove(+id);
  }
}
