import { Link } from 'gatsby'
import * as React from 'react'
import { Breadcrumb } from 'react-bootstrap'
import useIsMobile from '../util/responsiveness'
import { titleCaseFromUrl } from '../util/util'


const ResponsiveBreadcrumbs = ({ location }) => {
    const isMobile = useIsMobile()

    let breadcrumbStyle = {
        fontSize: "16px"
    };
    let breadcrumbs = [
        <Breadcrumb.Item key="/" linkProps={{ "to": "/" }} linkAs={Link} style={breadcrumbStyle}>
            Home
        </Breadcrumb.Item>
    ];
    let curPath = "/";
    for (let pathElement of location.pathname.split("/").slice(1)) {
        curPath += pathElement;
        breadcrumbs.push(
            <Breadcrumb.Item key={"nested" + curPath} linkProps={{ "to": curPath }} linkAs={Link} style={breadcrumbStyle}>
                {titleCaseFromUrl(pathElement)}
            </Breadcrumb.Item>
        );
        curPath += "/";
    }

    return (
        (isMobile) ?
            <></>
            :
            <Breadcrumb>
                {breadcrumbs}
            </Breadcrumb>
    )
}

export default ResponsiveBreadcrumbs;