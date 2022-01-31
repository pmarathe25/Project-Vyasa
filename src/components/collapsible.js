import * as React from 'react'
import { collapsible, collapsibleButton } from "./collapsible.module.css"
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md"

// [heading, isOpen, setOpen] -> Collabsible
export const Collapsible = (props) => {
    const arrowStyle = { paddingTop: "5px" };

    return (
        <div className={collapsible}>
            <button className={collapsibleButton} onClick={() => props.setOpen(!props.isOpen())} style={{ display: "flex" }}>
                {props.isOpen() ? <MdKeyboardArrowDown style={arrowStyle} /> : <MdKeyboardArrowRight style={arrowStyle} />}
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