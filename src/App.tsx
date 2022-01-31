import './App.css';
import { useState } from 'react'
import Webull from 'webull/dist'
import Login from './components/Login'
import AccountSummary from './components/AccountSummary';
import { useCookies } from 'react-cookie'
import Orders from './components/Orders'

function App() {
  const [webull, setWebull] = useState<Webull | null>(null)
  const [cookies, setCookie, removeCookie] = useCookies(['deviceId', 'accessToken', 'refreshToken', 'accountId', 'lzone', 'email'])

  return (
    <div className={`App ${webull ? "trading" : "h-screen"}`}>
        {webull == null ? 
          <Login setWebull={setWebull} setCookies={setCookie} cookies={cookies}/> : 
          <div className="flex flex-row">
            <div>
              <AccountSummary webull={webull} />
              <Orders webull={webull}></Orders>
            </div>
          </div>
        }
    </div>
  );
}

export default App;
