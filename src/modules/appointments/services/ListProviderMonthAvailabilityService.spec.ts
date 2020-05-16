import { uuid } from 'uuidv4';
// import AppError from '@shared/errors/AppError';

import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailabilityService: ListProviderMonthAvailabilityService;
describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailabilityService = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the month availability fro provider.', async () => {
    // Arrange
    const provider_id = uuid();
    const appointmentData1 = {
      provider_id,
      date: new Date(2020, 3, 20, 8, 0, 0),
    };
    const appointmentData2 = {
      provider_id,
      date: new Date(2020, 4, 20, 8, 0, 0),
    };
    const appointmentData3 = {
      provider_id,
      date: new Date(2020, 4, 20, 10, 0, 0),
    };
    const appointmentData4 = {
      provider_id,
      date: new Date(2020, 4, 21, 8, 0, 0),
    };

    await fakeAppointmentsRepository.create(appointmentData1);
    await fakeAppointmentsRepository.create(appointmentData2);
    await fakeAppointmentsRepository.create(appointmentData3);
    await fakeAppointmentsRepository.create(appointmentData4);

    // Act
    const availability = await listProviderMonthAvailabilityService.execute({
      provider_id,
      month: 5,
      year: 2020,
    });

    // Assert
    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 19, availability: true },
        { day: 20, availability: false },
        { day: 21, availability: false },
        { day: 22, availability: true },
      ]),
    );
  });
});
