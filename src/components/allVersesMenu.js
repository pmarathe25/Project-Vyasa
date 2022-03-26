import * as React from 'react'
import { Button, Offcanvas } from 'react-bootstrap'
import { HiOutlineChevronDoubleRight } from 'react-icons/hi'
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
                <p style={{ fontVariant: "small-caps", fontSize: "15px" }}>
                    All Verses
                </p>
            </Button>

            <Offcanvas
                id="offcanvas"
                variant="dark"
                placement="end"
                show={sideBarExpanded}
                onHide={() => setSideBarExpanded(false)}
            >
                <Offcanvas.Header className={navSideBar}>
                    <HiOutlineChevronDoubleRight
                        style={{ color: "rgb(200, 200, 200)", cursor: "pointer" }}
                        size="24px"
                        onClick={() => setSideBarExpanded(false)} />
                </Offcanvas.Header>
                <Offcanvas.Body variant="dark" className={navSideBar}>
                    <SideBar location={location} setSideBarExpanded={setSideBarExpanded}></SideBar>
                </Offcanvas.Body >
            </Offcanvas >
        </>
    )
}

export default AllVersesMenu;