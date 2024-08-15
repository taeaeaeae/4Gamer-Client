export const dateFormat = (date: string = '0000-00-00 00:00') => {
  const dateTime = new Date(date);

  return `${dateTime.getFullYear()}-${
    dateTime.getMonth() + 1 < 10 ? `0${dateTime.getMonth() + 1}` : dateTime.getMonth() + 1
  }-${dateTime.getDate() < 10 ? `0${dateTime.getDate()}` : dateTime.getDate()} ${
    dateTime.getHours() < 10 ? `0${dateTime.getHours()}` : dateTime.getHours()
  }:${dateTime.getMinutes() < 10 ? `0${dateTime.getMinutes()}` : dateTime.getMinutes()}`;
};

function padZero(digit: number, number: number) {
  return String(number).padStart(digit, '0');
}
export function prettyTime(timestamp: string) {
  const time = new Date(timestamp);
  return `${padZero(4, time.getFullYear())}-${padZero(2, time.getMonth())}-${padZero(2, time.getDate())} ${padZero(2, time.getHours())}:${padZero(2, time.getMinutes())}`;
}
