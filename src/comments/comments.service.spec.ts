import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { getModelToken } from '@nestjs/mongoose';
import { Comment } from './comments.schema';
import { Model } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

const mockComment = {
  _id: 'comment1',
  userId: 'user1',
  body: 'This is a comment',
  save: jest.fn().mockResolvedValue(this),
};

const mockCommentModel = {
  find: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([mockComment]) }),
  findByIdAndUpdate: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockComment) }),
  findByIdAndDelete: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockComment) }),
  create: jest.fn().mockImplementation((dto) => ({
    ...dto,
    _id: 'generatedId',
    save: jest.fn().mockResolvedValue({ ...dto, _id: 'generatedId' }),
  })),
};

describe('CommentsService', () => {
  let service: CommentsService;
  let model: Model<Comment>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: getModelToken(Comment.name),
          useValue: mockCommentModel,
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    model = module.get<Model<Comment>>(getModelToken(Comment.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return all comments', async () => {
      const result = await service.getAll();
      expect(model.find).toHaveBeenCalled();
      expect(result).toEqual([mockComment]);
    });
  });


  describe('update', () => {
    it('should update a comment', async () => {
      const updateCommentDto: UpdateCommentDto = { body: 'Updated comment' };

      const result = await service.update(updateCommentDto, 'comment1');

      expect(result).toEqual(mockComment);
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith('comment1', updateCommentDto);
    });
  });


});
