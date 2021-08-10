import { Link } from 'react-router-dom';
import './App.css';
import Menu from './components/Menu'

const Header = (props) => {
    return (
        <header className="header">
            <h1><Link to="/" className="header-title">{props.name}</Link></h1>
         <Menu links={props.links}></Menu>
        </header>
    );
}



export default Header;