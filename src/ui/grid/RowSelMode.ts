// TODO: this is the future thoughts regarding
// grid cell selection customization
import { types } from '../../utils';

export default class RowSelMode {
    selectedIndex: number;
    $blocked: boolean;
    target: any;

    constructor() {
        this.selectedIndex = 0;
        this.$blocked = false;
    }

    isSelected(row, col) {
        return row >= 0 && this.selectedIndex === row;
    };

    select(row, col, b) {
        if (arguments.length === 1 || (arguments.length === 2 && types.isNumber(col))) {
            b = true;
        }

        if (this.isSelected(row, col) != b){
            if (this.selectedIndex >= 0) this.clearSelect();
            if (b === true) {
                this.selectedIndex = row;
                this.target._.rowSelected();
            }
        }
    }

    clearSelect() {
        if (this.selectedIndex >= 0) {
            this.selectedIndex = -1;
            this.target._.rowSelected();
        }
    }

    posChanged(src) {
        if (this.$blocked === false) {
            this.$blocked = true;
            try {

            } finally {
                this.$blocked = false;
            }
        }
    }
}
