import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ProjectorsService } from './projectors.service';
import { CreateProjectorDto } from './dto/create-projector.dto';
import { ProjectorResponseDto } from './dto/projector-response.dto';
import { UpdateProjectorDto } from './dto/update-projector.dto';

@Controller('projectors')
export class ProjectorsController {
  constructor(private readonly projectorsService: ProjectorsService) {}

  @Post()
  create(@Body() dto: CreateProjectorDto): Promise<ProjectorResponseDto> {
    return this.projectorsService.create(dto);
  }

  @Get()
  findAll(): Promise<ProjectorResponseDto[]> {
    return this.projectorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ProjectorResponseDto> {
    return this.projectorsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProjectorDto,
  ): Promise<ProjectorResponseDto> {
    return this.projectorsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.projectorsService.remove(id);
  }
}
