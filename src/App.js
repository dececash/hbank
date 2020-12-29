import './App.css';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

import Home from './pages/home/home';

import My from './pages/my/my';
import Register from './pages/register/register';
import Ratesetting from './pages/ratesetting/ratesetting';
import Withdrawlist from './pages/withdrawlist/withdrawlist';
import Userlist from './pages/userlist/userlist';
import Bank from './pages/bank/bank';

import Financial from './pages/financial/financial';

import Assets from './pages/assets/assets';
import Assetsdetail from './pages/assets/assetsdetail';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/home" component={Home} />

          <Route path="/financial" component={Financial} />

          <Route path="/my" component={My} />
          <Route path="/register" component={Register} />
          <Route path="/ratesetting" component={Ratesetting} />
          <Route path="/withdrawlist" component={Withdrawlist} />
          <Route path="/userlist" component={Userlist} />
          <Route path="/bank" component={Bank} />

          <Route path="/assets" component={Assets} />
          <Route path="/assetsdetail" component={Assetsdetail} />

          <Route exact path="/" component={Assets} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
