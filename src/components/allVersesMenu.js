import * as React from 'react'
import { Button, Offcanvas } from 'react-bootstrap'
import { navSideBar, navSideBarToggle } from './allVersesMenu.module.css'
import { SideBar } from './sidebar'

const AllVersesMenu = ({ location }) => {
    const [sideBarExpanded, setSideBarExpanded] = React.useState(false);

    return (
        <>
            <Button
                className={navSideBarToggle}
                onClick={() => setSideBarExpanded(true)}
            >
                <p style={{ fontVariant: "small-caps", fontSize: "17px" }}>
                    All Verses
                </p>
            </Button>

            <Offcanvas
                id="offcanvas"
                variant="dark"
                placement="end"
                scroll={true}
                show={sideBarExpanded}
                onHide={() => setSideBarExpanded(false)}
            >
                <Offcanvas.Header closeButton className={navSideBar} onClick={() => setSideBarExpanded(false)} />
                <Offcanvas.Body variant="dark" className={navSideBar}>
                    <SideBar location={location} setSideBarExpanded={setSideBarExpanded}></SideBar>
                </Offcanvas.Body >
            </Offcanvas >
        </>
    )
}

export default AllVersesMenu;