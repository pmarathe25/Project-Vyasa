import * as React from 'react'


// An anchor that is offset from its contents. This way, the anchor
// is not potentially hidden behind the top bar when the browser scrolls to it.
const OffsetAnchor = (props) => {
    return (
        // We use this weird padding/margin thing to make the anchor link 
        // appear 100px from the top of the page when we scroll to it. 
        <span id={props.id} style={{ paddingTop: "70px", marginTop: "-70px" }}>
            {props.children}
        </span>
    )
}

export default OffsetAnchor;