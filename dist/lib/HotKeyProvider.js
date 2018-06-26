function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { HotKeys } from 'react-hotkeys';
export default class HotKeyProvider extends Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "handlers", {
      multiSelectOn: () => this.props.setMultiSelect(true),
      multiSelectOff: () => this.props.setMultiSelect(false)
    });

    _defineProperty(this, "map", {
      multiSelectOn: {
        sequence: 'ctrl',
        action: 'keydown'
      },
      multiSelectOff: {
        sequence: 'ctrl',
        action: 'keyup'
      }
    });
  }

  render() {
    const {
      width,
      height
    } = this.props;
    const hotKeyStyle = {
      width,
      height,
      outline: 0
    };
    return React.createElement(HotKeys, {
      style: hotKeyStyle,
      keyMap: this.map,
      handlers: this.handlers,
      focused: true,
      attach: window,
      onMouseDown: evt => evt.preventDefault()
    }, this.props.children);
  }

}

_defineProperty(HotKeyProvider, "propTypes", {
  width: PropTypes.number,
  height: PropTypes.number,
  setMultiSelect: PropTypes.func.isRequired
});

_defineProperty(HotKeyProvider, "defaultProps", {
  width: '',
  height: ''
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvSG90S2V5UHJvdmlkZXIuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJDb21wb25lbnQiLCJQcm9wVHlwZXMiLCJIb3RLZXlzIiwiSG90S2V5UHJvdmlkZXIiLCJtdWx0aVNlbGVjdE9uIiwicHJvcHMiLCJzZXRNdWx0aVNlbGVjdCIsIm11bHRpU2VsZWN0T2ZmIiwic2VxdWVuY2UiLCJhY3Rpb24iLCJyZW5kZXIiLCJ3aWR0aCIsImhlaWdodCIsImhvdEtleVN0eWxlIiwib3V0bGluZSIsIm1hcCIsImhhbmRsZXJzIiwid2luZG93IiwiZXZ0IiwicHJldmVudERlZmF1bHQiLCJjaGlsZHJlbiIsIm51bWJlciIsImZ1bmMiLCJpc1JlcXVpcmVkIl0sIm1hcHBpbmdzIjoiOztBQUFBLE9BQU9BLEtBQVAsSUFBZ0JDLFNBQWhCLFFBQWlDLE9BQWpDO0FBQ0EsT0FBT0MsU0FBUCxNQUFzQixZQUF0QjtBQUNBLFNBQVNDLE9BQVQsUUFBd0IsZUFBeEI7QUFFQSxlQUFlLE1BQU1DLGNBQU4sU0FBNkJILFNBQTdCLENBQXVDO0FBQUE7QUFBQTs7QUFBQSxzQ0FZekM7QUFDVEkscUJBQWUsTUFBTSxLQUFLQyxLQUFMLENBQVdDLGNBQVgsQ0FBMEIsSUFBMUIsQ0FEWjtBQUVUQyxzQkFBZ0IsTUFBTSxLQUFLRixLQUFMLENBQVdDLGNBQVgsQ0FBMEIsS0FBMUI7QUFGYixLQVp5Qzs7QUFBQSxpQ0FpQjlDO0FBQ0pGLHFCQUFlO0FBQUVJLGtCQUFVLE1BQVo7QUFBb0JDLGdCQUFRO0FBQTVCLE9BRFg7QUFFSkYsc0JBQWdCO0FBQUVDLGtCQUFVLE1BQVo7QUFBb0JDLGdCQUFRO0FBQTVCO0FBRlosS0FqQjhDO0FBQUE7O0FBc0JwREMsV0FBUztBQUNQLFVBQU07QUFBRUMsV0FBRjtBQUFTQztBQUFULFFBQW9CLEtBQUtQLEtBQS9CO0FBQ0EsVUFBTVEsY0FBYztBQUNsQkYsV0FEa0I7QUFFbEJDLFlBRmtCO0FBR2xCRSxlQUFTO0FBSFMsS0FBcEI7QUFNQSxXQUNFLG9CQUFDLE9BQUQ7QUFDRSxhQUFPRCxXQURUO0FBRUUsY0FBUSxLQUFLRSxHQUZmO0FBR0UsZ0JBQVUsS0FBS0MsUUFIakI7QUFJRSxtQkFKRjtBQUtFLGNBQVFDLE1BTFY7QUFNRSxtQkFBY0MsR0FBRCxJQUFTQSxJQUFJQyxjQUFKO0FBTnhCLE9BUUcsS0FBS2QsS0FBTCxDQUFXZSxRQVJkLENBREY7QUFZRDs7QUExQ21EOztnQkFBakNqQixjLGVBQ0E7QUFDakJRLFNBQU9WLFVBQVVvQixNQURBO0FBRWpCVCxVQUFRWCxVQUFVb0IsTUFGRDtBQUdqQmYsa0JBQWdCTCxVQUFVcUIsSUFBVixDQUFlQztBQUhkLEM7O2dCQURBcEIsYyxrQkFPRztBQUNwQlEsU0FBTyxFQURhO0FBRXBCQyxVQUFRO0FBRlksQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHsgSG90S2V5cyB9IGZyb20gJ3JlYWN0LWhvdGtleXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIb3RLZXlQcm92aWRlciBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIHNldE11bHRpU2VsZWN0OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIHdpZHRoOiAnJyxcbiAgICBoZWlnaHQ6ICcnXG4gIH1cblxuICBoYW5kbGVycyA9IHtcbiAgICBtdWx0aVNlbGVjdE9uOiAoKSA9PiB0aGlzLnByb3BzLnNldE11bHRpU2VsZWN0KHRydWUpLFxuICAgIG11bHRpU2VsZWN0T2ZmOiAoKSA9PiB0aGlzLnByb3BzLnNldE11bHRpU2VsZWN0KGZhbHNlKVxuICB9O1xuXG4gIG1hcCA9IHtcbiAgICBtdWx0aVNlbGVjdE9uOiB7IHNlcXVlbmNlOiAnY3RybCcsIGFjdGlvbjogJ2tleWRvd24nIH0sXG4gICAgbXVsdGlTZWxlY3RPZmY6IHsgc2VxdWVuY2U6ICdjdHJsJywgYWN0aW9uOiAna2V5dXAnIH1cbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IGhvdEtleVN0eWxlID0ge1xuICAgICAgd2lkdGgsXG4gICAgICBoZWlnaHQsXG4gICAgICBvdXRsaW5lOiAwXG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICA8SG90S2V5c1xuICAgICAgICBzdHlsZT17aG90S2V5U3R5bGV9XG4gICAgICAgIGtleU1hcD17dGhpcy5tYXB9XG4gICAgICAgIGhhbmRsZXJzPXt0aGlzLmhhbmRsZXJzfVxuICAgICAgICBmb2N1c2VkXG4gICAgICAgIGF0dGFjaD17d2luZG93fVxuICAgICAgICBvbk1vdXNlRG93bj17KGV2dCkgPT4gZXZ0LnByZXZlbnREZWZhdWx0KCl9XG4gICAgICA+XG4gICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxuICAgICAgPC9Ib3RLZXlzPlxuICAgICk7XG4gIH1cbn1cbiJdfQ==