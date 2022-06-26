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
        <Breadcrumb
            style={{
                maxWidth: "var(--no-translation-content-max-width)",
                height: "fit-content",
                marginLeft: "auto", marginRight: "auto",
                marginBottom: "10px",
                borderBottom: "1px solid rgb(125, 125, 125)",
            }}
            listProps={{
                style: {
                    width: "fit-content",
                    marginBottom: "10px",
                    marginLeft: "auto", marginRight: "auto",
                }
            }}
        >
            {breadcrumbs}
        </Breadcrumb>

    )
}

export default ResponsiveBreadcrumbs;