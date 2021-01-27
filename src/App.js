import './App.css';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

import Home from './pages/home/home';

import My from './pages/my/my';
import Register from './pages/register/register';
import Ratesetting from './pages/ratesetting/ratesetting';
import Withdrawlist from './pages/withdrawlist/withdrawlist';
import Userlist from './pages/userlist/userlist';
import Bank from './pages/bank/bank';
import Rechange from './pages/rechange/rechange';

import Financial from './pages/financial/financial';
import Worldshare from './pages/worldshare/worldshare';
import Worldshareapp from './pages/worldshare/worldshareapp';
import Investmentlist from './pages/worldshare/investmentlist';
import Recommendlist from './pages/worldshare/recommendlist';

import Assets from './pages/assets/assets';
import Assetsdetail from './pages/assets/assetsdetail';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/home" component={Home} />

          <Route path="/financial" component={Financial} />
          <Route path="/worldshare" component={Worldshare} />
          <Route path="/worldshareapp" component={Worldshareapp} />
          <Route path="/investmentlist" component={Investmentlist} />
          <Route path="/recommendlist" component={Recommendlist} />

          <Route path="/my" component={My} />
          <Route path="/register" component={Register} />
          <Route path="/ratesetting" component={Ratesetting} />
          <Route path="/withdrawlist" component={Withdrawlist} />
          <Route path="/userlist" component={Userlist} />
          <Route path="/bank" component={Bank} />
          <Route path="/rechange" component={Rechange} />

          <Route path="/assets" component={Assets} />
          <Route path="/assetsdetail" component={Assetsdetail} />

          <Route exact path="/" component={Assets} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
