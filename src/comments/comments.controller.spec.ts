import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

describe('CommentsController', () => {
  let controller: CommentsController;
  let service: CommentsService;

  const mockComment = {
    _id: 'comment1',
    userId: 'user1',
    body: 'This is a comment',
  };

  const mockCommentsService = {
    getAll: jest.fn().mockResolvedValue([mockComment]),
    create: jest.fn().mockImplementation((dto: CreateCommentDto) =>
      Promise.resolve({ ...dto, _id: 'generatedId' }),
    ),
    update: jest.fn().mockImplementation((dto: UpdateCommentDto, id: string) =>
      Promise.resolve({ ...mockComment, ...dto, _id: id }),
    ),
    delete: jest.fn().mockResolvedValue(mockComment),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [{ provide: CommentsService, useValue: mockCommentsService }],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return all comments', async () => {
      const result = await controller.getAll();
      expect(service.getAll).toHaveBeenCalled();
      expect(result).toEqual([mockComment]);
    });
  });

  describe('create', () => {
    it('should create a new comment', async () => {
      const createCommentDto: CreateCommentDto = { userId: 'user1', body: 'Nice post!' };

      const result = await controller.create(createCommentDto);

      expect(service.create).toHaveBeenCalledWith(createCommentDto);
      expect(result).toEqual({ ...createCommentDto, _id: 'generatedId' });
    });
  });

  describe('update', () => {
    it('should update a comment', async () => {
      const updateCommentDto: UpdateCommentDto = { body: 'Updated comment' };

      const result = await controller.update('comment1', updateCommentDto);

      expect(service.update).toHaveBeenCalledWith(updateCommentDto, 'comment1');
      expect(result).toEqual({ ...mockComment, ...updateCommentDto, _id: 'comment1' });
    });
  });

  describe('delete', () => {
    it('should delete a comment', async () => {
      const result = await controller.delete('comment1');

      expect(service.delete).toHaveBeenCalledWith('comment1');
      expect(result).toEqual(mockComment);
    });
  });
});
