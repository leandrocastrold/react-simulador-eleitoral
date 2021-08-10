import './App.css';
import Header from './Header';
import RegisterForm from './components/RegisterForm'
import VotingForm from './components/VotingForm';
import RankingTable from './components/RankingTable'
import ConsultTable from './components/ConsultTable';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {CandidateProvider} from './CandidateContext'
import HomePage from './components/homepage';

function App() {

  return (
    <CandidateProvider> 
      <Router>
    <div>
    <Header  name ="Eleições" links={[
    {name : "Consulta", endPoint : "/consulta"}, 
    {name : "Cadastro", endPoint :"/cadastro"},
    {name : "Apuração", endPoint : "/ranking"},
    {name : "Votação", endPoint :"/votacao"}]}>
    </Header>
      
      <Switch>

      <Route exact path="/">
       <HomePage/>
      </Route>
 
      <Route exact path="/cadastro">
      <RegisterForm formType="cadastro"/>
      </Route>

      <Route exact path="/votacao">
      <VotingForm/>
      </Route>

      <Route exact path="/consulta">
      <ConsultTable/>
      </Route>

      <Route exact path="/ranking">
      <RankingTable/>
      </Route>

      <Route exact path="/atualizar">
        <RegisterForm formType = "atualizacao"/>
      </Route>

      <Route path="*">
       <h1>404 - Página não encontrada</h1>
      </Route>
    
      </Switch>
    
    </div>
    </Router>
    </CandidateProvider>
)
}

export default App;
