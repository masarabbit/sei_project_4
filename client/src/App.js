import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Home from './common/Home'
import Nav from './common/Nav'
import ShowPic from './components/ShowPic'
import CreatePic from './components/CreatePic'
import Login from './auth/Login'
import SignUp from './auth/SignUp'

function App() {

  return (
    <BrowserRouter>
      <Nav/>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/pics/new" component={CreatePic} />
        <Route path="/pics/:id" component={ShowPic} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={SignUp} />
      </Switch>
    </BrowserRouter>
  )
}

export default App














// import React from 'react'

// class App extends React.Component {
//   async componentDidMount() {
//     try {
//       const response = await fetch('/api/pics')
//       const data = await response.json()
//       console.log(data)
//     } catch (err) {
//       console.log(err)
//     }
//   }

//   render() {
//     return null
//   }
// }

// export default App
