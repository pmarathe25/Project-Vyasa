import { Link } from 'gatsby'
import * as React from 'react'
import { Breadcrumb } from 'react-bootstrap'
import { titleCaseFromUrl } from '../util/util'


const ResponsiveBreadcrumbs = ({ location }) => {
    let curPath = "";

    let pathElements = location.pathname.split("/").slice(1).filter((value) => { return value; });
    pathElements.splice(0, 0, "/");

    let breadcrumbs = [];
    for (const [index, pathElement] of pathElements.entries()) {
        curPath += pathElement;
        breadcrumbs.push(
            <Breadcrumb.Item
                key={"nested" + curPath}
                linkProps={{ "to": curPath }}
                linkAs={Link}
                style={{ fontSize: "16px" }}
                active={index === (pathElements.length - 1)}
            >
                {titleCaseFromUrl(pathElement)}
            </Breadcrumb.Item>
        );
        if (curPath !== "/") {
            curPath += "/";
        }
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