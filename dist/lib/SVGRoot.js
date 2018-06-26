function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import DragRect from './indicators/DragRect';
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

    _defineProperty(this, "rectToBox", rect => {
      return {
        left: rect.x,
        right: rect.x + rect.width,
        top: rect.y,
        bottom: rect.y + rect.height
      };
    });

    _defineProperty(this, "stopDrag", event => {
      if (this.state.dragging) {// const indices = this.props.objects.map((object, index) => index);
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
  height: PropTypes.number.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvU1ZHUm9vdC5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsIkNvbXBvbmVudCIsImNyZWF0ZVJlZiIsIlByb3BUeXBlcyIsIkRyYWdSZWN0IiwiU1ZHUm9vdCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJkcmFnZ2luZyIsImRyYWdPcmlnaW4iLCJ4IiwieSIsImRyYWdSZWN0Iiwid2lkdGgiLCJoZWlnaHQiLCJldmVudCIsInNldFN0YXRlIiwiZHJhZ0luaXRpYXRlZCIsImNvbXB1dGVDb29yZGluYXRlcyIsInN0YXRlIiwiY3VycmVudCIsIk1hdGgiLCJtaW4iLCJhYnMiLCJyZWN0IiwibGVmdCIsInJpZ2h0IiwidG9wIiwiYm90dG9tIiwic3ZnUmVmIiwib3ZlcmxhcHMiLCJhIiwiYiIsIm1heCIsImJveE92ZXJsYXAiLCJtb3VzZUV2ZW50IiwiZGltIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiY2xpZW50WCIsImNsaWVudFkiLCJyZW5kZXIiLCJzdHlsZXMiLCJiYWNrZ3JvdW5kSW1hZ2UiLCJiYWNrZ3JvdW5kU2l6ZSIsInN0YXJ0RHJhZyIsImhhbmRsZURyYWciLCJzdG9wRHJhZyIsImNoaWxkcmVuIiwibnVtYmVyIiwiaXNSZXF1aXJlZCJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxPQUFPQSxLQUFQLElBQWdCQyxTQUFoQixFQUEyQkMsU0FBM0IsUUFBNEMsT0FBNUM7QUFDQSxPQUFPQyxTQUFQLE1BQXNCLFlBQXRCO0FBRUEsT0FBT0MsUUFBUCxNQUFxQix1QkFBckI7QUFFQSxlQUFlLE1BQU1DLE9BQU4sU0FBc0JKLFNBQXRCLENBQWdDO0FBb0I3Q0ssY0FBWUMsS0FBWixFQUFtQjtBQUNqQixVQUFNQSxLQUFOOztBQURpQixtQ0FkWDtBQUNOQyxnQkFBVSxLQURKO0FBRU5DLGtCQUFZO0FBQ1ZDLFdBQUcsQ0FETztBQUVWQyxXQUFHO0FBRk8sT0FGTjtBQU1OQyxnQkFBVTtBQUNSRixXQUFHLENBREs7QUFFUkMsV0FBRyxDQUZL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QixLQUFQO0FBSUQ7O0FBRURhLFdBQVM7QUFDUCxVQUFNO0FBQUUzQixXQUFGO0FBQVNDO0FBQVQsUUFBb0IsS0FBS1AsS0FBL0I7QUFDQSxVQUFNO0FBQUVDLGNBQUY7QUFBWUk7QUFBWixRQUF5QixLQUFLTyxLQUFwQztBQUNBLFVBQU1zQixTQUFTO0FBQ2JDLHVCQUFpQixzRUFDYixtRkFEYSxHQUViLG1GQUZhLEdBR2IsbUZBSGEsR0FJYix5Q0FMUztBQU1iQyxzQkFBZ0I7QUFOSCxLQUFmO0FBU0EsV0FDRTtBQUNFLFdBQUssS0FBS2QsTUFEWjtBQUVFLGFBQU9oQixLQUZUO0FBR0UsY0FBUUMsTUFIVjtBQUlFLGFBQU8yQixNQUpUO0FBS0UsbUJBQWEsS0FBS0csU0FMcEI7QUFNRSxtQkFBYSxLQUFLQyxVQU5wQjtBQU9FLGlCQUFXLEtBQUtDO0FBUGxCLE9BU0csS0FBS3ZDLEtBQUwsQ0FBV3dDLFFBVGQsRUFVR3ZDLFlBQVksb0JBQUMsUUFBRCxFQUFjSSxRQUFkLENBVmYsQ0FERjtBQWNEOztBQTlINEM7O2dCQUExQlAsTyxlQUNBO0FBQ2pCUSxTQUFPVixVQUFVNkMsTUFBVixDQUFpQkMsVUFEUDtBQUVqQm5DLFVBQVFYLFVBQVU2QyxNQUFWLENBQWlCQztBQUZSLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50LCBjcmVhdGVSZWYgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgRHJhZ1JlY3QgZnJvbSAnLi9pbmRpY2F0b3JzL0RyYWdSZWN0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU1ZHUm9vdCBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZFxuICB9XG5cbiAgc3RhdGUgPSB7XG4gICAgZHJhZ2dpbmc6IGZhbHNlLFxuICAgIGRyYWdPcmlnaW46IHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwXG4gICAgfSxcbiAgICBkcmFnUmVjdDoge1xuICAgICAgeDogMCxcbiAgICAgIHk6IDAsXG4gICAgICB3aWR0aDogMCxcbiAgICAgIGhlaWdodDogMFxuICAgIH1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3ZnUmVmID0gY3JlYXRlUmVmKCk7XG4gIH1cblxuICBzdGFydERyYWcgPSAoZXZlbnQpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGRyYWdJbml0aWF0ZWQ6IHRydWUsXG4gICAgICBkcmFnT3JpZ2luOiB0aGlzLmNvbXB1dGVDb29yZGluYXRlcyhldmVudClcbiAgICB9KTtcbiAgfVxuXG4gIGhhbmRsZURyYWcgPSAoZXZlbnQpID0+IHtcbiAgICBjb25zdCB7IGRyYWdJbml0aWF0ZWQsIGRyYWdPcmlnaW4gfSA9IHRoaXMuc3RhdGU7XG4gICAgbGV0IHsgZHJhZ2dpbmcgfSA9IHRoaXMuc3RhdGU7XG5cbiAgICBpZiAoZHJhZ0luaXRpYXRlZCAmJiAhZHJhZ2dpbmcpIHtcbiAgICAgIGRyYWdnaW5nID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoZHJhZ2dpbmcpIHtcbiAgICAgIGNvbnN0IGN1cnJlbnQgPSB0aGlzLmNvbXB1dGVDb29yZGluYXRlcyhldmVudCk7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgZHJhZ2dpbmc6IHRydWUsXG4gICAgICAgIGRyYWdSZWN0OiB7XG4gICAgICAgICAgeDogTWF0aC5taW4oY3VycmVudC54LCBkcmFnT3JpZ2luLngpLFxuICAgICAgICAgIHk6IE1hdGgubWluKGN1cnJlbnQueSwgZHJhZ09yaWdpbi55KSxcbiAgICAgICAgICB3aWR0aDogTWF0aC5hYnMoY3VycmVudC54IC0gZHJhZ09yaWdpbi54KSxcbiAgICAgICAgICBoZWlnaHQ6IE1hdGguYWJzKGN1cnJlbnQueSAtIGRyYWdPcmlnaW4ueSlcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgb3ZlcmxhcHMoYSwgYiwgeCwgeSkge1xuICAgIHJldHVybiBNYXRoLm1heChhLCB4KSA8IE1hdGgubWluKGIsIHkpO1xuICB9XG5cbiAgYm94T3ZlcmxhcChhLCBiKSB7XG4gICAgcmV0dXJuIHRoaXMub3ZlcmxhcHMoYS5sZWZ0LCBhLnJpZ2h0LCBiLmxlZnQsIGIucmlnaHQpICYmXG4gICAgICB0aGlzLm92ZXJsYXBzKGEudG9wLCBhLmJvdHRvbSwgYi50b3AsIGIuYm90dG9tKVxuICB9XG5cbiAgcmVjdFRvQm94ID0gcmVjdCA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxlZnQ6IHJlY3QueCxcbiAgICAgIHJpZ2h0OiByZWN0LnggKyByZWN0LndpZHRoLFxuICAgICAgdG9wOiByZWN0LnksXG4gICAgICBib3R0b206IHJlY3QueSArIHJlY3QuaGVpZ2h0XG4gICAgfTtcbiAgfVxuXG4gIHN0b3BEcmFnID0gKGV2ZW50KSA9PiB7XG4gICAgaWYgKHRoaXMuc3RhdGUuZHJhZ2dpbmcpIHtcbiAgICAgIC8vIGNvbnN0IGluZGljZXMgPSB0aGlzLnByb3BzLm9iamVjdHMubWFwKChvYmplY3QsIGluZGV4KSA9PiBpbmRleCk7XG4gICAgICAvLyBjb25zdCB0b1NlbGVjdCA9IGluZGljZXMuZmlsdGVyKGluZGV4ID0+IHtcbiAgICAgIC8vICAgcmV0dXJuIHRoaXMuYm94T3ZlcmxhcChcbiAgICAgIC8vICAgICB0aGlzLnJlY3RUb0JveCh0aGlzLnN0YXRlLmRyYWdSZWN0KSxcbiAgICAgIC8vICAgICB0aGlzLnJlY3RUb0JveCh0aGlzLmdldEJCb3goaW5kZXgpKVxuICAgICAgLy8gICApO1xuICAgICAgLy8gfSk7XG4gICAgICAvLyB0aGlzLnNlbGVjdE9iamVjdHModG9TZWxlY3QpO1xuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZHJhZ2dpbmc6IGZhbHNlLFxuICAgICAgZHJhZ0luaXRpYXRlZDogZmFsc2UsXG4gICAgICBkcmFnUmVjdDogeyB4OiAwLCB5OiAwLCB3aWR0aDogMCwgaGVpZ2h0OiAwIH1cbiAgICB9KTtcbiAgfVxuXG4gIGNvbXB1dGVDb29yZGluYXRlcyhtb3VzZUV2ZW50KSB7XG4gICAgY29uc3QgZGltID0gdGhpcy5zdmdSZWYuY3VycmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgIHJldHVybiB7XG4gICAgICB4OiBtb3VzZUV2ZW50LmNsaWVudFggLSBkaW0ubGVmdCxcbiAgICAgIHk6IG1vdXNlRXZlbnQuY2xpZW50WSAtIGRpbS50b3BcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHsgZHJhZ2dpbmcsIGRyYWdSZWN0IH0gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IHN0eWxlcyA9IHtcbiAgICAgIGJhY2tncm91bmRJbWFnZTogJ3VybChkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUI0Yld4dWN6MGlhSFIwY0RvdkwzZDNkeTUzTXk1J1xuICAgICAgICArICd2Y21jdk1qQXdNQzl6ZG1jaUlIZHBaSFJvUFNJeU1DSWdhR1ZwWjJoMFBTSXlNQ0krQ2p4eVpXTjBJSGRwWkhSb1BTSXlNQ0lnYUdWcFoyaDAnXG4gICAgICAgICsgJ1BTSXlNQ0lnWm1sc2JEMGlJMlptWmlJK1BDOXlaV04wUGdvOGNtVmpkQ0IzYVdSMGFEMGlNVEFpSUdobGFXZG9kRDBpTVRBaUlHWnBiR3c5SSdcbiAgICAgICAgKyAnaU5HTjBZM1JqY2lQand2Y21WamRENEtQSEpsWTNRZ2VEMGlNVEFpSUhrOUlqRXdJaUIzYVdSMGFEMGlNVEFpSUdobGFXZG9kRDBpTVRBaUlHJ1xuICAgICAgICArICdacGJHdzlJaU5HTjBZM1JqY2lQand2Y21WamRENEtQQzl6ZG1jKyknLFxuICAgICAgYmFja2dyb3VuZFNpemU6ICdhdXRvJ1xuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPHN2Z1xuICAgICAgICByZWY9e3RoaXMuc3ZnUmVmfVxuICAgICAgICB3aWR0aD17d2lkdGh9XG4gICAgICAgIGhlaWdodD17aGVpZ2h0fVxuICAgICAgICBzdHlsZT17c3R5bGVzfVxuICAgICAgICBvbk1vdXNlRG93bj17dGhpcy5zdGFydERyYWd9XG4gICAgICAgIG9uTW91c2VNb3ZlPXt0aGlzLmhhbmRsZURyYWd9XG4gICAgICAgIG9uTW91c2VVcD17dGhpcy5zdG9wRHJhZ31cbiAgICAgID5cbiAgICAgICAge3RoaXMucHJvcHMuY2hpbGRyZW59XG4gICAgICAgIHtkcmFnZ2luZyAmJiA8RHJhZ1JlY3Qgey4uLmRyYWdSZWN0fSAvPn1cbiAgICAgIDwvc3ZnPlxuICAgICk7XG4gIH1cbn1cbiJdfQ==