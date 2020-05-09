import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentsService';

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    // Prepare
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    // Execute
    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '12345678',
    });

    // Assert
    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('12345678');
  });

  it('should not be able to create a new appointment at same time', async () => {
    // Prepare
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
    const appointmentDate = new Date(2020, 4, 10, 11);
    const appointmentData = {
      date: appointmentDate,
      provider_id: '123456',
    };

    // Execute
    await createAppointment.execute(appointmentData);
    const duplicatedAppointment = createAppointment.execute(appointmentData);

    // Assert
    expect(duplicatedAppointment).rejects.toBeInstanceOf(AppError);
  });
});
