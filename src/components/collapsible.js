import * as React from 'react'
import { collapsible } from "./collapsible.module.css"


export const Collapsible = (props) => {
    return (
        <div className={collapsible}>
            {
                props.isOpen &&
                props.children
            }
        </div>
    )
}