import { BrowserRouter, Route } from 'react-router-dom'

import { Home } from './pages/Home'
import { NovaSala } from './pages/NovaSala'
import { AuthContextProvider } from './contexts/authContext'


function App() {



  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Route path="/" exact={true} component={Home} />
        <Route path="/salas/nova" component={NovaSala} />
      </AuthContextProvider>
    </BrowserRouter>
  )
}

export default App;