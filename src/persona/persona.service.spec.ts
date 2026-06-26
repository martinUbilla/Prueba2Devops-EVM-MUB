import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PersonaService } from './persona.service';

describe('PersonaService', () => {
  let service: PersonaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PersonaService],
    }).compile();

    service = module.get<PersonaService>(PersonaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a persona and return it with an id', () => {
      const dto = {
        nombre: 'Juan Pérez',
        rut: '12345678-9',
        fechaNacimiento: '1990-01-15',
        ciudad: 'Santiago',
      };
      const result = service.create(dto);
      expect(result).toMatchObject({ ...dto, id: 1 });
    });

    it('should assign incremental ids', () => {
      const dto = {
        nombre: 'Ana López',
        rut: '98765432-1',
        fechaNacimiento: '1995-05-20',
        ciudad: 'Valparaíso',
      };
      service.create(dto);
      const second = service.create(dto);
      expect(second.id).toBe(2);
    });

    it('should persist the persona in memory', () => {
      const dto = {
        nombre: 'Pedro Soto',
        rut: '11111111-1',
        fechaNacimiento: '1985-03-10',
        ciudad: 'Concepción',
      };
      service.create(dto);
      expect(service.findAll()).toHaveLength(1);
    });
  });

  describe('findAll', () => {
    it('should return an empty array when no personas exist', () => {
      expect(service.findAll()).toEqual([]);
    });

    it('should return all created personas', () => {
      service.create({
        nombre: 'María González',
        rut: '22222222-2',
        fechaNacimiento: '2000-07-04',
        ciudad: 'La Serena',
      });
      service.create({
        nombre: 'Carlos Muñoz',
        rut: '33333333-3',
        fechaNacimiento: '1978-11-30',
        ciudad: 'Antofagasta',
      });
      expect(service.findAll()).toHaveLength(2);
    });
  });

  describe('remove', () => {
    it('should remove a persona by id and return it', () => {
      const dto = {
        nombre: 'Lucía Ramírez',
        rut: '44444444-4',
        fechaNacimiento: '1992-09-25',
        ciudad: 'Temuco',
      };
      const created = service.create(dto);
      const removed = service.remove(created.id);
      expect(removed).toMatchObject(dto);
      expect(service.findAll()).toHaveLength(0);
    });

    it('should throw NotFoundException when id does not exist', () => {
      expect(() => service.remove(999)).toThrow(NotFoundException);
    });

    it('should only remove the persona with the given id', () => {
      const p1 = service.create({
        nombre: 'Roberto Vega',
        rut: '55555555-5',
        fechaNacimiento: '1988-06-12',
        ciudad: 'Iquique',
      });
      service.create({
        nombre: 'Sofía Castro',
        rut: '66666666-6',
        fechaNacimiento: '2003-02-28',
        ciudad: 'Rancagua',
      });
      service.remove(p1.id);
      expect(service.findAll()).toHaveLength(1);
      expect(service.findAll()[0].rut).toBe('66666666-6');
    });
  });
});
