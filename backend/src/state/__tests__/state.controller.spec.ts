import { StateController } from '@/state/state.controller';
import { StateService } from '@/state/state.service';
import { stateEntityMock } from '../__mocks__/state.mock';
import { Test, TestingModule } from '@nestjs/testing';

describe('StateController', () => {
  let controller: StateController;
  let stateService: StateService;

  const mockUserService = () => ({
    getAllState: jest.fn().mockResolvedValue([stateEntityMock]),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StateController],
      providers: [
        {
          provide: StateService,
          useValue: mockUserService(),
        },
      ],
    }).compile();

    controller = module.get<StateController>(StateController);
    stateService = module.get<StateService>(StateService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(stateService).toBeDefined();
  });

  it('should return all state', async () => {
    const result = await controller.getAllState();

    expect(stateService.getAllState).toHaveBeenCalled();
    expect(result).toEqual([stateEntityMock]);
  });

  it('should return error in exception', async () => {
    jest.spyOn(stateService, 'getAllState').mockRejectedValueOnce(new Error());

    await expect(controller.getAllState()).rejects.toThrow();
  });
});
