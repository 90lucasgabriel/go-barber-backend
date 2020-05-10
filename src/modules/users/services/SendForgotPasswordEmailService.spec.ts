import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

describe('SendForgotPasswordEmail', () => {
  it('should be able to recover the password using the email', async () => {
    // Arrange
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeMailProvider = new FakeMailProvider();
    const sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
    );
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
    const user = await sendForgotPasswordEmail.execute(
      sendForgotPasswordEmailData,
    );

    // Assert
    expect(sendMail).toBeCalled();
  });

  // it('should not be able to create a new user with the same email from another', async () => {
  //   // Arrange
  //   const fakeUsersRepository = new FakeUsersRepository();
  //   const fakeHashProvider = new FakeHashProvider();
  //   const sendForgotPasswordEmail = new SendForgotPasswordEmailService(
  //     fakeUsersRepository,
  //     fakeHashProvider,
  //   );
  //   const userData = {
  //     name: 'John Doe',
  //     email: 'johndoe@email.com',
  //     password: '123456',
  //   };

  //   // Act
  //   await sendForgotPasswordEmail.execute(userData);
  //   const duplicatedUser = sendForgotPasswordEmail.execute(userData);

  //   // Assert
  //   expect(duplicatedUser).rejects.toBeInstanceOf(AppError);
  // });
});
