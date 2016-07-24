import Interface from '../Interface';

/**
 *  Interface that describes a grid component metrics
 *  @class zebkit.ui.grid.Metrics
 */
export default Metrics = Interface([
    "abstract",
        function getCellsVisibility() {},
        function getColWidth(col) {},
        function getRowHeight(row) {},
        function setRowHeight(row, height) {},
        function setColWidth(col, width) {}
]);
