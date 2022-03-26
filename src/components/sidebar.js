import { graphql, Link, useStaticQuery } from 'gatsby'
import * as React from 'react'
import { Accordion, ListGroup } from 'react-bootstrap'
import toUrl from '../util/util'
import { sideBarLink, verseLink } from "./sidebar.module.css"

const accordionItemStyle = { backgroundColor: "rgb(80, 80, 80)" };
const accordionBodyStyle = { paddingTop: "8px" };

const SideBarLink = (props) => {
    return (
        <Link to={props.to} className={props.useClass} onClick={() => { props.setSideBarExpanded(false) }}>
            {props.children}
        </Link>
    );
}

// A per-chapter accordion item that expands all constituent verses, highlighting the active one.
const VersesAccordion = ({ location, baseURL, chapter, setSideBarExpanded }) => {
    const chapterURL = toUrl(`${baseURL}/${chapter.chapter}`);

    return (
        <Accordion.Item eventKey={chapter.chapter} style={accordionItemStyle}>
            <Accordion.Header>
                <SideBarLink to={chapterURL} setSideBarExpanded={setSideBarExpanded} useClass={sideBarLink}>
                    <p className={sideBarLink}>
                        {chapter.chapter}
                    </p>
                </SideBarLink>
            </Accordion.Header>
            <Accordion.Body style={accordionBodyStyle}>
                <ListGroup>
                    {
                        chapter.verses.map(verse =>
                            <SideBarLink
                                key={verse.num}
                                to={`${chapterURL}/#verse_${verse.num}`}
                                setSideBarExpanded={setSideBarExpanded}
                                useClass={verseLink}
                            >
                                <ListGroup.Item eventKey={verse.num} variant="dark"
                                    style={{
                                        backgroundColor: location.hash === `#verse_${verse.num}` ? "var(--blue-highlight-color)" : "inherit",
                                        paddingTop: "5px",
                                        paddingBottom: "5px",
                                    }}
                                >
                                    <p>
                                        Verse {verse.num}
                                    </p>
                                </ListGroup.Item>
                            </SideBarLink>
                        )
                    }
                </ListGroup>
            </Accordion.Body>
        </Accordion.Item>
    )
}

// A per-book accordion item that expands all constituent chapters
const ChaptersAccordion = ({ location, book, activeChapter, setSideBarExpanded }) => {
    const bookURL = toUrl(`/${book.fieldValue}`);

    return (
        <Accordion.Item eventKey={book.fieldValue} style={accordionItemStyle}>
            <Accordion.Header>
                <SideBarLink to={bookURL} setSideBarExpanded={setSideBarExpanded} useClass={sideBarLink}>
                    <p className={sideBarLink}>
                        {book.fieldValue}
                    </p>
                </SideBarLink>
            </Accordion.Header>
            <Accordion.Body style={accordionBodyStyle}>
                <Accordion defaultActiveKey={activeChapter} flush>
                    {
                        book.nodes.map(chapter =>
                        (
                            <VersesAccordion
                                location={location}
                                key={chapter.chapter}
                                baseURL={bookURL}
                                chapter={chapter}
                                setSideBarExpanded={setSideBarExpanded}
                            />
                        )
                        )
                    }
                </Accordion>
            </Accordion.Body>
        </Accordion.Item>
    )
}

export const SideBar = ({ location, setSideBarExpanded }) => {
    const data = useStaticQuery(graphql`
        query {
            allTextJson {
                group(field: book) {
                    nodes {
                        book
                        chapter
                        verses {
                            num
                        }
                    }
                    fieldValue
                }
            }
        }
    `);

    // Active book/chapter should match the eventKeys in the Accordion items.
    let activeBook;
    let activeChapter;
    for (let book of data.allTextJson.group) {
        if (location.pathname.includes(toUrl(book.fieldValue))) {
            activeBook = book.fieldValue;
            for (let chapter of book.nodes) {
                if (location.pathname.includes(toUrl(chapter.chapter))) {
                    activeChapter = chapter.chapter;
                    break;
                }
            }
            break;
        }
    }

    return (
        <Accordion defaultActiveKey={activeBook} flush>
            {
                data.allTextJson.group.map(book =>
                    <ChaptersAccordion
                        location={location}
                        key={book.fieldValue}
                        book={book}
                        activeChapter={activeChapter}
                        setSideBarExpanded={setSideBarExpanded} />
                )
            }
        </Accordion>
    )
}

