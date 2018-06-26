/* ⚠
  * getBBox() might have insufficient browser support!
  * The function has little documentation. In case use of BBox turns out
  * problematic, consider using `target.getBoundingClientRect()` along with
  * $('<svg>').getBoundingClientRect() to correct the x and y offset.
  */
export const getBBox = node => {
  // destruct and construct;  getBBox returns a SVGRect which does not spread.
  const {
    x,
    y,
    width,
    height
  } = node.current.getBBox();
  return {
    x,
    y,
    width,
    height
  };
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvQ29tbW9uLmpzIl0sIm5hbWVzIjpbImdldEJCb3giLCJub2RlIiwieCIsInkiLCJ3aWR0aCIsImhlaWdodCIsImN1cnJlbnQiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUFNQSxPQUFPLE1BQU1BLFVBQVVDLFFBQVE7QUFDM0I7QUFDQSxRQUFNO0FBQUVDLEtBQUY7QUFBS0MsS0FBTDtBQUFRQyxTQUFSO0FBQWVDO0FBQWYsTUFBMEJKLEtBQUtLLE9BQUwsQ0FBYU4sT0FBYixFQUFoQztBQUNBLFNBQU87QUFBRUUsS0FBRjtBQUFLQyxLQUFMO0FBQVFDLFNBQVI7QUFBZUM7QUFBZixHQUFQO0FBQ0gsQ0FKTSIsInNvdXJjZXNDb250ZW50IjpbIi8qIOKaoFxyXG4gICogZ2V0QkJveCgpIG1pZ2h0IGhhdmUgaW5zdWZmaWNpZW50IGJyb3dzZXIgc3VwcG9ydCFcclxuICAqIFRoZSBmdW5jdGlvbiBoYXMgbGl0dGxlIGRvY3VtZW50YXRpb24uIEluIGNhc2UgdXNlIG9mIEJCb3ggdHVybnMgb3V0XHJcbiAgKiBwcm9ibGVtYXRpYywgY29uc2lkZXIgdXNpbmcgYHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKWAgYWxvbmcgd2l0aFxyXG4gICogJCgnPHN2Zz4nKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSB0byBjb3JyZWN0IHRoZSB4IGFuZCB5IG9mZnNldC5cclxuICAqL1xyXG5leHBvcnQgY29uc3QgZ2V0QkJveCA9IG5vZGUgPT4ge1xyXG4gICAgLy8gZGVzdHJ1Y3QgYW5kIGNvbnN0cnVjdDsgIGdldEJCb3ggcmV0dXJucyBhIFNWR1JlY3Qgd2hpY2ggZG9lcyBub3Qgc3ByZWFkLlxyXG4gICAgY29uc3QgeyB4LCB5LCB3aWR0aCwgaGVpZ2h0IH0gPSBub2RlLmN1cnJlbnQuZ2V0QkJveCgpO1xyXG4gICAgcmV0dXJuIHsgeCwgeSwgd2lkdGgsIGhlaWdodCB9O1xyXG59O1xyXG4iXX0=