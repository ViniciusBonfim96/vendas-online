import { Repository } from 'typeorm';
import { StateService } from '@/state/state.service';
import { StateEntity } from '@/state/entity/state.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { stateEntityMock } from '@/state/__mocks__/state.mock';

describe('StateService', () => {
  let service: StateService;
  let stateRepository: Repository<StateEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StateService,
        {
          provide: getRepositoryToken(StateEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([stateEntityMock]),
          },
        },
      ],
    }).compile();

    service = module.get<StateService>(StateService);
    stateRepository = module.get<Repository<StateEntity>>(
      getRepositoryToken(StateEntity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(stateRepository).toBeDefined();
  });

  it('should return list of states', async () => {
    const states = await service.getAllState();

    expect(stateRepository.find).toHaveBeenCalled();
    expect(states).toEqual([stateEntityMock]);
  });

  it('should return empty list when no states exist', async () => {
    jest.spyOn(stateRepository, 'find').mockResolvedValueOnce([]);

    const states = await service.getAllState();

    expect(stateRepository.find).toHaveBeenCalled();
    expect(states).toEqual([]);
  });

  it('should throw error when repository fails', async () => {
    jest.spyOn(stateRepository, 'find').mockRejectedValueOnce(new Error());

    await expect(service.getAllState()).rejects.toThrow();
  });
});
