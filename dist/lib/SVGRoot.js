function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import DragRect from './indicators/DragRect';
import { getBBox } from './Common';
export default class SVGRoot extends Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "state", {
      dragging: false,
      dragOrigin: {
        x: 0,
        y: 0
      },
      dragRect: {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      }
    });

    _defineProperty(this, "rectToBox", rect => {
      return {
        left: rect.x,
        right: rect.x + rect.width,
        top: rect.y,
        bottom: rect.y + rect.height
      };
    });

    _defineProperty(this, "startDrag", event => {
      this.setState({
        dragInitiated: true,
        dragOrigin: this.computeCoordinates(event)
      });
    });

    _defineProperty(this, "handleDrag", event => {
      const {
        dragInitiated,
        dragOrigin
      } = this.state;
      let {
        dragging
      } = this.state;

      if (dragInitiated && !dragging) {
        dragging = true;
      }

      if (dragging) {
        const current = this.computeCoordinates(event);
        this.setState({
          dragging: true,
          dragRect: {
            x: Math.min(current.x, dragOrigin.x),
            y: Math.min(current.y, dragOrigin.y),
            width: Math.abs(current.x - dragOrigin.x),
            height: Math.abs(current.y - dragOrigin.y)
          }
        });
      }
    });

    _defineProperty(this, "stopDrag", () => {
      const {
        dragging,
        dragRect
      } = this.state;

      if (dragging) {
        const {
          selectables
        } = this.props;
        const dragbox = this.rectToBox(dragRect);
        const toSelect = selectables.map((node, index) => {
          const ok = this.boxOverlap(dragbox, getBBox(node));
          console.warn(ok);
          return ok;
        });
        console.warn(toSelect); // const indices = this.props.objects.map((object, index) => index);
        // const toSelect = indices.filter(index => {
        //   return this.boxOverlap(
        //     this.rectToBox(this.state.dragRect),
        //     this.rectToBox(this.getBBox(index))
        //   );
        // });
        // this.selectObjects(toSelect);
      }

      this.setState({
        dragging: false,
        dragInitiated: false,
        dragRect: {
          x: 0,
          y: 0,
          width: 0,
          height: 0
        }
      });
    });

    this.svgRef = createRef();
  }

  overlaps(a, b, x, y) {
    return Math.max(a, x) < Math.min(b, y);
  }

  boxOverlap(a, b) {
    return this.overlaps(a.left, a.right, b.left, b.right) && this.overlaps(a.top, a.bottom, b.top, b.bottom);
  }

  computeCoordinates(mouseEvent) {
    const dim = this.svgRef.current.getBoundingClientRect();
    return {
      x: mouseEvent.clientX - dim.left,
      y: mouseEvent.clientY - dim.top
    };
  }

  render() {
    const {
      width,
      height
    } = this.props;
    const {
      dragging,
      dragRect
    } = this.state;
    const styles = {
      backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5' + 'vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0' + 'PSIyMCIgZmlsbD0iI2ZmZiI+PC9yZWN0Pgo8cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9I' + 'iNGN0Y3RjciPjwvcmVjdD4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIG' + 'ZpbGw9IiNGN0Y3RjciPjwvcmVjdD4KPC9zdmc+)',
      backgroundSize: 'auto'
    };
    return React.createElement("svg", {
      ref: this.svgRef,
      width: width,
      height: height,
      style: styles,
      onMouseDown: this.startDrag,
      onMouseMove: this.handleDrag,
      onMouseUp: this.stopDrag
    }, this.props.children, dragging && React.createElement(DragRect, dragRect));
  }

}

_defineProperty(SVGRoot, "propTypes", {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  selectables: PropTypes.arrayOf(PropTypes.object)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvU1ZHUm9vdC5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsIkNvbXBvbmVudCIsImNyZWF0ZVJlZiIsIlByb3BUeXBlcyIsIkRyYWdSZWN0IiwiZ2V0QkJveCIsIlNWR1Jvb3QiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiZHJhZ2dpbmciLCJkcmFnT3JpZ2luIiwieCIsInkiLCJkcmFnUmVjdCIsIndpZHRoIiwiaGVpZ2h0IiwicmVjdCIsImxlZnQiLCJyaWdodCIsInRvcCIsImJvdHRvbSIsImV2ZW50Iiwic2V0U3RhdGUiLCJkcmFnSW5pdGlhdGVkIiwiY29tcHV0ZUNvb3JkaW5hdGVzIiwic3RhdGUiLCJjdXJyZW50IiwiTWF0aCIsIm1pbiIsImFicyIsInNlbGVjdGFibGVzIiwiZHJhZ2JveCIsInJlY3RUb0JveCIsInRvU2VsZWN0IiwibWFwIiwibm9kZSIsImluZGV4Iiwib2siLCJib3hPdmVybGFwIiwiY29uc29sZSIsIndhcm4iLCJzdmdSZWYiLCJvdmVybGFwcyIsImEiLCJiIiwibWF4IiwibW91c2VFdmVudCIsImRpbSIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImNsaWVudFgiLCJjbGllbnRZIiwicmVuZGVyIiwic3R5bGVzIiwiYmFja2dyb3VuZEltYWdlIiwiYmFja2dyb3VuZFNpemUiLCJzdGFydERyYWciLCJoYW5kbGVEcmFnIiwic3RvcERyYWciLCJjaGlsZHJlbiIsIm51bWJlciIsImlzUmVxdWlyZWQiLCJhcnJheU9mIiwib2JqZWN0Il0sIm1hcHBpbmdzIjoiOztBQUFBLE9BQU9BLEtBQVAsSUFBZ0JDLFNBQWhCLEVBQTJCQyxTQUEzQixRQUE0QyxPQUE1QztBQUNBLE9BQU9DLFNBQVAsTUFBc0IsWUFBdEI7QUFFQSxPQUFPQyxRQUFQLE1BQXFCLHVCQUFyQjtBQUNBLFNBQVNDLE9BQVQsUUFBd0IsVUFBeEI7QUFFQSxlQUFlLE1BQU1DLE9BQU4sU0FBc0JMLFNBQXRCLENBQWdDO0FBcUI3Q00sY0FBWUMsS0FB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akQsS0FBTCxDQUFXa0QsUUFUZCxFQVVHakQsWUFBWSxvQkFBQyxRQUFELEVBQWNJLFFBQWQsQ0FWZixDQURGO0FBY0Q7O0FBM0k0Qzs7Z0JBQTFCUCxPLGVBQ0E7QUFDakJRLFNBQU9YLFVBQVV3RCxNQUFWLENBQWlCQyxVQURQO0FBRWpCN0MsVUFBUVosVUFBVXdELE1BQVYsQ0FBaUJDLFVBRlI7QUFHakI5QixlQUFhM0IsVUFBVTBELE9BQVYsQ0FBa0IxRCxVQUFVMkQsTUFBNUI7QUFISSxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCwgY3JlYXRlUmVmIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuaW1wb3J0IERyYWdSZWN0IGZyb20gJy4vaW5kaWNhdG9ycy9EcmFnUmVjdCc7XG5pbXBvcnQgeyBnZXRCQm94IH0gZnJvbSAnLi9Db21tb24nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTVkdSb290IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICB3aWR0aDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIGhlaWdodDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIHNlbGVjdGFibGVzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KVxuICB9XG5cbiAgc3RhdGUgPSB7XG4gICAgZHJhZ2dpbmc6IGZhbHNlLFxuICAgIGRyYWdPcmlnaW46IHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwXG4gICAgfSxcbiAgICBkcmFnUmVjdDoge1xuICAgICAgeDogMCxcbiAgICAgIHk6IDAsXG4gICAgICB3aWR0aDogMCxcbiAgICAgIGhlaWdodDogMFxuICAgIH1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3ZnUmVmID0gY3JlYXRlUmVmKCk7XG4gIH1cblxuICBvdmVybGFwcyhhLCBiLCB4LCB5KSB7XG4gICAgcmV0dXJuIE1hdGgubWF4KGEsIHgpIDwgTWF0aC5taW4oYiwgeSk7XG4gIH1cblxuICBib3hPdmVybGFwKGEsIGIpIHtcbiAgICByZXR1cm4gdGhpcy5vdmVybGFwcyhhLmxlZnQsIGEucmlnaHQsIGIubGVmdCwgYi5yaWdodCkgJiZcbiAgICAgIHRoaXMub3ZlcmxhcHMoYS50b3AsIGEuYm90dG9tLCBiLnRvcCwgYi5ib3R0b20pXG4gIH1cblxuICByZWN0VG9Cb3ggPSByZWN0ID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbGVmdDogcmVjdC54LFxuICAgICAgcmlnaHQ6IHJlY3QueCArIHJlY3Qud2lkdGgsXG4gICAgICB0b3A6IHJlY3QueSxcbiAgICAgIGJvdHRvbTogcmVjdC55ICsgcmVjdC5oZWlnaHRcbiAgICB9O1xuICB9XG5cbiAgY29tcHV0ZUNvb3JkaW5hdGVzKG1vdXNlRXZlbnQpIHtcbiAgICBjb25zdCBkaW0gPSB0aGlzLnN2Z1JlZi5jdXJyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IG1vdXNlRXZlbnQuY2xpZW50WCAtIGRpbS5sZWZ0LFxuICAgICAgeTogbW91c2VFdmVudC5jbGllbnRZIC0gZGltLnRvcFxuICAgIH1cbiAgfVxuXG4gIHN0YXJ0RHJhZyA9IChldmVudCkgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZHJhZ0luaXRpYXRlZDogdHJ1ZSxcbiAgICAgIGRyYWdPcmlnaW46IHRoaXMuY29tcHV0ZUNvb3JkaW5hdGVzKGV2ZW50KVxuICAgIH0pO1xuICB9XG5cbiAgaGFuZGxlRHJhZyA9IChldmVudCkgPT4ge1xuICAgIGNvbnN0IHsgZHJhZ0luaXRpYXRlZCwgZHJhZ09yaWdpbiB9ID0gdGhpcy5zdGF0ZTtcbiAgICBsZXQgeyBkcmFnZ2luZyB9ID0gdGhpcy5zdGF0ZTtcblxuICAgIGlmIChkcmFnSW5pdGlhdGVkICYmICFkcmFnZ2luZykge1xuICAgICAgZHJhZ2dpbmcgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmIChkcmFnZ2luZykge1xuICAgICAgY29uc3QgY3VycmVudCA9IHRoaXMuY29tcHV0ZUNvb3JkaW5hdGVzKGV2ZW50KTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBkcmFnZ2luZzogdHJ1ZSxcbiAgICAgICAgZHJhZ1JlY3Q6IHtcbiAgICAgICAgICB4OiBNYXRoLm1pbihjdXJyZW50LngsIGRyYWdPcmlnaW4ueCksXG4gICAgICAgICAgeTogTWF0aC5taW4oY3VycmVudC55LCBkcmFnT3JpZ2luLnkpLFxuICAgICAgICAgIHdpZHRoOiBNYXRoLmFicyhjdXJyZW50LnggLSBkcmFnT3JpZ2luLngpLFxuICAgICAgICAgIGhlaWdodDogTWF0aC5hYnMoY3VycmVudC55IC0gZHJhZ09yaWdpbi55KVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBzdG9wRHJhZyA9ICgpID0+IHtcbiAgICBjb25zdCB7IGRyYWdnaW5nLCBkcmFnUmVjdCB9ID0gdGhpcy5zdGF0ZTtcblxuICAgIGlmIChkcmFnZ2luZykge1xuICAgICAgY29uc3QgeyBzZWxlY3RhYmxlcyB9ID0gdGhpcy5wcm9wcztcbiAgICAgIGNvbnN0IGRyYWdib3ggPSB0aGlzLnJlY3RUb0JveChkcmFnUmVjdCk7XG4gICAgICBjb25zdCB0b1NlbGVjdCA9IHNlbGVjdGFibGVzLm1hcCgobm9kZSwgaW5kZXgpID0+IHtcbiAgICAgICAgY29uc3Qgb2sgPSB0aGlzLmJveE92ZXJsYXAoZHJhZ2JveCxcbiAgICAgICAgICBnZXRCQm94KG5vZGUpXG4gICAgICAgICk7XG4gICAgICAgIGNvbnNvbGUud2Fybihvayk7XG4gICAgICAgIHJldHVybiBvaztcbiAgICAgIH0pO1xuICAgICAgY29uc29sZS53YXJuKHRvU2VsZWN0KTtcbiAgICAgIC8vIGNvbnN0IGluZGljZXMgPSB0aGlzLnByb3BzLm9iamVjdHMubWFwKChvYmplY3QsIGluZGV4KSA9PiBpbmRleCk7XG4gICAgICAvLyBjb25zdCB0b1NlbGVjdCA9IGluZGljZXMuZmlsdGVyKGluZGV4ID0+IHtcbiAgICAgIC8vICAgcmV0dXJuIHRoaXMuYm94T3ZlcmxhcChcbiAgICAgIC8vICAgICB0aGlzLnJlY3RUb0JveCh0aGlzLnN0YXRlLmRyYWdSZWN0KSxcbiAgICAgIC8vICAgICB0aGlzLnJlY3RUb0JveCh0aGlzLmdldEJCb3goaW5kZXgpKVxuICAgICAgLy8gICApO1xuICAgICAgLy8gfSk7XG4gICAgICAvLyB0aGlzLnNlbGVjdE9iamVjdHModG9TZWxlY3QpO1xuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZHJhZ2dpbmc6IGZhbHNlLFxuICAgICAgZHJhZ0luaXRpYXRlZDogZmFsc2UsXG4gICAgICBkcmFnUmVjdDogeyB4OiAwLCB5OiAwLCB3aWR0aDogMCwgaGVpZ2h0OiAwIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgeyBkcmFnZ2luZywgZHJhZ1JlY3QgfSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3Qgc3R5bGVzID0ge1xuICAgICAgYmFja2dyb3VuZEltYWdlOiAndXJsKGRhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsUEhOMlp5QjRiV3h1Y3owaWFIUjBjRG92TDNkM2R5NTNNeTUnXG4gICAgICAgICsgJ3ZjbWN2TWpBd01DOXpkbWNpSUhkcFpIUm9QU0l5TUNJZ2FHVnBaMmgwUFNJeU1DSStDanh5WldOMElIZHBaSFJvUFNJeU1DSWdhR1ZwWjJoMCdcbiAgICAgICAgKyAnUFNJeU1DSWdabWxzYkQwaUkyWm1aaUkrUEM5eVpXTjBQZ284Y21WamRDQjNhV1IwYUQwaU1UQWlJR2hsYVdkb2REMGlNVEFpSUdacGJHdzlJJ1xuICAgICAgICArICdpTkdOMFkzUmpjaVBqd3ZjbVZqZEQ0S1BISmxZM1FnZUQwaU1UQWlJSGs5SWpFd0lpQjNhV1IwYUQwaU1UQWlJR2hsYVdkb2REMGlNVEFpSUcnXG4gICAgICAgICsgJ1pwYkd3OUlpTkdOMFkzUmpjaVBqd3ZjbVZqZEQ0S1BDOXpkbWMrKScsXG4gICAgICBiYWNrZ3JvdW5kU2l6ZTogJ2F1dG8nXG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICA8c3ZnXG4gICAgICAgIHJlZj17dGhpcy5zdmdSZWZ9XG4gICAgICAgIHdpZHRoPXt3aWR0aH1cbiAgICAgICAgaGVpZ2h0PXtoZWlnaHR9XG4gICAgICAgIHN0eWxlPXtzdHlsZXN9XG4gICAgICAgIG9uTW91c2VEb3duPXt0aGlzLnN0YXJ0RHJhZ31cbiAgICAgICAgb25Nb3VzZU1vdmU9e3RoaXMuaGFuZGxlRHJhZ31cbiAgICAgICAgb25Nb3VzZVVwPXt0aGlzLnN0b3BEcmFnfVxuICAgICAgPlxuICAgICAgICB7dGhpcy5wcm9wcy5jaGlsZHJlbn1cbiAgICAgICAge2RyYWdnaW5nICYmIDxEcmFnUmVjdCB7Li4uZHJhZ1JlY3R9IC8+fVxuICAgICAgPC9zdmc+XG4gICAgKTtcbiAgfVxufVxuIl19