import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

describe('FavoritesController', () => {
  let controller: FavoritesController;
  let service: FavoritesService;

  const mockFavoritesService = {
    addFavorite: jest.fn(),
    getUserFavorites: jest.fn(),
    removeFavorite: jest.fn(),
    getAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoritesController],
      providers: [
        {
          provide: FavoritesService,
          useValue: mockFavoritesService,
        },
      ],
    }).compile();

    controller = module.get<FavoritesController>(FavoritesController);
    service = module.get<FavoritesService>(FavoritesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addFavorite', () => {
    it('should call service.addFavorite and return the result', async () => {
      const dto: CreateFavoriteDto = { userId: 'user1', pharmacyId: 'pharmacy1' };
      const expectedResult = { userId: 'user1', pharmacies: ['pharmacy1'] };

      mockFavoritesService.addFavorite.mockResolvedValue(expectedResult);

      const result = await controller.addFavorite(dto);

      expect(service.addFavorite).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getUserFavorites', () => {
    it('should call service.getUserFavorites and return the result', async () => {
      const userId = 'user1';
      const expectedFavorites = [{ pharmacyId: 'pharmacy1' }, { pharmacyId: 'pharmacy2' }];

      mockFavoritesService.getUserFavorites.mockResolvedValue(expectedFavorites);

      const result = await controller.getUserFavorites(userId);

      expect(service.getUserFavorites).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedFavorites);
    });
  });

  describe('removeFavorite', () => {
    it('should call service.removeFavorite and return the result', async () => {
      const favoriteId = 'fav1';
      const pharmacyId = 'pharmacy1';
      const expectedResult = { success: true };

      mockFavoritesService.removeFavorite.mockResolvedValue(expectedResult);

      const result = await controller.removeFavorite(favoriteId, pharmacyId);

      expect(service.removeFavorite).toHaveBeenCalledWith(favoriteId, pharmacyId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getAll', () => {
    it('should call service.getAll and return the result', async () => {
      const expectedFavorites = [
        { userId: 'user1', pharmacies: ['pharmacy1'] },
        { userId: 'user2', pharmacies: ['pharmacy2'] },
      ];

      mockFavoritesService.getAll.mockResolvedValue(expectedFavorites);

      const result = await controller.getAll();

      expect(service.getAll).toHaveBeenCalled();
      expect(result).toEqual(expectedFavorites);
    });
  });
});
