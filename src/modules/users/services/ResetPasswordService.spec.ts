import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPassword: ResetPasswordService;

describe('ResetPassword', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
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
    await resetPassword.execute({ ...resetPasswordData, token });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    // Assert
    expect(updatedUser?.password).toBe(resetPasswordData.password);
  });
});
