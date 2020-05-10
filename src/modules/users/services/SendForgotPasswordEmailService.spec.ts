import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it('should be able to recover the password using the email', async () => {
    // Arrange
    const userData = {
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    };
    const sendForgotPasswordEmailData = {
      email: 'johndoe@email.com',
    };

    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    // Act
    await fakeUsersRepository.create(userData);
    await sendForgotPasswordEmail.execute(sendForgotPasswordEmailData);

    // Assert
    expect(sendMail).toBeCalled();
  });

  it('should not be able to recover a non-exixsting user password', async () => {
    // Arrange
    const sendForgotPasswordEmailData = {
      email: 'johndoe@email.com',
    };

    // Act
    const sendMail = sendForgotPasswordEmail.execute(
      sendForgotPasswordEmailData,
    );

    // Assert
    expect(sendMail).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    // Arrange
    const userData = {
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    };
    const sendForgotPasswordEmailData = {
      email: 'johndoe@email.com',
    };

    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    // Act
    const user = await fakeUsersRepository.create(userData);
    await sendForgotPasswordEmail.execute(sendForgotPasswordEmailData);

    // Assert
    expect(generateToken).toBeCalledWith(user.id);
  });
});
