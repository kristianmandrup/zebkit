import Output from './Output';

export default class HtmlOutput extends Output {
    constructor(element) {
        super();

        if (arguments.length === 0) element = null;

        element = element || "zebkit.out";
        if (type.isString(element)) {
            this.el = document.getElementById(element);
            if (this.el == null) {
                this.el = document.createElement('div');
                this.el.setAttribute("id", element);
                document.body.appendChild(this.el);
            }
        }
        else {
            if (element == null) {
                throw new Error("Unknown HTML output element");
            }

            this.el = element;
        }
    }

    print(s) { this.out('black', s); },
    error(s) { this.out('red', s); },
    warn(s)  { this.out('orange', s); },

    out(color, msg) {
        var t = ["<div class='zebkit.out.print' style='color:", color, "'>", this.format(msg), "</div>" ];
        this.el.innerHTML += t.join('');
    }
}