import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PersonaController } from './persona.controller';
import { PersonaService } from './persona.service';

const personaServiceMock = {
  create: jest.fn(),
  findAll: jest.fn(),
  remove: jest.fn(),
};

describe('PersonaController', () => {
  let controller: PersonaController;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonaController],
      providers: [{ provide: PersonaService, useValue: personaServiceMock }],
    }).compile();

    controller = module.get<PersonaController>(PersonaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /persona', () => {
    it('should call service.create and return the result', async () => {
      const dto = { nombre: 'Juan Pérez', rut: '12345678-9', fechaNacimiento: '1990-01-15', ciudad: 'Santiago', gustos: ['pizza'] };
      const expected = { id: 1, ...dto };
      personaServiceMock.create.mockResolvedValue(expected);

      const result = await controller.create(dto);
      expect(result).toEqual(expected);
      expect(personaServiceMock.create).toHaveBeenCalledWith(dto);
    });

    it('should store gustos in the created persona', async () => {
      const dto = { nombre: 'Ana López', rut: '98765432-1', fechaNacimiento: '1995-05-20', ciudad: 'Valparaíso', gustos: ['lectura', 'senderismo'] };
      personaServiceMock.create.mockResolvedValue({ id: 2, ...dto });

      const result = await controller.create(dto);
      expect(result.gustos).toHaveLength(2);
    });
  });

  describe('GET /persona', () => {
    it('should return empty array when no personas exist', async () => {
      personaServiceMock.findAll.mockResolvedValue([]);
      const result = await controller.findAll();
      expect(result).toEqual([]);
    });

    it('should return all personas with their gustos', async () => {
      const personas = [
        { id: 1, nombre: 'Pedro', rut: '11111111-1', fechaNacimiento: '1985-03-10', ciudad: 'Concepción', gustos: ['música'] },
        { id: 2, nombre: 'María', rut: '22222222-2', fechaNacimiento: '2000-07-04', ciudad: 'La Serena', gustos: ['viajes'] },
      ];
      personaServiceMock.findAll.mockResolvedValue(personas);

      const result = await controller.findAll();
      expect(result).toHaveLength(2);
      expect(result[0].gustos).toContain('música');
    });
  });

  describe('DELETE /persona/:id', () => {
    it('should call service.remove and return the deleted persona', async () => {
      const persona = { id: 1, nombre: 'Carlos', rut: '33333333-3', fechaNacimiento: '1978-11-30', ciudad: 'Antofagasta', gustos: ['fotografía'] };
      personaServiceMock.remove.mockResolvedValue(persona);

      const result = await controller.remove('1');
      expect(result).toEqual(persona);
      expect(personaServiceMock.remove).toHaveBeenCalledWith(1);
    });

    it('should propagate NotFoundException from service', async () => {
      personaServiceMock.remove.mockRejectedValue(new NotFoundException());
      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});
