import React, { Component } from 'react';
import {MostUsedColor} from './Interfaces'


interface ColorTableProps {
  colors: MostUsedColor[];
  title:string
}

interface ColorTableState {}

class ColorTable extends Component<ColorTableProps, ColorTableState> {
  constructor(props: ColorTableProps) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>{this.props.title}</h1>
        <table className="color-table">
          <thead>
            <tr>
              <th>Platz</th>
              <th>Color</th>
              <th>Hex-Code</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {this.props.colors.map((color, index) => (
              <tr key={color.color}>
                <td>{index + 1}.</td>
                <td style={{ backgroundColor: color.color }}></td>
                <td>{color.color}</td>
                <td>{color.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default ColorTable;
