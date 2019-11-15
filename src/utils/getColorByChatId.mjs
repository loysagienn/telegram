const chatBgColors = [
    '#FFCDD2',
    '#E1BEE7',
    '#C5CAE9',
    '#B3E5FC',
    '#B2DFDB',
    '#DCEDC8',
    '#FFF9C4',
    '#FFE0B2',
    '#FFCCBC',
    '#D7CCC8',
];

const getColorByChatId = (chatId) => {
    const part = Math.round(chatId / 37);
    const num = part - (Math.floor(part / 10) * 10);

    return chatBgColors[num];
};

export default getColorByChatId;
