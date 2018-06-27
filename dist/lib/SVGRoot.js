function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import DragRect from './indicators/DragRect';
import HoverRect from './indicators/HoverRect';
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
        const toSelect = [];
        selectables.forEach((node, index) => {
          const nodebox = getBBox(node);

          if (this.boxOverlap(dragbox, this.rectToBox(nodebox))) {
            toSelect.push(index);
          }
        });
        this.props.selectIndices(toSelect);
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
      height,
      hovering
    } = this.props;
    const {
      dragging,
      dragRect
    } = this.state;
    return React.createElement("svg", {
      ref: this.svgRef,
      width: width,
      height: height,
      style: styles,
      onMouseDown: this.startDrag,
      onMouseMove: this.handleDrag,
      onMouseUp: this.stopDrag
    }, this.props.children, !dragging && hovering !== -1 && React.createElement(HoverRect, _extends({}, getBBox(this.props.selectables[hovering]), {
      stopHover: this.props.stopHover
    })), dragging && React.createElement(DragRect, dragRect));
  }

}

_defineProperty(SVGRoot, "propTypes", {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  selectables: PropTypes.arrayOf(PropTypes.object),
  selectIndices: PropTypes.func.isRequired,
  stopHover: PropTypes.func.isRequired,
  hovering: PropTypes.number
});

_defineProperty(SVGRoot, "defaultProps", {
  hovering: -1
});

export const styles = {
  backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5' + 'vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0' + 'PSIyMCIgZmlsbD0iI2ZmZiI+PC9yZWN0Pgo8cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9I' + 'iNGN0Y3RjciPjwvcmVjdD4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIG' + 'ZpbGw9IiNGN0Y3RjciPjwvcmVjdD4KPC9zdmc+)',
  backgroundSize: 'auto'
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvU1ZHUm9vdC5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsIkNvbXBvbmVudCIsImNyZWF0ZVJlZiIsIlByb3BUeXBlcyIsIkRyYWdSZWN0IiwiSG92ZXJSZWN0IiwiZ2V0QkJveCIsIlNWR1Jvb3QiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiZHJhZ2dpbmciLCJkcmFnT3JpZ2luIiwieCIsInkiLCJkcmFnUmVjdCIsIndpZHRoIiwiaGVpZ2h0IiwicmVjdCIsImxlZnQiLCJyaWdodCIsInRvcCIsImJvdHRvbSIsImV2ZW50Iiwic2V0U3RhdGUiLCJkcmFnSW5pdGlhdGVkIiwiY29tcHV0ZUNvb3JkaW5hdGVzIiwic3RhdGUiLCJjdXJyZW50IiwiTWF0aCIsIm1pbiIsImFicyIsInNlbGVjdGFibGVzIiwiZHJhZ2JveCIsInJlY3RUb0JveCIsInRvU2VsZWN0IiwiZm9yRWFjaCIsIm5vZGUiLCJpbmRleCIsIm5vZGVib3giLCJib3hPdmVybGFwIiwicHVzaCIsInNlbGVjdEluZGljZXMiLCJzdmdSZWYiLCJvdmVybGFwcyIsImEiLCJiIiwibWF4IiwibW91c2VFdmVudCIsImRpbSIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImNsaWVudFgiLCJjbGllbnRZIiwicmVuZGVyIiwiaG92ZXJpbmciLCJzdHlsZXMiLCJzdGFydERyYWciLCJoYW5kbGVEcmFnIiwic3RvcERyYWciLCJjaGlsZHJlbiIsInN0b3BIb3ZlciIsIm51bWJlciIsImlzUmVxdWlyZWQiLCJhcnJheU9mIiwib2JqZWN0IiwiZnVuYyIsImJhY2tncm91bmRJbWFnZSIsImJhY2tncm91bmRTaXplIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBT0EsS0FBUCxJQUFnQkMsU0FBaEIsRUFBMkJDLFNBQTNCLFFBQTRDLE9BQTVDO0FBQ0EsT0FBT0MsU0FBUCxNQUFzQixZQUF0QjtBQUVBLE9BQU9DLFFBQVAsTUFBcUIsdUJBQXJCO0FBQ0EsT0FBT0MsU0FBUCxNQUFzQix3QkFB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bEIsT0FTRyxLQUFLaEQsS0FBTCxDQUFXaUQsUUFUZCxFQVdHLENBQUNoRCxRQUFELElBQWEyQyxhQUFhLENBQUMsQ0FBM0IsSUFDQyxvQkFBQyxTQUFELGVBQ00vQyxRQUFRLEtBQUtHLEtBQUwsQ0FBV3NCLFdBQVgsQ0FBdUJzQixRQUF2QixDQUFSLENBRE47QUFFRSxpQkFBVyxLQUFLNUMsS0FBTCxDQUFXa0Q7QUFGeEIsT0FaSixFQWtCR2pELFlBQVksb0JBQUMsUUFBRCxFQUFjSSxRQUFkLENBbEJmLENBREY7QUFzQkQ7O0FBako0Qzs7Z0JBQTFCUCxPLGVBQ0E7QUFDakJRLFNBQU9aLFVBQVV5RCxNQUFWLENBQWlCQyxVQURQO0FBRWpCN0MsVUFBUWIsVUFBVXlELE1BQVYsQ0FBaUJDLFVBRlI7QUFHakI5QixlQUFhNUIsVUFBVTJELE9BQVYsQ0FBa0IzRCxVQUFVNEQsTUFBNUIsQ0FISTtBQUlqQnRCLGlCQUFldEMsVUFBVTZELElBQVYsQ0FBZUgsVUFKYjtBQUtqQkYsYUFBV3hELFVBQVU2RCxJQUFWLENBQWVILFVBTFQ7QUFNakJSLFlBQVVsRCxVQUFVeUQ7QUFOSCxDOztnQkFEQXJELE8sa0JBVUc7QUFDcEI4QyxZQUFVLENBQUM7QUFEUyxDOztBQTBJeEIsT0FBTyxNQUFNQyxTQUFTO0FBQ3BCVyxtQkFBaUIsc0VBQ2IsbUZBRGEsR0FFYixtRkFGYSxHQUdiLG1GQUhhLEdBSWIseUNBTGdCO0FBTXBCQyxrQkFBZ0I7QUFOSSxDQUFmIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCwgY3JlYXRlUmVmIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuaW1wb3J0IERyYWdSZWN0IGZyb20gJy4vaW5kaWNhdG9ycy9EcmFnUmVjdCc7XG5pbXBvcnQgSG92ZXJSZWN0IGZyb20gJy4vaW5kaWNhdG9ycy9Ib3ZlclJlY3QnO1xuaW1wb3J0IHsgZ2V0QkJveCB9IGZyb20gJy4vQ29tbW9uJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU1ZHUm9vdCBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBzZWxlY3RhYmxlczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm9iamVjdCksXG4gICAgc2VsZWN0SW5kaWNlczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBzdG9wSG92ZXI6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgaG92ZXJpbmc6IFByb3BUeXBlcy5udW1iZXJcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgaG92ZXJpbmc6IC0xXG4gIH1cblxuICBzdGF0ZSA9IHtcbiAgICBkcmFnZ2luZzogZmFsc2UsXG4gICAgZHJhZ09yaWdpbjoge1xuICAgICAgeDogMCxcbiAgICAgIHk6IDBcbiAgICB9LFxuICAgIGRyYWdSZWN0OiB7XG4gICAgICB4OiAwLFxuICAgICAgeTogMCxcbiAgICAgIHdpZHRoOiAwLFxuICAgICAgaGVpZ2h0OiAwXG4gICAgfVxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdmdSZWYgPSBjcmVhdGVSZWYoKTtcbiAgfVxuXG4gIG92ZXJsYXBzKGEsIGIsIHgsIHkpIHtcbiAgICByZXR1cm4gTWF0aC5tYXgoYSwgeCkgPCBNYXRoLm1pbihiLCB5KTtcbiAgfVxuXG4gIGJveE92ZXJsYXAoYSwgYikge1xuICAgIHJldHVybiB0aGlzLm92ZXJsYXBzKGEubGVmdCwgYS5yaWdodCwgYi5sZWZ0LCBiLnJpZ2h0KSAmJlxuICAgICAgdGhpcy5vdmVybGFwcyhhLnRvcCwgYS5ib3R0b20sIGIudG9wLCBiLmJvdHRvbSlcbiAgfVxuXG4gIHJlY3RUb0JveCA9IHJlY3QgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICBsZWZ0OiByZWN0LngsXG4gICAgICByaWdodDogcmVjdC54ICsgcmVjdC53aWR0aCxcbiAgICAgIHRvcDogcmVjdC55LFxuICAgICAgYm90dG9tOiByZWN0LnkgKyByZWN0LmhlaWdodFxuICAgIH07XG4gIH1cblxuICBjb21wdXRlQ29vcmRpbmF0ZXMobW91c2VFdmVudCkge1xuICAgIGNvbnN0IGRpbSA9IHRoaXMuc3ZnUmVmLmN1cnJlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgeDogbW91c2VFdmVudC5jbGllbnRYIC0gZGltLmxlZnQsXG4gICAgICB5OiBtb3VzZUV2ZW50LmNsaWVudFkgLSBkaW0udG9wXG4gICAgfVxuICB9XG5cbiAgc3RhcnREcmFnID0gKGV2ZW50KSA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBkcmFnSW5pdGlhdGVkOiB0cnVlLFxuICAgICAgZHJhZ09yaWdpbjogdGhpcy5jb21wdXRlQ29vcmRpbmF0ZXMoZXZlbnQpXG4gICAgfSk7XG4gIH1cblxuICBoYW5kbGVEcmFnID0gKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgeyBkcmFnSW5pdGlhdGVkLCBkcmFnT3JpZ2luIH0gPSB0aGlzLnN0YXRlO1xuICAgIGxldCB7IGRyYWdnaW5nIH0gPSB0aGlzLnN0YXRlO1xuXG4gICAgaWYgKGRyYWdJbml0aWF0ZWQgJiYgIWRyYWdnaW5nKSB7XG4gICAgICBkcmFnZ2luZyA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGRyYWdnaW5nKSB7XG4gICAgICBjb25zdCBjdXJyZW50ID0gdGhpcy5jb21wdXRlQ29vcmRpbmF0ZXMoZXZlbnQpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGRyYWdnaW5nOiB0cnVlLFxuICAgICAgICBkcmFnUmVjdDoge1xuICAgICAgICAgIHg6IE1hdGgubWluKGN1cnJlbnQueCwgZHJhZ09yaWdpbi54KSxcbiAgICAgICAgICB5OiBNYXRoLm1pbihjdXJyZW50LnksIGRyYWdPcmlnaW4ueSksXG4gICAgICAgICAgd2lkdGg6IE1hdGguYWJzKGN1cnJlbnQueCAtIGRyYWdPcmlnaW4ueCksXG4gICAgICAgICAgaGVpZ2h0OiBNYXRoLmFicyhjdXJyZW50LnkgLSBkcmFnT3JpZ2luLnkpXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHN0b3BEcmFnID0gKCkgPT4ge1xuICAgIGNvbnN0IHsgZHJhZ2dpbmcsIGRyYWdSZWN0IH0gPSB0aGlzLnN0YXRlO1xuXG4gICAgaWYgKGRyYWdnaW5nKSB7XG4gICAgICBjb25zdCB7IHNlbGVjdGFibGVzIH0gPSB0aGlzLnByb3BzO1xuICAgICAgY29uc3QgZHJhZ2JveCA9IHRoaXMucmVjdFRvQm94KGRyYWdSZWN0KTtcbiAgICAgIGNvbnN0IHRvU2VsZWN0ID0gW107XG4gICAgICBcbiAgICAgIHNlbGVjdGFibGVzLmZvckVhY2goKG5vZGUsIGluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IG5vZGVib3ggPSBnZXRCQm94KG5vZGUpO1xuICAgICAgICBpZiAodGhpcy5ib3hPdmVybGFwKGRyYWdib3gsIHRoaXMucmVjdFRvQm94KG5vZGVib3gpKSkge1xuICAgICAgICAgIHRvU2VsZWN0LnB1c2goaW5kZXgpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5wcm9wcy5zZWxlY3RJbmRpY2VzKHRvU2VsZWN0KTtcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGRyYWdnaW5nOiBmYWxzZSxcbiAgICAgIGRyYWdJbml0aWF0ZWQ6IGZhbHNlLFxuICAgICAgZHJhZ1JlY3Q6IHtcbiAgICAgICAgeDogMCxcbiAgICAgICAgeTogMCxcbiAgICAgICAgd2lkdGg6IDAsXG4gICAgICAgIGhlaWdodDogMFxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCwgaG92ZXJpbmcgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgeyBkcmFnZ2luZywgZHJhZ1JlY3QgfSA9IHRoaXMuc3RhdGU7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPHN2Z1xuICAgICAgICByZWY9e3RoaXMuc3ZnUmVmfVxuICAgICAgICB3aWR0aD17d2lkdGh9XG4gICAgICAgIGhlaWdodD17aGVpZ2h0fVxuICAgICAgICBzdHlsZT17c3R5bGVzfVxuICAgICAgICBvbk1vdXNlRG93bj17dGhpcy5zdGFydERyYWd9XG4gICAgICAgIG9uTW91c2VNb3ZlPXt0aGlzLmhhbmRsZURyYWd9XG4gICAgICAgIG9uTW91c2VVcD17dGhpcy5zdG9wRHJhZ31cbiAgICAgID5cbiAgICAgICAge3RoaXMucHJvcHMuY2hpbGRyZW59XG5cbiAgICAgICAgeyFkcmFnZ2luZyAmJiBob3ZlcmluZyAhPT0gLTEgJiYgKFxuICAgICAgICAgIDxIb3ZlclJlY3RcbiAgICAgICAgICAgIHsuLi5nZXRCQm94KHRoaXMucHJvcHMuc2VsZWN0YWJsZXNbaG92ZXJpbmddKX1cbiAgICAgICAgICAgIHN0b3BIb3Zlcj17dGhpcy5wcm9wcy5zdG9wSG92ZXJ9XG4gICAgICAgICAgLz5cbiAgICAgICAgKX1cbiAgICAgICAgXG4gICAgICAgIHtkcmFnZ2luZyAmJiA8RHJhZ1JlY3Qgey4uLmRyYWdSZWN0fSAvPn1cbiAgICAgIDwvc3ZnPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHN0eWxlcyA9IHtcbiAgYmFja2dyb3VuZEltYWdlOiAndXJsKGRhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsUEhOMlp5QjRiV3h1Y3owaWFIUjBjRG92TDNkM2R5NTNNeTUnXG4gICAgKyAndmNtY3ZNakF3TUM5emRtY2lJSGRwWkhSb1BTSXlNQ0lnYUdWcFoyaDBQU0l5TUNJK0NqeHlaV04wSUhkcFpIUm9QU0l5TUNJZ2FHVnBaMmgwJ1xuICAgICsgJ1BTSXlNQ0lnWm1sc2JEMGlJMlptWmlJK1BDOXlaV04wUGdvOGNtVmpkQ0IzYVdSMGFEMGlNVEFpSUdobGFXZG9kRDBpTVRBaUlHWnBiR3c5SSdcbiAgICArICdpTkdOMFkzUmpjaVBqd3ZjbVZqZEQ0S1BISmxZM1FnZUQwaU1UQWlJSGs5SWpFd0lpQjNhV1IwYUQwaU1UQWlJR2hsYVdkb2REMGlNVEFpSUcnXG4gICAgKyAnWnBiR3c5SWlOR04wWTNSamNpUGp3dmNtVmpkRDRLUEM5emRtYyspJyxcbiAgYmFja2dyb3VuZFNpemU6ICdhdXRvJ1xufTtcbiJdfQ==