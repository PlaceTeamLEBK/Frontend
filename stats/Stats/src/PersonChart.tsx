import  { Component } from 'react';
import {MostActiveUser} from './Interfaces'

interface PersonTableProps {
  data: MostActiveUser[];
  title:string
}

interface PersonTableState {}

class PersonTable extends Component<PersonTableProps, PersonTableState> {
  constructor(props: PersonTableProps) {
    super(props);
  }



  
 

  render() {
    const { data, title } = this.props;
    return (
      <div>
        <h1>{title}</h1>
        <table>
          <thead>
            <tr>
              <th>Platz</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}.</td>
                <td>{item.activityScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default PersonTable;