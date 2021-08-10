import { Link } from "react-router-dom"

const Menu = (props) => {
    const listLink = props.links.map(link => <li className="menu-links" key={link.name}><Link to={link.endPoint} >{link.name}</Link> </li>)
    return (<ul className="menu ">
     {listLink}
    </ul>
    );
}

export default Menu 
