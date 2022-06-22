import { Link } from 'gatsby'
import * as React from 'react'
import { Breadcrumb } from 'react-bootstrap'
import { titleCaseFromUrl } from '../util/util'


const ResponsiveBreadcrumbs = ({ location }) => {
    const breadcrumbStyle = {
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
        <Breadcrumb style={{
            width: "fit-content",
            marginLeft: "auto", marginRight: "auto"
        }}>
            {breadcrumbs}
        </Breadcrumb>
    )
}

export default ResponsiveBreadcrumbs;