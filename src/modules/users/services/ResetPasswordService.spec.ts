import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPasswordService: ResetPasswordService;

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();
    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });

  it('should be able to reset the password', async () => {
    // Arrange
    const userData = {
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    };
    const resetPasswordData = {
      password: '123123',
    };

    // Act
    const user = await fakeUsersRepository.create(userData);
    const { token } = await fakeUserTokensRepository.generate(user.id);
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');
    await resetPasswordService.execute({ ...resetPasswordData, token });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    // Assert
    expect(generateHash).toHaveBeenCalledWith(resetPasswordData.password);
    expect(updatedUser?.password).toBe(resetPasswordData.password);
  });

  it('should not be able to reset the password with non-existing token.', async () => {
    // Arrange
    const resetPasswordData = {
      token: 'non-existing-token',
      password: '123123',
    };

    // Act
    const resetPassword = resetPasswordService.execute(resetPasswordData);

    // Assert
    await expect(resetPassword).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password with non-existing user.', async () => {
    // Arrange
    const userData = {
      id: 'non-existing-user',
    };
    const resetPasswordData = {
      password: '123123',
    };

    // Act
    const { token } = await fakeUserTokensRepository.generate(userData.id);
    const resetPassword = resetPasswordService.execute({
      ...resetPasswordData,
      token,
    });

    // Assert
    await expect(resetPassword).rejects.toBeInstanceOf(AppError);
  });

  it('should not be to reset the password if passed more than 2 hours.', async () => {
    // Arrange
    const userData = {
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    };
    const resetPasswordData = {
      password: '123123',
    };

    // Act
    const user = await fakeUsersRepository.create(userData);
    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    const resetPassword = resetPasswordService.execute({
      ...resetPasswordData,
      token,
    });

    // Assert
    await expect(resetPassword).rejects.toBeInstanceOf(AppError);
  });
});
