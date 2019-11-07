export const getDate = timestamp => new Date(timestamp * 1000);

export const MONTH_NAMES = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август',
    'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

export const MONTH_NAMES_GENITIVE = [
    'Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа',
    'Сентября', 'Октября', 'Ноября', 'Декабря',
];

export const getWhen = (timestamp) => {
    const date = getDate(timestamp);

    const time = `${date.getHours()}:${date.getMinutes()}`;

    return time;

    // const month = date.getMonth();
    // const monthDay = date.getDate();
    // const currentMonth = currentDate.getMonth();
    // const currentMonthDay = currentDate.getDate();
};
