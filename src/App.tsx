import './App.css';
import { useState } from 'react'
import Webull from 'webull/dist'
import Login from './components/Login'

function App() {
  const [webull, setWebull] = useState<Webull | null>(null)

  return (
    <div className="App h-screen">
        {webull == null && 
          <Login setWebull={setWebull}/>
        }
    </div>
  );
}

export default App;
