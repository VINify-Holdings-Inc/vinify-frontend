"use strict";

import React from "react";
import reactCSS from "reactcss";
import { SketchPicker } from "react-color";

class ColorPicker extends React.Component {
  state = {
    displayColorPicker: false,
    color: this.props.color,
  };

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleChange = (color) => {
    this.setState({ color: color.hex });
    this.props.getColor(color.hex, this.props.title);
  };

  render() {
    const styles = reactCSS({
      default: {
        color: {
          display: 'inline-block',
          marginRight: '12px',
          width: "40px",
          height: "22px",
          borderRadius: "2px",
          border: '1px solid #000',
          backgroundColor: `${this.state.color}`,
        },
        swatch: {
          margin: "0px",
          marginTop: "9px",
          padding: "10px 12px",
          fontsize: "0.8rem",
          display: "flex",
          background: "#fff",
          borderRadius: "1px",
          boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
          cursor: "pointer",
        },
        popover: {
          position: "absolute",
          zIndex: "2",
        },
        cover: {
          position: "fixed",
          top: "0px",
          right: "0px",
          bottom: "0px",
          left: "0px",
        },
      },
    });

    return (
      <React.Fragment>
        <div style={styles.swatch} onClick={this.handleClick} tabIndex={0}>
          <span
            style={{ ...styles.color }}
          />
          <span>
            {styles.color.backgroundColor}
          </span>
        </div>
        {this.state.displayColorPicker ? (
          <div style={styles.popover}>
            <div style={styles.cover} onClick={this.handleClose} />
            <SketchPicker
              color={this.state.color}
              onChange={this.handleChange}
            />
          </div>
        ) : null}
      </React.Fragment>
    );
  }
}

export { ColorPicker };
