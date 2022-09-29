import { graphql, Link, useStaticQuery } from 'gatsby'
import * as React from 'react'
import { Dropdown, Nav } from 'react-bootstrap'
import { GoMarkGithub } from "react-icons/go"
import useIsMobile from '../util/responsiveness'
import { toUrl } from '../util/util'
import { useTransliterate } from './transliterationHook'


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
        <Dropdown.Item as={Link} to={to} eventKey={eventKey}>
            {translitWorkSanskritName}
        </Dropdown.Item>
    );
}

const NavMenu = ({ useClass = "" }) => {
    const linkStyle = {
        marginTop: "auto", marginBottom: "auto",
        width: "fit-content", height: "fit-content",
        padding: useClass !== "" ? 8 : "default",
    }

    const dropdownStyle = {
        paddingTop: "2px", paddingBottom: "2px",
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
                    <Dropdown style={{
                        display: "flex",
                        border: "1px solid var(--border-color)",
                        borderRadius: "4px",
                        ...linkStyle,
                        marginRight: "8px",
                        ...dropdownStyle,
                    }}>
                        <Nav.Link as={Link} to={toUrl("/texts")} key="texts"
                            style={{
                                ...linkStyle,
                                ...dropdownStyle,
                            }}
                        >
                            Texts
                        </Nav.Link>
                        <Dropdown.Toggle as={Nav.Link} style={{
                            ...linkStyle, borderLeft: "1px solid var(--border-color)",
                            ...dropdownStyle,
                        }} />
                        <Dropdown.Menu
                            style={{ ...linkStyle, paddingLeft: "0px" }}
                            renderOnMount={true}
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
                        </Dropdown.Menu>
                    </Dropdown>
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