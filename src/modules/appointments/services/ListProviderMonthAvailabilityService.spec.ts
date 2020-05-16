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
    for (let i = 8; i <= 17; i++) {
      await fakeAppointmentsRepository.create({
        provider_id,
        date: new Date(2020, 4, 20, i, 0, 0),
      });
    }

    await fakeAppointmentsRepository.create({
      provider_id,
      date: new Date(2020, 3, 19, 8, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id,
      date: new Date(2020, 4, 21, 8, 0, 0),
    });

    // Act
    const availability = await listProviderMonthAvailabilityService.execute({
      provider_id,
      month: 5,
      year: 2020,
    });

    // Assert
    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: true },
        { day: 22, available: true },
      ]),
    );
  });
});
