import { FORMAT_DATE } from '../constants';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

const VN_TZ = 'Asia/Ho_Chi_Minh';

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
) => {
  if (!isValidDate(date)) {
    return null;
  }

  return dayjs.tz(date, VN_TZ).format(format);
};
