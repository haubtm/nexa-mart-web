import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { FORMAT_DATE } from '../constants';
import 'dayjs/locale/vi';

dayjs.extend(utc);
dayjs.extend(timezone);

export const isValidDate = (
  date: string | number | Date | null | undefined,
) => {
  if (!date || !dayjs(date).isValid()) {
    return false;
  }

  return true;
};

export const formatDate = (
  date: string | number | Date | null | undefined,
  format: string = FORMAT_DATE,
  gmtOffset: number = 7,
) => {
  if (!isValidDate(date)) {
    return null;
  }

  const targetTz = `Etc/GMT${gmtOffset <= 0 ? '+' + Math.abs(gmtOffset) : '-' + gmtOffset}`;

  return dayjs.utc(date).tz(targetTz).format(format);
};
