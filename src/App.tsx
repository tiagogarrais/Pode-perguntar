import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { Home } from './pages/Home'
import { CriarNovaSala } from './pages/CriarNovaSala'
import { AuthContextProvider } from './contexts/authContext'
import { Sala } from './pages/Sala'


function App() {



  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Switch>
          <Route path="/" exact={true}            component={Home} />
          <Route path="/salas/criarnovasala"      component={CriarNovaSala} />
          <Route path="/salas/:id"                component={Sala} />
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  )
}

export default App;