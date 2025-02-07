import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesService } from './favorites.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Favorite } from './favorites.schema';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

jest.mock('../pharmacy/pharmacy.schema', () => ({
  Pharmacy: {
    name: 'Pharmacy'
  }
}));

describe('FavoritesService', () => {
  let service: FavoritesService;
  let favoriteModel: Model<Favorite>;

  const mockFavoriteModel = {
    findOne: jest.fn(),
    find: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritesService,
        {
          provide: getModelToken(Favorite.name),
          useValue: mockFavoriteModel,
        },
      ],
    }).compile();

    service = module.get<FavoritesService>(FavoritesService);
    favoriteModel = module.get<Model<Favorite>>(getModelToken(Favorite.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  

  describe('getUserFavorites', () => {
    it('should return user favorites', async () => {
      const expectedFavorites = [{ userId: 'user1', pharmacies: ['pharmacy1'] }];

      favoriteModel.find = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(expectedFavorites),
      });

      const result = await service.getUserFavorites('user1');

      expect(result).toEqual(expectedFavorites);
      expect(favoriteModel.find).toHaveBeenCalledWith({ userId: 'user1' });
    });
  });

  describe('removeFavorite', () => {
    it('should remove a pharmacy from favorites', async () => {
      const updatedFavorite = {
        userId: 'user1',
        pharmacies: [],
      };

      favoriteModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedFavorite),
      });

      const result = await service.removeFavorite('favoriteId', 'pharmacy1');

      expect(result).toEqual(updatedFavorite);
      expect(favoriteModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'favoriteId',
        { $pull: { pharmacies: 'pharmacy1' } },
        { new: true }
      );
    });
  });

  describe('getAll', () => {
    it('should return all favorites with populated pharmacies', async () => {
      const populatedFavorites = [
        {
          userId: 'user1',
          pharmacies: [
            {
              name: 'Pharmacy 1',
              address: '123 Street',
              phoneNumber: '1234567890',
              openingHoursNight: '24/7',
            },
          ],
        },
      ];

      favoriteModel.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(populatedFavorites),
        }),
      });

      const result = await service.getAll();

      expect(result).toEqual(populatedFavorites);
    });

    it('should throw NotFoundException when no favorites found', async () => {
      favoriteModel.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      });

      await expect(service.getAll()).rejects.toThrow(NotFoundException);
    });
  });
});
