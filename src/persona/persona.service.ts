import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePersonaDto } from './dto/create-persona.dto';

@Injectable()
export class PersonaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPersonaDto: CreatePersonaDto) {
    return this.prisma.persona.create({ data: createPersonaDto });
  }

  async findAll() {
    return this.prisma.persona.findMany();
  }

  async remove(id: number) {
    const persona = await this.prisma.persona.findUnique({ where: { id } });
    if (!persona) {
      throw new NotFoundException(`Persona con id ${id} no encontrada`);
    }
    return this.prisma.persona.delete({ where: { id } });
  }
}
