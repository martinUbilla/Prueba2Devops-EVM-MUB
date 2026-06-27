import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PersonaService } from './persona.service';
import { PrismaService } from '../prisma/prisma.service';

const prismaMock = {
  persona: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
  },
};

describe('PersonaService', () => {
  let service: PersonaService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonaService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<PersonaService>(PersonaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a persona and return it', async () => {
      const dto = {
        nombre: 'Juan Pérez',
        rut: '12345678-9',
        fechaNacimiento: '1990-01-15',
        ciudad: 'Santiago',
        gustos: ['pizza', 'fútbol'],
      };
      const expected = { id: 1, ...dto };
      prismaMock.persona.create.mockResolvedValue(expected);

      const result = await service.create(dto);
      expect(result).toEqual(expected);
      expect(prismaMock.persona.create).toHaveBeenCalledWith({ data: dto });
    });

    it('should call prisma.persona.create with the dto data', async () => {
      const dto = {
        nombre: 'Ana López',
        rut: '98765432-1',
        fechaNacimiento: '1995-05-20',
        ciudad: 'Valparaíso',
        gustos: ['lectura'],
      };
      prismaMock.persona.create.mockResolvedValue({ id: 2, ...dto });

      await service.create(dto);
      expect(prismaMock.persona.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return an empty array when no personas exist', async () => {
      prismaMock.persona.findMany.mockResolvedValue([]);
      const result = await service.findAll();
      expect(result).toEqual([]);
    });

    it('should return all personas from the database', async () => {
      const personas = [
        { id: 1, nombre: 'María', rut: '22222222-2', fechaNacimiento: '2000-07-04', ciudad: 'La Serena', gustos: ['cocina'] },
        { id: 2, nombre: 'Carlos', rut: '33333333-3', fechaNacimiento: '1978-11-30', ciudad: 'Antofagasta', gustos: [] },
      ];
      prismaMock.persona.findMany.mockResolvedValue(personas);
      const result = await service.findAll();
      expect(result).toHaveLength(2);
      expect(result[0].gustos).toContain('cocina');
    });
  });

  describe('remove', () => {
    it('should remove a persona and return it', async () => {
      const persona = { id: 1, nombre: 'Pedro', rut: '11111111-1', fechaNacimiento: '1985-03-10', ciudad: 'Concepción', gustos: ['música'] };
      prismaMock.persona.findUnique.mockResolvedValue(persona);
      prismaMock.persona.delete.mockResolvedValue(persona);

      const result = await service.remove(1);
      expect(result).toEqual(persona);
      expect(prismaMock.persona.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException when persona does not exist', async () => {
      prismaMock.persona.findUnique.mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });

    it('should not call delete if persona is not found', async () => {
      prismaMock.persona.findUnique.mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      expect(prismaMock.persona.delete).not.toHaveBeenCalled();
    });
  });
});
