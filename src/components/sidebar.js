import { graphql, Link, useStaticQuery } from 'gatsby'
import * as React from 'react'
import toUrl from '../util/util'
import { menuBar, menuBarButton } from "./sidebar.module.css"
import { Collapsible } from './collapsible'


const BookDropDown = ({ location, book, chapters }) => {
    const bookURL = toUrl(`/${book}/`);

    const [open, setOpen] = React.useState(false);

    return (
        <li key={book}>
            <button className={menuBarButton} onClick={() => setOpen(!open)}>
                <Link to={bookURL}>
                    {book}
                </Link>
            </button>
            <Collapsible isOpen={open || location.pathname.includes(bookURL)}>
                <ul>
                    {
                        chapters.map(chapter => (
                            <li key={chapter.title}>
                                <Link to={toUrl(`/${book}/${chapter.title}`)}>
                                    {chapter.title}
                                </Link>
                            </li>
                        ))
                    }
                </ul>
            </Collapsible>
        </li>
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

