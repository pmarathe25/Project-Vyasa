import { Link } from 'gatsby'
import * as React from 'react'
import { Nav } from 'react-bootstrap'
import { GoMarkGithub } from "react-icons/go"
import { toUrl } from '../util/util'
import { navLink } from './layout.module.css'

const TopBarNavItem = (props) => {
    return (
        <Nav.Item
            style={{
                paddingBottom: props.navExpanded ? "10px" : 0,
                height: "fit-content",
                marginTop: "auto", marginBottom: "auto"
            }}
            key={props.keyName}
        >
            {props.children}
        </Nav.Item>
    );
}

const NavMenu = ({ navExpanded, useClass = "links" }) => {
    return (
        <Nav className={useClass}>
            <TopBarNavItem navExpanded={navExpanded} keyName="texts">
                <Link to={toUrl("/texts")} className={navLink}>
                    Texts
                </Link>
            </TopBarNavItem>
            <TopBarNavItem navExpanded={navExpanded} keyName="dictionary">
                <Link to={toUrl("/dictionary")} className={navLink}>
                    Dictionary
                </Link>
            </TopBarNavItem>
            <TopBarNavItem navExpanded={navExpanded} keyName="about">
                <Link to={toUrl("/about")} className={navLink}>
                    About
                </Link>
            </TopBarNavItem>
            <TopBarNavItem navExpanded={navExpanded} keyName="issues">
                <Link to={toUrl("/issues")} className={navLink}>
                    Issues?
                </Link>
            </TopBarNavItem>
            <TopBarNavItem navExpanded={navExpanded} keyName="github" >
                <a
                    href="https://github.com/pmarathe25/Project-Vyasa"
                    style={{ marginLeft: "12px" }}
                    target="_blank"
                    rel="noreferrer"
                >
                    <GoMarkGithub size={30} />
                </a>
            </TopBarNavItem>
        </Nav>
    );
}


export default NavMenu;