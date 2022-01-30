import { graphql, Link, useStaticQuery } from 'gatsby'
import * as React from 'react'
import toUrl from '../util/util'

const BookDropDown = ({ book, chapters }) => {
    return (
        <div>
            <Link to={toUrl(`/${book}/`)}>
                {book}
            </Link>
            <ul>
                {
                    chapters.map(chapter => (
                        <li>
                            <Link to={toUrl(`/${book}/${chapter.title}`)}>
                                {chapter.title}
                            </Link>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export const SideBar = () => {
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
        <ul>

            {
                data.allChaptersJson.group.map(group =>
                    <BookDropDown book={group.fieldValue} chapters={group.nodes}>

                    </BookDropDown>
                )
            }
        </ul>
    )
}

