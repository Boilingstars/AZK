import { BrowserRouter} from "react-router-dom";
import AppRouter from "./routes/AppRouter"
import { Provider } from 'react-redux'
import {store} from "./store"
import './styles/styles.scss';
import NavBar from './components/NavBar'

function App() {

  return (
    <div>
      <div className="container">
        <Provider store={store}> 
          <BrowserRouter>
          <AppRouter/>
          </BrowserRouter>
        </Provider>
      </div>
      <NavBar/>
    </div>
  )
}

export default App
