/**
 * Created by Shir Levinger on 12/5/18.
 */

function xor_one_letter(asciiChar, char2) {
    return asciiChar ^ char2;
}

function XOR_A_WORD(word1, word2) {
    return word1.map((charA, index) => {
        let charB = word2.charAt(index).charCodeAt(0);
        return xor_one_letter(charA, charB);
    })
}

/**
 * @return {string}
 */
function ASCII_TO_WORD(stringToPrint) {
    let arrayStr = [];
    for (let i = 0; i < stringToPrint.length; i++) {
        let asciiCode = String.fromCharCode(stringToPrint[i]);
        arrayStr.push(asciiCode)
    }
    return arrayStr.join('')
}

/**
 * @return {string}
 */
function XOR_DECRYPT(encryptedText, key) {
    let keyLength = key.length;
    let result = [];
    for (let i = 0; i < encryptedText.length; i += keyLength) {
        if (i + keyLength > encryptedText.length) {
            keyLength = encryptedText.length - i;
            key = key.substr(0, keyLength);
        }
        let stringToCheck = encryptedText.slice(i, i + keyLength);
        let xorWord = XOR_A_WORD(stringToCheck, key);
        result = result.concat(xorWord)
    }
    return ASCII_TO_WORD(result)
}

function GET_KEYS(chars, length, encryptedText) {
    let acc = {};
    chars = chars.split("");
    (function loop(base, i) {
        for (let k = 0; k < chars.length; k++) {
            if (i > 1) loop(base + chars[k], i - 1);
            else {
                let key = base + chars[k];
                let value = XOR_DECRYPT(encryptedText, key);

                let lettersRegex = /[a-zA-Z0-9)]/g;

                let countLetters = (value.match(lettersRegex) || []).length;

                let regexExpression = /[a-zA-Z0-9!@#\$\%\^\&\*\(\)\{\}\\\/\"\:\;\.\,\<\>)]/g;

                let count = (value.match(regexExpression) || []).length;
                if (count == value.length) {
                    let probabilty = Math.floor(countLetters / count * 100);

                    acc[probabilty] = acc[probabilty] || {};
                    acc[probabilty][key] = value;
                }

            }
        }
    })("", length);

    return acc;
}

function guessKey(encryptedText, keySize) {
    let possible = "abcdefghijklmnopqrstuvwxyz";
    return GET_KEYS(possible, keySize, encryptedText);

}


module.exports = {
    guessKey
};
