import Chart from './ColorChart';
import PersonTable from './PersonChart';
import React from 'react';
import { MostUsedColor, MostActiveUser } from './Interfaces';
import './Chart.css';
import axios from 'axios';

const API_URL = '/stats';

async function fetchMostUsedColor(): Promise<MostUsedColor[]> {
  const response = await axios.get(`${API_URL}/most-used-colors`);
  return response.data;
}

async function fetchMostActiveUser(): Promise<MostActiveUser[]> {
  const response = await axios.get(`${API_URL}/most-active-users`);
  return response.data;
}

function App() {
  const [mostUsedColors, setMostUsedColors] = React.useState<MostUsedColor[]>([]);
  const [mostActiveUsers, setMostActiveUsers] = React.useState<MostActiveUser[]>([]);

  function reloadStats():void {
    fetchMostUsedColor().then((colors) => setMostUsedColors(colors));
    fetchMostActiveUser().then((users) => setMostActiveUsers(users));
  }

  React.useEffect(() => {
    reloadStats();
  }, []);
  

  return (
    <>
      <div className='container'>
        <h1 className='ueberschrift'>Statistik</h1>
      </div>
      <div className='container'>
        <Chart title='Meist genutzte Farben' colors={mostUsedColors} />
        <PersonTable title='Nutzer' data={mostActiveUsers} />
      </div>
      <div className='container'>
        <div className='unten'>
        <button onClick={reloadStats}>Neu Laden</button>
        </div>
      </div>
    </>
  );
}

export default App;
