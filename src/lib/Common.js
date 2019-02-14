/* ⚠
  * getBBox() might have insufficient browser support!
  * The function has little documentation. In case use of BBox turns out
  * problematic, consider using `target.getBoundingClientRect()` along with
  * $('<svg>').getBoundingClientRect() to correct the x and y offset.
  */
export const getBBox = node => {
    if (!node || !node.current) return { x: 0, y: 0, width: 0, height: 0};

    // destruct and construct;  getBBox returns a SVGRect which does not spread.
    const { x, y, width, height } = node.current.getBBox();
    return { x, y, width, height };
};
