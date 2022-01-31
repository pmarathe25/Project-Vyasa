import { graphql, useStaticQuery } from 'gatsby'
import * as React from 'react'
import toUrl from '../util/util'
import { sideBar, sideBarLink, sideBarItem } from "./sidebar.module.css"
import { Collapsible } from './collapsible'
import { AnchorLink } from 'gatsby-plugin-anchor-links'
import { useTransliterate } from "./transliterationHook"


const SideBarLink = (props) => {
    const fontSize = 22 - (props.depth * 4);

    return (
        <AnchorLink to={props.to} className={sideBarLink} >
            <div style={{ display: "flex" }}>
                <div style={{ fontSize: fontSize }}>
                    {props.children}
                </div>
            </div>
        </AnchorLink >
    )
}

const DropDown = (props) => {
    const [open, setOpen] = React.useState(false);

    return (
        <li key={props.sectionTitle} className={sideBarItem}>
            <Collapsible isOpen={() => { return open || props.location.pathname.includes(props.sectionURL); }} setOpen={setOpen} heading={
                < SideBarLink to={props.sectionURL} depth={props.depth}>
                    {props.sectionTitle}
                </SideBarLink>
            }>
                {props.children}
            </Collapsible>
        </li >
    )
}

const VerseDropDown = ({ location, book, chapterTitle, verses }) => {
    const chapterURL = toUrl(`/${book}/${chapterTitle}`);

    return (
        <DropDown location={location} sectionTitle={chapterTitle} sectionURL={chapterURL} depth={1}>
            <ul>
                {
                    verses.map(verse => (
                        <li key={verse.num} className={sideBarItem}>
                            <SideBarLink to={`${chapterURL}/#verse_${verse.num}`}>
                                Verse {verse.num}
                            </SideBarLink>
                        </li>
                    ))
                }

            </ul>
        </DropDown>
    )

}

const BookDropDown = ({ location, book, chapters }) => {
    const translitBookName = useTransliterate(book);

    return (
        <DropDown location={location} sectionTitle={translitBookName} sectionURL={toUrl(`/${book}/`)} depth={0}>
            <ul>
                {
                    chapters.map(chapter => (
                        <VerseDropDown location={location} book={book} chapterTitle={chapter.title} verses={chapter.verses} />
                    ))
                }
            </ul>
        </DropDown>
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

    return (
        <ul className={sideBar}>
            {
                data.allChaptersJson.group.map(group =>
                    <BookDropDown location={location} book={group.fieldValue} chapters={group.nodes} />
                )
            }
        </ul>
    )
}

