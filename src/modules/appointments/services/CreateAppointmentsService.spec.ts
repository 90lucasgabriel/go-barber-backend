import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeNotificationsRepository from '@modules/notifications/repositories/FakeNotificationsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let createAppointmentService: CreateAppointmentService;
describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    // Prepare
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });
    const appointmentDate = new Date(2020, 4, 10, 13);
    const appointmentData = {
      date: appointmentDate,
      user_id: 'user-id',
      provider_id: 'provider-id',
    };

    // Execute
    const appointment = await createAppointmentService.execute(appointmentData);

    // Assert
    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('provider-id');
  });

  it('should not be able to create a new appointment at same time', async () => {
    // Arrange
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appointmentDate = new Date(2020, 4, 10, 13);
    const appointmentData = {
      date: appointmentDate,
      user_id: 'user-id',
      provider_id: 'provider-id',
    };

    await createAppointmentService.execute(appointmentData);
    // Act and Assert
    await expect(
      createAppointmentService.execute(appointmentData),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on a past date.', async () => {
    // Arrange
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appointmentDate = new Date(2020, 4, 10, 11);
    const appointmentData = {
      date: appointmentDate,
      user_id: 'user-id',
      provider_id: 'provider-id',
    };

    // Act and Assert
    await expect(
      createAppointmentService.execute(appointmentData),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with same user as provider.', async () => {
    // Arrange
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appointmentDate = new Date(2020, 4, 10, 13);
    const appointmentData = {
      date: appointmentDate,
      user_id: 'user-id',
      provider_id: 'user-id',
    };

    // Act and Assert
    await expect(
      createAppointmentService.execute(appointmentData),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before 8am and after 5pm.', async () => {
    // Arrange
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appointmentDataBefore = {
      date: new Date(2020, 4, 11, 7),
      user_id: 'user-id',
      provider_id: 'provider-id',
    };
    const appointmentDataAfter = {
      date: new Date(2020, 4, 11, 18),
      user_id: 'user-id',
      provider_id: 'provider-id',
    };

    // Act and Assert
    await expect(
      createAppointmentService.execute(appointmentDataBefore),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointmentService.execute(appointmentDataAfter),
    ).rejects.toBeInstanceOf(AppError);
  });
});
