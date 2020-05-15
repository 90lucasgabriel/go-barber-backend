import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider.ts';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;
describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });
  it('should be able to update profile.', async () => {
    // Arrange
    const userData = {
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    };

    const user = await fakeUsersRepository.create(userData);

    const updateProfileData = {
      user_id: user.id,
      name: 'John Tre',
      email: 'johntre@email.com',
    };

    // Act
    const updatedUser = await updateProfileService.execute(updateProfileData);

    // Assert
    expect(updatedUser.name).toBe(updateProfileData.name);
    expect(updatedUser.email).toBe(updateProfileData.email);
  });

  it('should not be able to update profile with non-existing user.', async () => {
    // Arrange
    const userData = {
      user_id: 'non-existing-user-id',
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    };

    // Act and Assert
    await expect(
      updateProfileService.execute(userData),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change to another user email', async () => {
    // Arrange
    const userData = {
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    };
    await fakeUsersRepository.create(userData);

    const userData2 = {
      name: 'Test',
      email: 'testtesttesttesttesttesttest@email.com',
      password: '123456',
    };
    const user = await fakeUsersRepository.create(userData2);

    const updateProfileData = {
      user_id: user.id,
      name: 'John Tre',
      email: 'johndoe@email.com',
    };

    // Act and Assert
    await expect(
      updateProfileService.execute(updateProfileData),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update password ', async () => {
    // Arrange
    const userData = {
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    };

    const user = await fakeUsersRepository.create(userData);

    const updateProfileData = {
      user_id: user.id,
      name: 'John Doe',
      email: 'johndoe@email.com',
      old_password: '123456',
      password: '123123',
    };

    // Act
    const updatedUser = await updateProfileService.execute(updateProfileData);

    // Assert
    expect(updatedUser.name).toBe(updateProfileData.name);
    expect(updatedUser.email).toBe(updateProfileData.email);
  });

  it('should not be able to change to another user email', async () => {
    // Arrange
    const userData = {
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    };
    await fakeUsersRepository.create(userData);

    const userData2 = {
      name: 'Test',
      email: 'testtesttesttesttesttesttest@email.com',
      password: '123456',
    };
    const user = await fakeUsersRepository.create(userData2);

    const updateProfileData = {
      user_id: user.id,
      name: 'John Tre',
      email: 'johndoe@email.com',
    };

    // Act and Assert
    await expect(
      updateProfileService.execute(updateProfileData),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update password without old password', async () => {
    // Arrange
    const userData = {
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    };

    const user = await fakeUsersRepository.create(userData);

    const updateProfileData = {
      user_id: user.id,
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123123',
    };

    // Act and Assert
    await expect(
      updateProfileService.execute(updateProfileData),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update password with wrong old password', async () => {
    // Arrange
    const userData = {
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    };

    const user = await fakeUsersRepository.create(userData);

    const updateProfileData = {
      user_id: user.id,
      name: 'John Doe',
      email: 'johndoe@email.com',
      old_password: 'wrong-old-password',
      password: '123123',
    };

    // Act and Assert
    await expect(
      updateProfileService.execute(updateProfileData),
    ).rejects.toBeInstanceOf(AppError);
  });
});
