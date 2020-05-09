import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
  it('should be able to update avatar', async () => {
    // Arrange
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();
    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const userData = {
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    };

    const user = await fakeUsersRepository.create(userData);

    const updateUserAvatarData = {
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    };

    // Act
    await updateUserAvatar.execute(updateUserAvatarData);

    // Assert
    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should not be able to update avatar from non existing user', async () => {
    // Arrange
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();
    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const updateUserAvatarData = {
      user_id: 'non-existing-user',
      avatarFilename: 'avatar.jpg',
    };

    // Act
    const nonExistingUser = updateUserAvatar.execute(updateUserAvatarData);

    // Assert
    expect(nonExistingUser).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when update new one', async () => {
    // Arrange
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');
    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const userData = {
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    };

    const user = await fakeUsersRepository.create(userData);

    const updateUserAvatarData = {
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    };

    const updateUserAvatarData2 = {
      user_id: user.id,
      avatarFilename: 'avatar2.jpg',
    };

    // Act
    await updateUserAvatar.execute(updateUserAvatarData);
    await updateUserAvatar.execute(updateUserAvatarData2);

    // Assert
    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    expect(user.avatar).toBe('avatar2.jpg');
  });
});
