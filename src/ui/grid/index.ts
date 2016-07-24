//      ---------------------------------------------------
//      | x |    col0 width     | x |   col2 width    | x |
//      .   .
//    Line width
//   -->.   .<--

/**
 * The package contains number of classes and interfaces to implement
 * UI Grid component. The grid allows developers to visualize matrix
 * model, customize the model data editing and rendering.
 * @module ui.grid
 * @main
 */


/**
 * Get the given column width of a grid component
 * @param {Integer} col a column index
 * @method getColWidth
 * @return {Integer} a column width
 */

/**
 * Get the given row height of a grid component
 * @param {Integer} row a row index
 * @method getRowHeight
 * @return {Integer} a row height
 */

/**
 * Get the given row preferred height of a grid component
 * @param {Integer} row a row index
 * @method getPSRowHeight
 * @return {Integer} a row preferred height
 */

/**
 * Get the given column preferred width of a grid component
 * @param {Integer} col a column index
 * @method getPSColWidth
 * @return {Integer} a column preferred width
 */

 /**
  * Get a x origin of a grid component. Origin indicates how
  * the grid component content has been scrolled
  * @method getXOrigin
  * @return {Integer} a x origin
  */

/**
  * Get a y origin of a grid component. Origin indicates how
  * the grid component content has been scrolled
  * @method getYOrigin
  * @return {Integer} a y origin
  */

  /**
   * Set the given column width of a grid component
   * @param {Integer} col a column index
   * @param {Integer} w a column width
   * @method setColWidth
   */

  /**
   * Set the given row height of a grid component
   * @param {Integer} row a row index
   * @param {Integer} h a row height
   * @method setRowHeight
   */

  /**
   * Get number of columns in a grid component
   * @return {Integer} a number of columns
   * @method getGridCols
   */

  /**
   * Get number of rows in a grid component
   * @return {Integer} a number of rows
   * @method getGridRows
   */

   /**
    * Get a structure that describes a grid component
    * columns and rows visibility
    * @return {zebkit.ui.grid.CellsVisibility} a grid cells visibility
    * @method getCellsVisibility
    */

  /**
   * Grid line size
   * @attribute lineSize
   * @type {Integer}
   * @readOnly
   */

  /**
   * Indicate if a grid sizes its rows and cols basing on its preferred sizes
   * @attribute isUsePsMetric
   * @type {Boolean}
   * @readOnly
   */






