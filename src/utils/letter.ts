var letterRE = /[A-Za-z]/;
export const isLetter = function (ch) {
    if (ch.length != 1) throw new Error("Incorrect character");
    return letterRE.test(ch);
};
