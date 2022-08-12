import { graphql, Link, useStaticQuery } from 'gatsby'
import * as React from 'react'
import { Nav, NavDropdown } from 'react-bootstrap'
import { GoMarkGithub } from "react-icons/go"
import { useTransliterate } from './transliterationHook'
import { toUrl } from '../util/util'
import useIsMobile from '../util/responsiveness'


const query = graphql`
query {
    allTextJson {
        group(field: work) {
            nodes {
                work
                workSanskritName
                workPath: gatsbyPath(filePath: "/texts/{textJson.work}")
            }
        }
    }
}`;

const DropdownLink = ({ workSanskritName, to, eventKey }) => {
    const translitWorkSanskritName = useTransliterate(workSanskritName);

    return (
        <NavDropdown.Item as={Link} to={to} eventKey={eventKey}>
            {translitWorkSanskritName}
        </NavDropdown.Item>
    );
}

const NavMenu = ({ useClass = "" }) => {
    const linkStyle = {
        marginTop: "auto", marginBottom: "auto",
        width: "fit-content", height: "fit-content",
        padding: useClass !== "" ? 8 : "default",
    }

    const isMobile = useIsMobile();

    const { allTextJson } = useStaticQuery(query);

    return (
        <Nav className={useClass}>
            {
                isMobile
                    ?
                    < Nav.Link style={linkStyle} as={Link} to={toUrl("/texts")} key="texts" >
                        Texts
                    </Nav.Link>
                    :
                    <NavDropdown
                        title="Texts"
                        style={{ ...linkStyle, paddingLeft: "0px" }}
                        renderMenuOnMount={true}
                    >
                        {
                            allTextJson.group.map(group =>
                                <DropdownLink
                                    workSanskritName={group.nodes[0].workSanskritName}
                                    to={group.nodes[0].workPath}
                                    eventKey={group.nodes[0].work}
                                    key={group.nodes[0].work}
                                />
                            )
                        }
                    </NavDropdown >
            }

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
                rel="noreferrer" key="github"
            >
                <GoMarkGithub size={27} />
            </Nav.Link>
        </Nav>
    );
}


export default NavMenu;