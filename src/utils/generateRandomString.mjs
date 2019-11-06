const USED_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const generateRandomChar = () => USED_CHARS.charAt(Math.floor(Math.random() * USED_CHARS.length));

export default (length = 10) => {
    let str = '';

    for (let i = 0; i < length; i++) {
        str += generateRandomChar();
    }

    return str;
};
