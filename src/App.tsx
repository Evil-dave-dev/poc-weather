import React, { useState } from 'react';
import './App.css';
import { Weather } from './view/Weather';
import Button from './view/Button';

function App() {

  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
      setRefreshKey(prevKey => prevKey + 1)
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <Button name="actualiser" onRefresh={handleRefresh}/>
        <Weather key={refreshKey}/>
      </header>
      <body>
      </body>
    </div>
  );
}

export default App;
