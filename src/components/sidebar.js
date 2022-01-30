import { graphql, useStaticQuery } from 'gatsby'
import * as React from 'react'
import toUrl from '../util/util'
import { menuBar, menuBarButton } from "./sidebar.module.css"
import { Collapsible } from './collapsible'
import { AnchorLink } from 'gatsby-plugin-anchor-links'


const DropDown = (props) => {
    const [open, setOpen] = React.useState(false);

    return (
        <li key={props.sectionTitle}>
            <button className={menuBarButton} onClick={() => setOpen(!open)}>
                <AnchorLink to={props.sectionURL}>
                    {props.sectionTitle}
                </AnchorLink>
            </button>
            <Collapsible isOpen={open || props.location.pathname.includes(props.sectionURL)}>
                {props.children}
            </Collapsible>
        </li>
    )
}

const VerseDropDown = ({ location, book, chapterTitle, verses }) => {
    const chapterURL = toUrl(`/${book}/${chapterTitle}`);

    return (
        <DropDown location={location} sectionTitle={chapterTitle} sectionURL={chapterURL}>
            <ul>
                {
                    verses.map(verse => (
                        <li>
                            <AnchorLink to={`${chapterURL}/#verse_${verse.num}`}>
                                Verse {verse.num}
                            </AnchorLink>
                        </li>
                    ))
                }

            </ul>
        </DropDown>
    )

}

const BookDropDown = ({ location, book, chapters }) => {
    return (
        <DropDown location={location} sectionTitle={book} sectionURL={toUrl(`/${book}/`)}>
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
        <ul className={menuBar}>
            {
                data.allChaptersJson.group.map(group =>
                    <BookDropDown location={location} book={group.fieldValue} chapters={group.nodes} />
                )
            }
        </ul>
    )
}

