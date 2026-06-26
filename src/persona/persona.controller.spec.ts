import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PersonaController } from './persona.controller';
import { PersonaService } from './persona.service';

describe('PersonaController', () => {
  let controller: PersonaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonaController],
      providers: [PersonaService],
    }).compile();

    controller = module.get<PersonaController>(PersonaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /persona', () => {
    it('should create and return a new persona', () => {
      const dto = {
        nombre: 'Juan Pérez',
        rut: '12345678-9',
        fechaNacimiento: '1990-01-15',
        ciudad: 'Santiago',
      };
      const result = controller.create(dto);
      expect(result).toMatchObject({ ...dto, id: 1 });
    });

    it('should return the persona with an assigned id', () => {
      const dto = {
        nombre: 'Ana López',
        rut: '98765432-1',
        fechaNacimiento: '1995-05-20',
        ciudad: 'Valparaíso',
      };
      const result = controller.create(dto);
      expect(result.id).toBeDefined();
      expect(typeof result.id).toBe('number');
    });
  });

  describe('GET /persona', () => {
    it('should return empty array when no personas exist', () => {
      expect(controller.findAll()).toEqual([]);
    });

    it('should return all personas after creation', () => {
      controller.create({
        nombre: 'Pedro Soto',
        rut: '11111111-1',
        fechaNacimiento: '1985-03-10',
        ciudad: 'Concepción',
      });
      controller.create({
        nombre: 'María González',
        rut: '22222222-2',
        fechaNacimiento: '2000-07-04',
        ciudad: 'La Serena',
      });
      expect(controller.findAll()).toHaveLength(2);
    });
  });

  describe('DELETE /persona/:id', () => {
    it('should delete a persona and return it', () => {
      const dto = {
        nombre: 'Carlos Muñoz',
        rut: '33333333-3',
        fechaNacimiento: '1978-11-30',
        ciudad: 'Antofagasta',
      };
      const created = controller.create(dto);
      const removed = controller.remove(String(created.id));
      expect(removed).toMatchObject(dto);
      expect(controller.findAll()).toHaveLength(0);
    });

    it('should throw NotFoundException for non-existent id', () => {
      expect(() => controller.remove('999')).toThrow(NotFoundException);
    });
  });
});
