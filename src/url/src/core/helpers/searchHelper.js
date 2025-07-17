const getKeyWords = (string) => {
    return string.split(/=|\?|&/);
}

export default getKeyWords;