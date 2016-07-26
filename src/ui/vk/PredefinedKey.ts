export const PredefinedVKey = {
    shift : {
        view: {
            "on" : new pkg.ShiftKeyArrow(),
            "off": new pkg.ShiftKeyArrow()
        },
        code : ui.KeyEvent.SHIFT,
        mask : ui.KeyEvent.M_SHIFT
    },

    left: {
        code : ui.KeyEvent.LEFT,
        view : new pkg.ArrowView("left"),
        firePeriod: 150
    },

    right: {
        code : ui.KeyEvent.RIGHT,
        view : new pkg.ArrowView("right"),
        period: 150
    },

    up: {
        code : ui.KeyEvent.UP,
        view : new pkg.ArrowView("top"),
        period: 150
    },

    down: {
        code : ui.KeyEvent.DOWN,
        view : new pkg.ArrowView("bottom"),
        period: 150
    },

    enter : {
        //          |  A
        //     E    |
        // C /______|  B
        //   \ D
        //
        view: ui.$view(function(g, x, y, w, h, d) {
            var gap = 6;
            g.setColor("orange");
            g.beginPath();
            g.lineWidth = 2;
            g.moveTo(x + w - gap, y + gap);          // A
            g.lineTo(x + w - gap, y + h - 2*gap);  // AB
            g.lineTo(x + gap, y + h - 2*gap);      // BC
            g.lineTo(x + 2*gap, y + h - gap);      // CD
            g.moveTo(x + gap - 1, y + h - 2*gap);      // C
            g.lineTo(x + 2*gap, y + h - 3 * gap);      // CE
            g.stroke();
        }),
        ch : "\n",
        hint: null
    },

    space : {
        label: "Space",
        ch   : " ",
        size : "stretched",
        hint : null
    },

    backspace: {
        code: ui.KeyEvent.BSPACE,
        label: "<=",
        view2: ui.$view(function(g, x, y, w, h, d) {
            g.setColor("black");
            g.beginPath();
            g.lineWidth = 2;
            g.moveTo(x + w - 2, y + h - 8);  // B
            g.lineTo(x + 6, y + h - 8);      // BC
            g.lineTo(x + 12, y + h - 4);      // CD
            g.moveTo(x + 6, y + h - 8);      // C
            g.lineTo(x + 12, y + h -12);      // CE
            g.stroke();
        }),
        repeat: 150,
        size: "ps",
        hints: "backspace"
    }
}