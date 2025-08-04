import { UserService } from './user.service';
import { UserRepository } from '../repositories/user.repository';
import { UserExistsError, UserNotFoundError } from '../../../errors/user.erros';
import { User } from '../entities/user.entity';


describe('UserService', () => {
  let service: UserService;
  let repository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    repository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
    } as any;

    service = new UserService(repository);
  });

  describe('create', () => {
    it('should create user when email not exists', async () => {
      repository.findByEmail.mockResolvedValue(null);
      const user = new User({
        email: 'a@test.com',
        password: '123',
        name: 'A',
      });
      repository.create.mockResolvedValue(user);

      const result = await service.create({
        email: 'a@test.com',
        password: '123',
        name: 'A',
      });

      expect(repository.create).toHaveBeenCalled();
      expect(result).toEqual(User.EntityToApi(user));
    });

    it('should throw when email already exists', async () => {
      const existing = new User({ email: 'a@test.com', password: '123' });
      repository.findByEmail.mockResolvedValue(existing);

      await expect(
        service.create({ email: 'a@test.com', password: '123', name: 'A' }),
      ).rejects.toBeInstanceOf(UserExistsError);
    });
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      const user = new User({ id: '1', email: 'a@test.com', password: '123' });
      repository.findById.mockResolvedValue(user);

      const result = await service.findById('1');

      expect(result).toEqual(User.EntityToApi(user));
    });

    it('should throw when user not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findById('1')).rejects.toBeInstanceOf(
        UserNotFoundError,
      );
    });
  });

  describe('update', () => {
    it('should update user data', async () => {
      const user = new User({
        id: '1',
        email: 'old@test.com',
        password: '123',
        name: 'Old',
      });
      repository.findById.mockResolvedValue(user);
      repository.update.mockResolvedValue(user);

      const result = await service.update('1', {
        name: 'New',
        email: 'old@test.com',
      });

      expect(user.name).toBe('New');
      expect(repository.update).toHaveBeenCalledWith(user);
      expect(result).toEqual(User.EntityToApi(user));
    });

    it('should throw when user not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(
        service.update('1', { name: 'New' }),
      ).rejects.toBeInstanceOf(UserNotFoundError);
    });

    it('should throw when new email already exists', async () => {
      const user = new User({ id: '1', email: 'old@test.com', password: '123' });
      repository.findById.mockResolvedValue(user);
      repository.findByEmail.mockResolvedValueOnce(
        new User({ id: '2', email: 'new@test.com', password: '123' }),
      );

      await expect(
        service.update('1', { email: 'new@test.com' }),
      ).rejects.toBeInstanceOf(UserExistsError);
    });
  });
});

