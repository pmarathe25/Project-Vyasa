import { graphql, useStaticQuery } from 'gatsby'
import { AnchorLink } from 'gatsby-plugin-anchor-links'
import * as React from 'react'
import { Accordion, ListGroup } from 'react-bootstrap'
import toUrl from '../util/util'
import { sideBarAccordion, sideBarLink, verseLink } from "./sidebar.module.css"
import { useTransliterate } from "./transliterationHook"


const SideBarLink = (props) => {
    return (
        <AnchorLink to={props.to} className={props.useClass} onAnchorLinkClick={() => { props.setSideBarExpanded(false) }}>
            <p className={props.useClass}>
                {props.children}
            </p>
        </AnchorLink>
    );
}

// A per-chapter accordion item that expands all constituent verses
const VersesAccordion = ({ baseURL, chapter, setSideBarExpanded }) => {
    const translitChapterName = useTransliterate(chapter.chapter);
    const chapterURL = toUrl(`${baseURL}/${chapter.chapter}`);

    return (
        <Accordion.Item eventKey={chapter.chapter} className={sideBarAccordion}>
            <Accordion.Header className={sideBarAccordion}>
                <SideBarLink to={chapterURL} setSideBarExpanded={setSideBarExpanded} useClass={sideBarLink}>
                    {translitChapterName}
                </SideBarLink>
            </Accordion.Header>
            <Accordion.Body className={sideBarAccordion}>
                <ul>
                    {
                        chapter.verses.map(verse =>
                            <ListGroup>
                                <ListGroup.Item eventKey={verse.num} variant="dark">
                                    <SideBarLink to={`${chapterURL}/#verse_${verse.num}`} setSideBarExpanded={setSideBarExpanded} useClass={verseLink}>
                                        Verse {verse.num}
                                    </SideBarLink>
                                </ListGroup.Item>
                            </ListGroup>)
                    }
                </ul>
            </Accordion.Body>
        </Accordion.Item>
    )
}

// A per-book accordion item that expands all constituent chapters
const ChaptersAccordion = ({ book, activeChapter, setSideBarExpanded }) => {
    const translitBookName = useTransliterate(book.fieldValue);
    const bookURL = toUrl(`/${book.fieldValue}`);

    return (
        <Accordion.Item eventKey={book.fieldValue} className={sideBarAccordion}>
            <Accordion.Header className={sideBarAccordion}>
                <SideBarLink to={bookURL} setSideBarExpanded={setSideBarExpanded} useClass={sideBarLink}>
                    {translitBookName}
                </SideBarLink>
            </Accordion.Header>
            <Accordion.Body className={sideBarAccordion}>
                <Accordion defaultActiveKey={activeChapter} alwaysOpen={true} flush>
                    {
                        book.nodes.map(chapter =>
                        (
                            <VersesAccordion baseURL={bookURL} chapter={chapter} setSideBarExpanded={setSideBarExpanded} />
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
        <Accordion defaultActiveKey={activeBook} alwaysOpen={true} flush>
            {
                data.allTextJson.group.map(book =>
                    <ChaptersAccordion book={book} activeChapter={activeChapter} setSideBarExpanded={setSideBarExpanded} />
                )
            }
        </Accordion>
    )
}

