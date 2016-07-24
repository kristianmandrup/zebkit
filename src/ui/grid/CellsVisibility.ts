export default CellsVisibility = function() {
    this.hasVisibleCells = function(){
        return this.fr != null && this.fc != null &&
               this.lr != null && this.lc != null   ;
    };

    // first visible row (row and y), first visible
    // col, last visible col and row
    this.fr = this.fc = this.lr = this.lc = null;
};
