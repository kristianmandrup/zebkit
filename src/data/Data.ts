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
