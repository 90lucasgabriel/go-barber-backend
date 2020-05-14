import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';
import AuthenticateUserService from './AuthenticateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;
let authenticateUserService: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate', async () => {
    // Arrange
    const userData = {
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    };
    const authData = {
      email: 'johndoe@email.com',
      password: '123456',
    };

    // Act
    const user = await createUserService.execute(userData);
    const response = await authenticateUserService.execute(authData);

    // Assert
    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with non existing user', async () => {
    // Arrange
    const userData = {
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    };

    // Act
    const response = authenticateUserService.execute(userData);

    // Assert
    expect(response).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    // Arrange
    const userData = {
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    };
    const authData = {
      email: 'johndoe@email.com',
      password: 'wrong-password',
    };

    // Act
    await createUserService.execute(userData);
    const response = authenticateUserService.execute(authData);

    // Assert
    expect(response).rejects.toBeInstanceOf(AppError);
  });
});
