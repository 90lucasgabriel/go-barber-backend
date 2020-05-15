import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfileService: ShowProfileService;
describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfileService = new ShowProfileService(fakeUsersRepository);
  });
  it('should be able to show profile ', async () => {
    // Arrange
    const userData = {
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    };

    const user = await fakeUsersRepository.create(userData);

    const showProfileData = {
      user_id: user.id,
      name: userData.name,
      email: userData.email,
    };

    // Act
    const showUser = await showProfileService.execute({
      user_id: showProfileData.user_id,
    });

    // Assert
    expect(showUser.name).toBe(showProfileData.name);
    expect(showUser.email).toBe(showProfileData.email);
  });

  it('should not be able to show a non-existing user.', async () => {
    // Arrange
    const showProfileData = {
      user_id: 'non-existing-user-id',
    };

    // Act and Assert
    await expect(
      showProfileService.execute(showProfileData),
    ).rejects.toBeInstanceOf(AppError);
  });
});
