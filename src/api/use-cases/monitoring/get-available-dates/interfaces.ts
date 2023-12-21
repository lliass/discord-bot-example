import { IUseCase } from '../../../common/interfaces/use-case.interface';
import { IGetAvailableDatesResponseDTO } from './get-available-dates.dto';

interface IGetAvailableDatesUseCase extends IUseCase {
  execute(): Promise<IGetAvailableDatesResponseDTO>;
}

const GET_AVAILABLE_DATES_USE_CASE_TYPE = Symbol.for(
  'IGetAvailableDatesUseCase',
);

export { IGetAvailableDatesUseCase, GET_AVAILABLE_DATES_USE_CASE_TYPE };
