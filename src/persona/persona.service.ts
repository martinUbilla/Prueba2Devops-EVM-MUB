import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { Persona } from './entities/persona.entity';

@Injectable()
export class PersonaService {
  private personas: Persona[] = [];
  private nextId = 1;

  create(createPersonaDto: CreatePersonaDto): Persona {
    const persona: Persona = {
      id: this.nextId++,
      ...createPersonaDto,
    };
    this.personas.push(persona);
    return persona;
  }

  findAll(): Persona[] {
    return this.personas;
  }

  remove(id: number): Persona {
    const index = this.personas.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Persona con id ${id} no encontrada`);
    }
    const [removed] = this.personas.splice(index, 1);
    return removed;
  }
}
