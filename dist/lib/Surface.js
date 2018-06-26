function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
export default class Surface extends Component {
  render() {
    return React.createElement("rect", {
      opacity: "0.0",
      width: "100%",
      height: "100%",
      onMouseDown: event => {
        event.preventDefault();
        this.props.deselectAll();
      }
    });
  }

}

_defineProperty(Surface, "propTypes", {
  deselectAll: PropTypes.func.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvU3VyZmFjZS5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsIkNvbXBvbmVudCIsIlByb3BUeXBlcyIsIlN1cmZhY2UiLCJyZW5kZXIiLCJldmVudCIsInByZXZlbnREZWZhdWx0IiwicHJvcHMiLCJkZXNlbGVjdEFsbCIsImZ1bmMiLCJpc1JlcXVpcmVkIl0sIm1hcHBpbmdzIjoiOztBQUFBLE9BQU9BLEtBQVAsSUFBZ0JDLFNBQWhCLFFBQWlDLE9BQWpDO0FBQ0EsT0FBT0MsU0FBUCxNQUFzQixZQUF0QjtBQUVBLGVBQWUsTUFBTUMsT0FBTixTQUFzQkYsU0FBdEIsQ0FBZ0M7QUFLN0NHLFdBQVM7QUFDUCxXQUNFO0FBQ0UsZUFBUSxLQURWO0FBRUUsYUFBTSxNQUZSO0FBR0UsY0FBTyxNQUhUO0FBSUUsbUJBQWNDLEtBQUQsSUFBVztBQUN0QkEsY0FBTUMsY0FBTjtBQUVBLGFBQUtDLEtBQUwsQ0FBV0MsV0FBWDtBQUNEO0FBUkgsTUFERjtBQVlEOztBQWxCNEM7O2dCQUExQkwsTyxlQUNBO0FBQ2pCSyxlQUFhTixVQUFVTyxJQUFWLENBQWVDO0FBRFgsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdXJmYWNlIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBkZXNlbGVjdEFsbDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8cmVjdFxuICAgICAgICBvcGFjaXR5PVwiMC4wXCJcbiAgICAgICAgd2lkdGg9XCIxMDAlXCJcbiAgICAgICAgaGVpZ2h0PVwiMTAwJVwiXG4gICAgICAgIG9uTW91c2VEb3duPXsoZXZlbnQpID0+IHtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgdGhpcy5wcm9wcy5kZXNlbGVjdEFsbCgpO1xuICAgICAgICB9fVxuICAgICAgLz5cbiAgICApO1xuICB9XG59XG4iXX0=