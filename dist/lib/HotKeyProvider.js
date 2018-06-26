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
      width
    } = this.props;
    const hotKeyStyle = {
      width,
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
  setMultiSelect: PropTypes.func.isRequired
});

_defineProperty(HotKeyProvider, "defaultProps", {
  width: ''
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvSG90S2V5UHJvdmlkZXIuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJDb21wb25lbnQiLCJQcm9wVHlwZXMiLCJIb3RLZXlzIiwiSG90S2V5UHJvdmlkZXIiLCJtdWx0aVNlbGVjdE9uIiwicHJvcHMiLCJzZXRNdWx0aVNlbGVjdCIsIm11bHRpU2VsZWN0T2ZmIiwic2VxdWVuY2UiLCJhY3Rpb24iLCJyZW5kZXIiLCJ3aWR0aCIsImhvdEtleVN0eWxlIiwib3V0bGluZSIsIm1hcCIsImhhbmRsZXJzIiwid2luZG93IiwiZXZ0IiwicHJldmVudERlZmF1bHQiLCJjaGlsZHJlbiIsIm51bWJlciIsImZ1bmMiLCJpc1JlcXVpcmVkIl0sIm1hcHBpbmdzIjoiOztBQUFBLE9BQU9BLEtBQVAsSUFBZ0JDLFNBQWhCLFFBQWlDLE9BQWpDO0FBQ0EsT0FBT0MsU0FBUCxNQUFzQixZQUF0QjtBQUNBLFNBQVNDLE9BQVQsUUFBd0IsZUFBeEI7QUFFQSxlQUFlLE1BQU1DLGNBQU4sU0FBNkJILFNBQTdCLENBQXVDO0FBQUE7QUFBQTs7QUFBQSxzQ0FVekM7QUFDVEkscUJBQWUsTUFBTSxLQUFLQyxLQUFMLENBQVdDLGNBQVgsQ0FBMEIsSUFBMUIsQ0FEWjtBQUVUQyxzQkFBZ0IsTUFBTSxLQUFLRixLQUFMLENBQVdDLGNBQVgsQ0FBMEIsS0FBMUI7QUFGYixLQVZ5Qzs7QUFBQSxpQ0FlOUM7QUFDSkYscUJBQWU7QUFBRUksa0JBQVUsTUFBWjtBQUFvQkMsZ0JBQVE7QUFBNUIsT0FEWDtBQUVKRixzQkFBZ0I7QUFBRUMsa0JBQVUsTUFBWjtBQUFvQkMsZ0JBQVE7QUFBNUI7QUFGWixLQWY4QztBQUFBOztBQW9CcERDLFdBQVM7QUFDUCxVQUFNO0FBQUVDO0FBQUYsUUFBWSxLQUFLTixLQUF2QjtBQUNBLFVBQU1PLGNBQWM7QUFDbEJELFdBRGtCO0FBRWxCRSxlQUFTO0FBRlMsS0FBcEI7QUFLQSxXQUNFLG9CQUFDLE9BQUQ7QUFDRSxhQUFPRCxXQURUO0FBRUUsY0FBUSxLQUFLRSxHQUZmO0FBR0UsZ0JBQVUsS0FBS0MsUUFIakI7QUFJRSxtQkFKRjtBQUtFLGNBQVFDLE1BTFY7QUFNRSxtQkFBY0MsR0FBRCxJQUFTQSxJQUFJQyxjQUFKO0FBTnhCLE9BUUcsS0FBS2IsS0FBTCxDQUFXYyxRQVJkLENBREY7QUFZRDs7QUF2Q21EOztnQkFBakNoQixjLGVBQ0E7QUFDakJRLFNBQU9WLFVBQVVtQixNQURBO0FBRWpCZCxrQkFBZ0JMLFVBQVVvQixJQUFWLENBQWVDO0FBRmQsQzs7Z0JBREFuQixjLGtCQU1HO0FBQ3BCUSxTQUFPO0FBRGEsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHsgSG90S2V5cyB9IGZyb20gJ3JlYWN0LWhvdGtleXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIb3RLZXlQcm92aWRlciBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgc2V0TXVsdGlTZWxlY3Q6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgd2lkdGg6ICcnXG4gIH1cblxuICBoYW5kbGVycyA9IHtcbiAgICBtdWx0aVNlbGVjdE9uOiAoKSA9PiB0aGlzLnByb3BzLnNldE11bHRpU2VsZWN0KHRydWUpLFxuICAgIG11bHRpU2VsZWN0T2ZmOiAoKSA9PiB0aGlzLnByb3BzLnNldE11bHRpU2VsZWN0KGZhbHNlKVxuICB9O1xuXG4gIG1hcCA9IHtcbiAgICBtdWx0aVNlbGVjdE9uOiB7IHNlcXVlbmNlOiAnY3RybCcsIGFjdGlvbjogJ2tleWRvd24nIH0sXG4gICAgbXVsdGlTZWxlY3RPZmY6IHsgc2VxdWVuY2U6ICdjdHJsJywgYWN0aW9uOiAna2V5dXAnIH1cbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyB3aWR0aCB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBob3RLZXlTdHlsZSA9IHtcbiAgICAgIHdpZHRoLFxuICAgICAgb3V0bGluZTogMFxuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPEhvdEtleXNcbiAgICAgICAgc3R5bGU9e2hvdEtleVN0eWxlfVxuICAgICAgICBrZXlNYXA9e3RoaXMubWFwfVxuICAgICAgICBoYW5kbGVycz17dGhpcy5oYW5kbGVyc31cbiAgICAgICAgZm9jdXNlZFxuICAgICAgICBhdHRhY2g9e3dpbmRvd31cbiAgICAgICAgb25Nb3VzZURvd249eyhldnQpID0+IGV2dC5wcmV2ZW50RGVmYXVsdCgpfVxuICAgICAgPlxuICAgICAgICB7dGhpcy5wcm9wcy5jaGlsZHJlbn1cbiAgICAgIDwvSG90S2V5cz5cbiAgICApO1xuICB9XG59XG4iXX0=