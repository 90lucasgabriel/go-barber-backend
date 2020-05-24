import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProvidersService: ListProvidersService;
describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProvidersService = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to list providers.', async () => {
    // Arrange
    const userData1 = {
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    };
    const userData2 = {
      name: 'John Tre',
      email: 'johntre@email.com',
      password: '123456',
    };
    const loggedUserData = {
      name: 'John Qua',
      email: 'johnqua@email.com',
      password: '123456',
    };

    const user1 = await fakeUsersRepository.create(userData1);
    const user2 = await fakeUsersRepository.create(userData2);
    const loggedUser = await fakeUsersRepository.create(loggedUserData);

    // Act
    const providers = await listProvidersService.execute({
      user_id: loggedUser.id,
    });

    // Assert
    expect(providers).toEqual([user1, user2]);
  });
});
