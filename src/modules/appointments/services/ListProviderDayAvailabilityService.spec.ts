import { uuid } from 'uuidv4';
// import AppError from '@shared/errors/AppError';

import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailabilityService: ListProviderDayAvailabilityService;
describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvailabilityService = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the day availability fro provider.', async () => {
    // Arrange
    const provider_id = uuid();
    await fakeAppointmentsRepository.create({
      provider_id,
      date: new Date(2020, 4, 20, 8, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id,
      date: new Date(2020, 4, 20, 10, 0, 0),
    });

    // Act
    const availability = await listProviderDayAvailabilityService.execute({
      provider_id,
      day: 20,
      month: 5,
      year: 2020,
    });

    // Assert
    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: true },
        { hour: 10, available: false },
        { hour: 11, available: true },
      ]),
    );
  });
});
