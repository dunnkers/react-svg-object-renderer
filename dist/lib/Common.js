/* ⚠
  * getBBox() might have insufficient browser support!
  * The function has little documentation. In case use of BBox turns out
  * problematic, consider using `target.getBoundingClientRect()` along with
  * $('<svg>').getBoundingClientRect() to correct the x and y offset.
  */
export const getBBox = node => {
  if (!node || !node.current) return {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  }; // destruct and construct;  getBBox returns a SVGRect which does not spread.

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvQ29tbW9uLmpzIl0sIm5hbWVzIjpbImdldEJCb3giLCJub2RlIiwiY3VycmVudCIsIngiLCJ5Iiwid2lkdGgiLCJoZWlnaHQiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUFNQSxPQUFPLE1BQU1BLFVBQVVDLFFBQVE7QUFDM0IsTUFBSSxDQUFDQSxJQUFELElBQVMsQ0FBQ0EsS0FBS0MsT0FBbkIsRUFBNEIsT0FBTztBQUFFQyxPQUFHLENBQUw7QUFBUUMsT0FBRyxDQUFYO0FBQWNDLFdBQU8sQ0FBckI7QUFBd0JDLFlBQVE7QUFBaEMsR0FBUCxDQURELENBRzNCOztBQUNBLFFBQU07QUFBRUgsS0FBRjtBQUFLQyxLQUFMO0FBQVFDLFNBQVI7QUFBZUM7QUFBZixNQUEwQkwsS0FBS0MsT0FBTCxDQUFhRixPQUFiLEVBQWhDO0FBQ0EsU0FBTztBQUFFRyxLQUFGO0FBQUtDLEtBQUw7QUFBUUMsU0FBUjtBQUFlQztBQUFmLEdBQVA7QUFDSCxDQU5NIiwic291cmNlc0NvbnRlbnQiOlsiLyog4pqgXHJcbiAgKiBnZXRCQm94KCkgbWlnaHQgaGF2ZSBpbnN1ZmZpY2llbnQgYnJvd3NlciBzdXBwb3J0IVxyXG4gICogVGhlIGZ1bmN0aW9uIGhhcyBsaXR0bGUgZG9jdW1lbnRhdGlvbi4gSW4gY2FzZSB1c2Ugb2YgQkJveCB0dXJucyBvdXRcclxuICAqIHByb2JsZW1hdGljLCBjb25zaWRlciB1c2luZyBgdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpYCBhbG9uZyB3aXRoXHJcbiAgKiAkKCc8c3ZnPicpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpIHRvIGNvcnJlY3QgdGhlIHggYW5kIHkgb2Zmc2V0LlxyXG4gICovXHJcbmV4cG9ydCBjb25zdCBnZXRCQm94ID0gbm9kZSA9PiB7XHJcbiAgICBpZiAoIW5vZGUgfHwgIW5vZGUuY3VycmVudCkgcmV0dXJuIHsgeDogMCwgeTogMCwgd2lkdGg6IDAsIGhlaWdodDogMH07XHJcblxyXG4gICAgLy8gZGVzdHJ1Y3QgYW5kIGNvbnN0cnVjdDsgIGdldEJCb3ggcmV0dXJucyBhIFNWR1JlY3Qgd2hpY2ggZG9lcyBub3Qgc3ByZWFkLlxyXG4gICAgY29uc3QgeyB4LCB5LCB3aWR0aCwgaGVpZ2h0IH0gPSBub2RlLmN1cnJlbnQuZ2V0QkJveCgpO1xyXG4gICAgcmV0dXJuIHsgeCwgeSwgd2lkdGgsIGhlaWdodCB9O1xyXG59O1xyXG4iXX0=