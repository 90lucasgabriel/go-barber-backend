import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointmentService: CreateAppointmentService;
describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    // Prepare
    const appointmentData = {
      date: new Date(),
      provider_id: '12345678',
    };

    // Execute
    const appointment = await createAppointmentService.execute(appointmentData);

    // Assert
    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('12345678');
  });

  it('should not be able to create a new appointment at same time', async () => {
    // Arrange
    const appointmentDate = new Date(2020, 4, 10, 11);
    const appointmentData = {
      date: appointmentDate,
      provider_id: '123456',
    };

    // Act
    await createAppointmentService.execute(appointmentData);
    const duplicatedAppointment = createAppointmentService.execute(
      appointmentData,
    );

    // Assert
    expect(duplicatedAppointment).rejects.toBeInstanceOf(AppError);
  });
});
