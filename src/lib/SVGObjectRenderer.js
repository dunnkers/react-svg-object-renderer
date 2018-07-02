import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';

import SelectRect from './indicators/SelectRect';
import Surface from './Surface';
import HotKeyProvider from './HotKeyProvider';
import SVGRoot from './SVGRoot';
import { getBBox } from './Common';

export default class SVGObjectRenderer extends Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    objects: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.string.isRequired
    })),
    objectTypes: PropTypes.objectOf(PropTypes.func),
    onSelectionChange: PropTypes.func,
    multipleTypeSelection: PropTypes.bool,
    children: PropTypes.node
  }

  static defaultProps = {
    width: 400,
    height: 400,
    objects: [],
    objectTypes: {},
    onSelectionChange: () => {},
    multipleTypeSelection: false
  }

  state = {
    hovering: -1,
    selectedObjects: new Set(),
    multiSelect: false,
    selectedType: null,
    children: null
  }

  constructor(props) {
    super(props);
    this.objectRefs = Object.entries(props.objects).map(() => createRef());
  }

  startHovering = (index) => {
    this.setState({ hovering: index });
  }

  stopHovering = () => this.setState({ hovering: -1 })

  selectObjects = indices => {
    const newSelection = new Set(indices);
    this.setState({ selectedObjects: newSelection });

    // ⚡ notify outside world of selection change. convert set to array.
    this.props.onSelectionChange(Array.from(newSelection));
  }

  clickSelect = (index, event) => {
    event.preventDefault(); // 💡 Prevents user selecting any svg text

    const newSelection = this.computeSelection(index);

    this.setState({
      selectedObjects: newSelection
    });

    // ⚡ notify outside world of selection change. convert set to array.
    this.props.onSelectionChange(Array.from(newSelection));
  }

  isSelectedType = (index) =>
    this.props.objects[index].type === this.state.selectedType;

  renderObject = (object, index) => {
    const { objectTypes } = this.props;
    const ObjectComponent = objectTypes[object.type];

    return (
      <ObjectComponent
        {...object}
        key={index}
        nodeRef={this.objectRefs[index]}
        onMouseOver={() => this.startHovering(index)}
        onMouseDown={event => this.clickSelect(index, event)}
        onMouseLeave={this.stopHovering}
      />
    );
  }

  multiSelect(index, objects) {
    if (objects.has(index)) { // remove from selection
      objects.delete(index);
      return objects;
    // add to selection only if allowed --
    } else if (this.isSelectedType(index) || this.props.multipleTypeSelection) {
      return objects.add(index);
    } else {
      return objects;
    }
  }

  singleSelect(index, objects) {
    if (objects.has(index)) { // deselect
      objects.clear();
      return objects;
    } else { // select
      objects.clear();
      this.setState({
        selectedType: this.props.objects[index].type
      });
      return objects.add(index);
    }
  }

  computeSelection(index) {
    const { selectedObjects, multiSelect } = this.state;

    if (multiSelect && selectedObjects.size > 0) {
      return this.multiSelect(index, selectedObjects);
    } else {
      return this.singleSelect(index, selectedObjects);
    }
  }

  deselectAll = () => {
    if (this.state.selectedObjects.size > 0) {
      const selectedObjects = new Set();

      this.setState({ selectedObjects });

      // ⚡ notify outside world of selection change. convert set to array.
      this.props.onSelectionChange(Array.from(selectedObjects));
    }
  }

  computeHoverState = () => {
    const { selectedObjects, multiSelect, hovering } = this.state;
    const { multipleTypeSelection } = this.props;

    // don't render when object already selected
    if (hovering === -1 || selectedObjects.has(hovering)) {
      return -1;
    }

    // don't render when selecting objects of same type
    if (selectedObjects.size > 0 && multiSelect) {
      return (this.isSelectedType(hovering) || multipleTypeSelection) ?
        hovering : -1;
    }

    return hovering;
  }

  render() {
    const { width, height, objects } = this.props;
    const dimensions = { width, height };
    const { selectedObjects } = this.state;
    const selectedObjectsArray = [...selectedObjects]; // Convert Set to Array

    return (
      <HotKeyProvider {...dimensions}
        setMultiSelect={multiSelect => this.setState({ multiSelect })}
      >
        <SVGRoot {...dimensions}
          selectables={this.objectRefs}
          selectIndices={indices => this.selectObjects(indices)}
          hovering={this.computeHoverState()}
          stopHover={this.stopHovering}
        >
          <Surface deselectAll={this.deselectAll}/>

          {objects.map(this.renderObject)}

          {this.props.children}

          {selectedObjectsArray.map((objectIndex, index) => (
            <SelectRect
              {...getBBox(this.objectRefs[objectIndex])}
              key={index}
              select={(event) => this.clickSelect(objectIndex, event)}
            />
          ))}
        </SVGRoot>
      </HotKeyProvider>
    );
  }
}

