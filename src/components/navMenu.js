import { Link } from 'gatsby'
import * as React from 'react'
import { Nav } from 'react-bootstrap'
import { GoMarkGithub } from "react-icons/go"
import { toUrl } from '../util/util'


const NavMenu = ({ useClass = "" }) => {
    const linkStyle = {
        marginTop: "auto", marginBottom: "auto",
        width: "fit-content", height: "fit-content",
        padding: useClass !== "" ? 8 : "default",
    }

    return (
        <Nav className={useClass}>
            <Nav.Link style={linkStyle} as={Link} to={toUrl("/texts")} key="texts" >
                Texts
            </Nav.Link>
            <Nav.Link style={linkStyle} as={Link} to={toUrl("/dictionary")} key="dictionary">
                Dictionary
            </Nav.Link>
            <Nav.Link style={linkStyle} as={Link} to={toUrl("/about")} key="about">
                About
            </Nav.Link>
            <Nav.Link style={linkStyle} as={Link} to={toUrl("/issues")} key="issues">
                Issues?
            </Nav.Link>
            <Nav.Link style={linkStyle}
                href="https://github.com/pmarathe25/Project-Vyasa" target="_blank"
                rel="noreferrer" keyName="github"
            >
                <GoMarkGithub size={27} />
            </Nav.Link>
        </Nav>
    );
}


export default NavMenu;