// TODO: this is the future thoughts regarding
// grid cell selection customization
export default class RowSelMode {
    constructor() {
        this.selectedIndex = 0;
        this.$blocked = false;

        this.isSelected = function(row, col) {
            return row >= 0 && this.selectedIndex === row;
        };

        this.select = function(row, col, b) {
            if (arguments.length === 1 || (arguments.length === 2 && zebkit.isNumber(col))) {
                b = true;
            }

            if (this.isSelected(row, col) != b){
                if (this.selectedIndex >= 0) this.clearSelect();
                if (b === true) {
                    this.selectedIndex = row;
                    this.target._.rowSelected();
                }
            }
        };

        this.clearSelect = function() {
            if (this.selectedIndex >= 0) {
                this.selectedIndex = -1;
                this.target._.rowSelected();
            }
        };

        this.posChanged = function(src) {
            if ($blocked === false) {
                $blocked = true;
                try {

                }
                finally {
                    $blocked = false;
                }
            }
        };
    }
}
