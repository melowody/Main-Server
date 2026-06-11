import type {ReactElement} from "react";
import {useParticles} from "../common/common.ts";
import styles from "./blog.module.css";

export default function Blog(): ReactElement {
    useParticles();
    return <div id="content">
        <div id="content-navbar">
            <div id="particles"></div>
            <div id="content-navbar-links">
                <div id="content-navbar-links-title">
                    <a href="/">mel's home</a>
                </div>
                <div id="content-navbar-links-links">
                    <p><a href="/about">about</a></p>
                    <p><a href="#" className="content-navbar-links-selected">blog</a></p>
                    <p><a href="/projects">projects</a></p>
                    <p><a href="/art">art</a></p>
                </div>
            </div>
            <div id="content-navbar-separator">
                <div id="content-navbar-separator-top-gradient"></div>
                <div id="content-navbar-separator-bottom-gradient"></div>
                <div id="content-navbar-separator-separator"></div>
            </div>
        </div>
        <div id="content-body">
            <div className={styles.contentBodyText}>
                <p>coming soon...</p>
            </div>
        </div>
    </div>;
}