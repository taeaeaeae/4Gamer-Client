export const dateFormat = (date: string = '0000-00-00 00:00') => {
  const dateTime = new Date(date);

  return `${dateTime.getFullYear()}-${
    dateTime.getMonth() + 1 < 10 ? `0${dateTime.getMonth() + 1}` : dateTime.getMonth() + 1
  }-${dateTime.getDate() < 10 ? `0${dateTime.getDate()}` : dateTime.getDate()} ${
    dateTime.getHours() < 10 ? `0${dateTime.getHours()}` : dateTime.getHours()
  }:${dateTime.getMinutes() < 10 ? `0${dateTime.getMinutes()}` : dateTime.getMinutes()}`;
};
