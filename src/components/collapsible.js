import * as React from 'react'
import { collapsible, collapsibleButton } from "./collapsible.module.css"


// [heading, isOpen, setOpen] -> Collabsible
export const Collapsible = (props) => {
    return (
        <div className={collapsible}>
            <button className={collapsibleButton} onClick={() => props.setOpen(!props.isOpen())} style={{ display: "flex" }}>
                {props.heading}
                <div style={{ width: "40%", height: "100%" }} />
            </button>

            {
                props.isOpen() &&
                props.children
            }
        </div>
    )
}