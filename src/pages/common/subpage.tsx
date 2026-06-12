import type {ReactElement} from "react";

export function Subpage(props: any): ReactElement {
    return <div id="content">
        <div id="content-navbar">
            <div id="particles"></div>
            <div id="content-navbar-links">
                <div id="content-navbar-links-title">
                    <a href="/">mel's home</a>
                </div>
                <div id="content-navbar-links-links">
                    <p>{props.index == 0 ? <a href="#" className="content-navbar-links-selected">about</a> : <a href="/about">about</a>}</p>
                    <p>{props.index == 1 ? <a href="#" className="content-navbar-links-selected">blog</a> : <a href="/blog">blog</a>}</p>
                    <p>{props.index == 2 ? <a href="#" className="content-navbar-links-selected">projects</a> : <a href="/projects">projects</a>}</p>
                    <p>{props.index == 3 ? <a href="#" className="content-navbar-links-selected">art</a> : <a href="/art">art</a>}</p>
                </div>
            </div>
            <div id="content-navbar-separator">
                <div id="content-navbar-separator-top-gradient"></div>
                <div id="content-navbar-separator-bottom-gradient"></div>
                <div id="content-navbar-separator-separator"></div>
            </div>
        </div>
        <div id="content-body">
            <div id="content-body-title">
                <p>{props.title}</p>
            </div>
            {props.component}
        </div>
    </div>;
}