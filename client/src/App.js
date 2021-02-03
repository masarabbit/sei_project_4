import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Home from './common/Home'
import Nav from './common/Nav'
import ShowPic from './components/ShowPic'
import CreatePic from './components/CreatePic'
import Login from './auth/Login'
import SignUp from './auth/SignUp'
import ShowArtistPics from './components/ShowArtistPics'
import EditPic from './components/EditPic'
import ShowFilteredPics from './components/ShowFilteredPics'
import Followers from './components/Followers'
import Following from './components/Following'
import DashBoard from './components/DashbBoard'

function App() {

  return (
    <BrowserRouter>
      <Nav/>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/followers/:id" component={Followers} />
        <Route path="/following/:id" component={Following} />
        <Route path="/pics/:id/edit" component={EditPic} />
        <Route path="/pics/:category/:page" component={ShowFilteredPics} />
        <Route exact path="/pics/new" component={CreatePic} />
        <Route path="/pics/:id" component={ShowPic} />
        <Route path="/artistpage/:id" component={ShowArtistPics} />
        <Route exact path="/dashboard" component={DashBoard} />
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
