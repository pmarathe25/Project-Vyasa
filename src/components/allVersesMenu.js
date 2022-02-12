import * as React from 'react'
import { Button, Navbar, Offcanvas } from 'react-bootstrap'
import { navSideBar, navSideBarToggle } from './layout.module.css'
import { SideBar } from './sidebar'

const AllVersesMenu = ({ location }) => {
    const [sideBarExpanded, setSideBarExpanded] = React.useState(false);

    return (
        <>
            <Button
                aria-controls="offcanvasNavbar"
                className={navSideBarToggle}
                onClick={() => setSideBarExpanded(true)}
                style={{ width: "10%", minWidth: "120px" }}
            >
                <p style={{ fontVariant: "small-caps", fontSize: "16px" }}>
                    All Verses
                </p>
            </Button>

            <Navbar.Offcanvas
                id="offcanvasNavbar"
                variant="dark"
                aria-labelledby="offcanvasNavbarLabel"
                placement="end"
                scroll={true}
                show={sideBarExpanded}
                onHide={() => setSideBarExpanded(false)}
            >
                <Offcanvas.Header closeButton className={navSideBar} onClick={() => setSideBarExpanded(false)} />
                <Offcanvas.Body variant="dark" className={navSideBar}>
                    <SideBar location={location} setSideBarExpanded={setSideBarExpanded}></SideBar>
                </Offcanvas.Body >
            </Navbar.Offcanvas >
        </>
    )
}

export default AllVersesMenu;