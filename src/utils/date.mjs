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
    const today = new Date();

    const timeDiff = today.getTime() - date.getTime();

    const halfDay = 12 * 60 * 60 * 1000;

    if (timeDiff < halfDay || (timeDiff < halfDay * 2 && date.getDay() === today.getDay())) {
        const hours = date.getHours();
        const minutes = date.getMinutes();

        const when = `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`;

        return {
            when,
            type: 'time',
        };
    }

    const month = date.getMonth() + 1;

    const when = `${date.getDate()}.${month < 10 ? `0${month}` : month}.${date.getFullYear() % 2000}`;

    return {
        when,
        type: 'date',
    };

    // const month = date.getMonth();
    // const monthDay = date.getDate();
    // const currentMonth = currentDate.getMonth();
    // const currentMonthDay = currentDate.getDate();
};
