import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatarService: UpdateUserAvatarService;
describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });
  it('should be able to update avatar', async () => {
    // Arrange
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
    await updateUserAvatarService.execute(updateUserAvatarData);

    // Assert
    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should not be able to update avatar from non existing user', async () => {
    // Arrange
    const updateUserAvatarData = {
      user_id: 'non-existing-user',
      avatarFilename: 'avatar.jpg',
    };

    // Act
    const nonExistingUser = updateUserAvatarService.execute(
      updateUserAvatarData,
    );

    // Assert
    expect(nonExistingUser).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when update new one', async () => {
    // Arrange
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');
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
    await updateUserAvatarService.execute(updateUserAvatarData);
    await updateUserAvatarService.execute(updateUserAvatarData2);

    // Assert
    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    expect(user.avatar).toBe('avatar2.jpg');
  });
});
