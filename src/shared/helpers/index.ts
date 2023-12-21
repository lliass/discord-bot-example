import container from '../../config/inversify.config';
import DateHelper from './date.helper';

const dateHelper = container.get<DateHelper>(DateHelper);

export { dateHelper };
