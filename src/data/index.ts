export default class Data {
    descent(a : any, b : any) {
        if (a == null) return 1;
        return (typeof(a) === 'string') ? a.localeCompare(b) : a - b;
    }

    ascent(a : any, b : any) {
        if (b == null) return 1;
        return (typeof(b) === 'string') ? b.localeCompare(a) : b - a;
    };
}

export { default as Text } from './Text';
export { default as TextModel } from './TextModel';
export { default as SingleLineText } from './SingleLineText';
export { default as Item } from './Item';
export { default as TreeModel } from './TreeModel';
