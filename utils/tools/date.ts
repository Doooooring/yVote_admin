export const getDotDateForm = (date: Date) => {
  if (typeof date === 'string') date = new Date(date);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(
    date.getDate(),
  ).padStart(2, '0')}`;
};

export const getToday = () => {
  return new Date();
};

export const getDateDiff = (baseDate: Date, targetDate: Date) => {
  const date1 = new Date(baseDate);
  const date2 = new Date(targetDate);

  const diff = date1.getTime() - date2.getTime();

  const dateDiff = Math.floor(Math.abs(diff) / (24 * 60 * 60 * 1000));
  return dateDiff;
};

export const getStandardDateForm = (date: Date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

export const getKoreanTimeDifference = (baseDate: Date, targetDate: Date) => {
  const date1 = new Date(baseDate);
  const date2 = new Date(targetDate);

  const diff = date1.getTime() - date2.getTime();

  const subfix = diff > 0 ? '전' : '뒤';
  const dateDiff = getDateDiff(baseDate, targetDate);

  let prefix: string = '';

  if (dateDiff == 0) {
    return '오늘';
  } else if (dateDiff < 7) {
    switch (dateDiff) {
      case 1:
        prefix = '하루';
        break;
      case 2:
        prefix = '이틀';
        break;
      default:
        prefix = `${dateDiff}일`;
        break;
    }
  } else if (dateDiff < 35) {
    const weekDiff = Math.floor(dateDiff / 7);
    prefix = `${weekDiff}주`;
  } else if (dateDiff < 365) {
    const monthDiff = Math.floor(dateDiff / 30);
    prefix = `${monthDiff}개월`;
  } else {
    const yearDiff = Math.floor(dateDiff / 365);
    prefix = `${yearDiff}년`;
  }
  return prefix + ' ' + subfix;
};

export const getTimeDiffBeforeToday = (date: Date) => {
  return getKoreanTimeDifference(new Date(), date);
};

export const getDateHidingCurrentYear = (d: Date) => {
  const date = new Date(d);

  const currentYear = new Date().getFullYear();
  const year = date.getFullYear();

  return date.toLocaleDateString('en-US', {
    year: year !== currentYear ? '2-digit' : undefined,
    month: '2-digit',
    day: '2-digit',
  });
};

export const useKoreanDateFormat = (date: Date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${year}년 ${month}월 ${day}일`;
};

export const milliSecondsToHHMMSS = (mil: number) => {
  const totalSeconds = Math.floor(mil / 1000);
  const second = totalSeconds % 60;
  const totalMinutes = Math.floor((totalSeconds - second) / 60);
  const minutes = totalMinutes % 60;

  const totalHours = Math.floor((totalMinutes - minutes) / 60);

  return { hour: totalHours, minute, second };
};
