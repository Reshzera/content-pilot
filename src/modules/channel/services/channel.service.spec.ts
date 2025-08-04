import { ChannelService } from './channel.service';
import { ChannelRepository } from '../repositories/channel.repository';
import { Channel } from '../entities/channel.entity';
import { ReferenceVideo } from '../entities/reference-video.entity';
import {
  ChannelNotFoundError,
  ReferenceVideoNotFoundError,
} from '../../../errors/channel.errors';

describe('ChannelService', () => {
  let service: ChannelService;
  let repository: jest.Mocked<ChannelRepository>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findUserChannels: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      createReference: jest.fn(),
      findReferenceById: jest.fn(),
      updateReference: jest.fn(),
      deleteReference: jest.fn(),
    } as any;

    service = new ChannelService(repository);
  });

  describe('create', () => {
    it('should create channel', async () => {
      const channel = new Channel({ id: '1', name: 'c', ownerId: 'u' });
      repository.create.mockResolvedValue(channel);

      const result = await service.create('u', { name: 'c' });

      expect(repository.create).toHaveBeenCalled();
      expect(result).toEqual(Channel.EntityToApi(channel));
    });

    it('should create channel with references', async () => {
      const channel = new Channel({ id: '1', name: 'c', ownerId: 'u' });
      repository.create.mockResolvedValue(channel);
      const reference = new ReferenceVideo({
        id: 'r1',
        channelId: '1',
        referenceUrl: 'url',
      });
      repository.createReference.mockResolvedValue(reference);

      const result = await service.create('u', {
        name: 'c',
        references: [{ referenceUrl: 'url' }],
      });

      expect(repository.createReference).toHaveBeenCalled();
      expect(result!.references).toEqual([
        ReferenceVideo.EntityToApi(reference),
      ]);
    });
  });

  describe('findAll', () => {
    it('should return user channels', async () => {
      const channel = new Channel({ id: '1', name: 'c', ownerId: 'u' });
      repository.findUserChannels.mockResolvedValue([channel]);

      const result = await service.findAll('u');

      expect(result).toEqual([Channel.EntityToApi(channel)]);
    });
  });

  describe('update', () => {
    it('should update channel data', async () => {
      const channel = new Channel({ id: '1', name: 'Old', ownerId: 'u' });
      repository.findById.mockResolvedValue(channel);
      repository.update.mockResolvedValue(channel);

      const result = await service.update('u', '1', { name: 'New' });

      expect(channel.name).toBe('New');
      expect(repository.update).toHaveBeenCalledWith(channel);
      expect(result).toEqual(Channel.EntityToApi(channel));
    });

    it('should throw when channel not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(
        service.update('u', '1', { name: 'New' }),
      ).rejects.toBeInstanceOf(ChannelNotFoundError);
    });

    it('should create new reference on update', async () => {
      const channel = new Channel({
        id: '1',
        name: 'c',
        ownerId: 'u',
        references: [],
      });
      repository.findById.mockResolvedValue(channel);
      repository.update.mockResolvedValue(channel);
      const reference = new ReferenceVideo({
        id: 'r1',
        channelId: '1',
        referenceUrl: 'url',
      });
      repository.createReference.mockResolvedValue(reference);

      const result = await service.update('u', '1', {
        references: [{ referenceUrl: 'url' }],
      });

      expect(repository.createReference).toHaveBeenCalled();
      expect(result!.references).toEqual([
        ReferenceVideo.EntityToApi(reference),
      ]);
    });

    it('should update existing reference', async () => {
      const ref = new ReferenceVideo({
        id: 'r1',
        channelId: '1',
        referenceUrl: 'old',
      });
      const channel = new Channel({
        id: '1',
        name: 'c',
        ownerId: 'u',
        references: [ref],
      });
      repository.findById.mockResolvedValue(channel);
      repository.update.mockResolvedValue(channel);
      repository.findReferenceById.mockResolvedValue(ref);

      await service.update('u', '1', {
        references: [{ id: 'r1', referenceUrl: 'new' }],
      });

      expect(repository.updateReference).toHaveBeenCalled();
      expect(channel.references[0].referenceUrl).toBe('new');
    });

    it('should delete reference', async () => {
      const ref = new ReferenceVideo({
        id: 'r1',
        channelId: '1',
        referenceUrl: 'old',
      });
      const channel = new Channel({
        id: '1',
        name: 'c',
        ownerId: 'u',
        references: [ref],
      });
      repository.findById.mockResolvedValue(channel);
      repository.update.mockResolvedValue(channel);
      repository.findReferenceById.mockResolvedValue(ref);

      await service.update('u', '1', {
        references: [{ id: 'r1', delete: true }],
      });

      expect(repository.deleteReference).toHaveBeenCalledWith('r1');
      expect(channel.references).toHaveLength(0);
    });

    it('should throw when reference not found', async () => {
      const channel = new Channel({ id: '1', name: 'c', ownerId: 'u' });
      repository.findById.mockResolvedValue(channel);
      repository.update.mockResolvedValue(channel);
      repository.findReferenceById.mockResolvedValue(null);

      await expect(
        service.update('u', '1', {
          references: [{ id: 'r1', referenceUrl: 'new' }],
        }),
      ).rejects.toBeInstanceOf(ReferenceVideoNotFoundError);
    });
  });

  describe('delete', () => {
    it('should delete channel', async () => {
      const channel = new Channel({ id: '1', name: 'c', ownerId: 'u' });
      repository.findById.mockResolvedValue(channel);
      repository.delete.mockResolvedValue(channel);

      const result = await service.delete('u', '1');

      expect(repository.delete).toHaveBeenCalledWith('1');
      expect(result).toEqual(Channel.EntityToApi(channel));
    });
  });
});
