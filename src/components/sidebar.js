import { graphql, useStaticQuery } from 'gatsby'
import * as React from 'react'
import toUrl from '../util/util'
import { sideBarLink, sideBarItem } from "./sidebar.module.css"
import { AnchorLink } from 'gatsby-plugin-anchor-links'
import { useTransliterate } from "./transliterationHook"
import { Accordion } from 'react-bootstrap'


const SideBarLink = (props) => {
    return (
        <AnchorLink to={props.to}>
            <p className={sideBarLink}>
                {props.children}
            </p>
        </AnchorLink>
    );
}

// A per-chapter accordion item that expands all constituent verses
const VersesAccordion = ({ baseURL, chapter }) => {
    const translitChapterName = useTransliterate(chapter.title);
    const chapterURL = toUrl(`${baseURL}/${chapter.title}`);

    return (
        <Accordion.Item eventKey={chapter.title}>
            <Accordion.Header>
                <SideBarLink to={chapterURL}>
                    {translitChapterName}
                </SideBarLink>
            </Accordion.Header>
            <Accordion.Body>
                <ul>
                    {
                        chapter.verses.map(verse =>
                            <li key={verse.num} className={sideBarItem}>
                                <SideBarLink to={`${chapterURL}/#verse_${verse.num}`}>
                                    Verse {verse.num}
                                </SideBarLink>
                            </li>)
                    }
                </ul>
            </Accordion.Body>
        </Accordion.Item>
    )
}

// A per-book accordion item that expands all constituent chapters
const ChaptersAccordion = ({ book, activeChapter }) => {
    const translitBookName = useTransliterate(book.fieldValue);
    const bookURL = toUrl(`/${book.fieldValue}`);

    return (
        <Accordion.Item eventKey={book.fieldValue}>
            <Accordion.Header>
                <SideBarLink to={bookURL}>
                    {translitBookName}
                </SideBarLink>
            </Accordion.Header>
            <Accordion.Body>
                <Accordion defaultActiveKey={activeChapter} alwaysOpen={true} flush>
                    {
                        book.nodes.map(chapter =>
                        (
                            <VersesAccordion baseURL={bookURL} chapter={chapter} />
                        )
                        )
                    }
                </Accordion>
            </Accordion.Body>
        </Accordion.Item>
    )
}

export const SideBar = ({ location }) => {
    const data = useStaticQuery(graphql`
        query {
            allChaptersJson {
                group(field: book) {
                    nodes {
                        book
                        title
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
    for (let book of data.allChaptersJson.group) {
        if (location.pathname.includes(toUrl(book.fieldValue))) {
            activeBook = book.fieldValue;
            for (let chapter of book.nodes) {
                if (location.pathname.includes(toUrl(chapter.title))) {
                    activeChapter = chapter.title;
                    break;
                }
            }
            break;
        }
    }

    return (
        <Accordion defaultActiveKey={activeBook} alwaysOpen={true} flush>
            {
                data.allChaptersJson.group.map(book =>
                    <ChaptersAccordion book={book} activeChapter={activeChapter} />
                )
            }
        </Accordion>
    )
}

