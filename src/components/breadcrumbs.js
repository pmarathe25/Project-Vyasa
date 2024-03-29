import { Link } from 'gatsby'
import * as React from 'react'
import { Breadcrumb } from 'react-bootstrap'
import { titleCaseFromUrl } from '../util/util'


const ResponsiveBreadcrumbs = ({ location, showCurrentPage = true }) => {
    let curPath = "";

    let pathElements = location.pathname.split("/").slice(1).filter((value) => { return value; });
    pathElements.splice(0, 0, "/");

    let breadcrumbs = [];
    for (const [index, pathElement] of pathElements.entries()) {
        const isCurrentPage = index === (pathElements.length - 1);

        if (!showCurrentPage && isCurrentPage) {
            continue;
        }

        curPath += pathElement;
        breadcrumbs.push(
            <Breadcrumb.Item
                key={"nested" + curPath}
                linkProps={{ "to": curPath }}
                linkAs={Link}
                style={{ fontSize: "var(--secondary-font-size)" }}
                active={isCurrentPage}
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
                maxWidth: "var(--medium-content-width)",
                height: "fit-content",
                marginLeft: "auto", marginRight: "auto",
                marginBottom: "30px",
                borderBottom: "1px solid var(--border-color)",
            }}
            listProps={{
                style: {
                    width: "fit-content",
                    marginBottom: "30px",
                    marginLeft: "auto", marginRight: "auto",
                }
            }}
        >
            {breadcrumbs}
        </Breadcrumb>

    )
}

export default ResponsiveBreadcrumbs;