import { Test, TestingModule } from '@nestjs/testing';
import { StateController } from '@/state/state.controller';
import { StateService } from '@/state/state.service';
import { stateEntityMock } from '@/state/__mocks__/state.mock';

describe('StateController', () => {
  let controller: StateController;
  let stateService: StateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StateController],
      providers: [
        {
          provide: StateService,
          useValue: {
            getAllState: jest.fn().mockResolvedValue([stateEntityMock]),
          },
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
  });

  it('should return all states', async () => {
    const result = await controller.getAllState();

    expect(stateService.getAllState).toHaveBeenCalled();
    expect(result).toEqual([stateEntityMock]);
  });

  it('should throw error when service fails', async () => {
    jest
      .spyOn(stateService, 'getAllState')
      .mockRejectedValueOnce(new Error('DB error'));

    await expect(controller.getAllState()).rejects.toThrow('DB error');
  });
});
