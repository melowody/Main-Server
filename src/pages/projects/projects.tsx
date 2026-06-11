import {type ReactElement, useEffect, useState} from "react";
import {useParticles} from "../common/common.ts";
import styles from "./projects.module.css";

type Data = {
    name: string;
    description: string;
    links: {
        name: string;
        link: string;
        dont_link?: boolean;
    }[];
    image: {
        name: string;
        position?: string;
    }
}

function mod(n: number, m: number) {
    return ((n % m) + m) % m;
}

function Project() {
    const IMAGE_PATH = "/assets/img/png/projects/";

    const [data, setData] = useState<Data[]>([]);
    const [selected, setSelected] = useState(0);

    useEffect(() => {
        fetch("/assets/json/projects.json")
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setData(data);
            })
    }, []);

    const current: Data = data[selected];

    if (!current) {
        return <div id="content-body">Loading! :3</div>;
    }

    const prevPage = () => setSelected((s) => mod(s - 1, data.length));
    const nextPage = () => setSelected((s) => mod(s + 1, data.length));

    return <div id="content-body">
        <p className={styles.contentBodyTitle}>projects</p>
        <img className={styles.contentBodyBodyImage} src={`${IMAGE_PATH}${current.image.name}`} alt={current.name} style={{objectPosition: current.image.position ?? undefined}}/>
        <p className={styles.contentBodyBodyTitle}>{current.name}</p>
        <div className={styles.contentBodyBodySeparator}></div>
        <p className={styles.contentBodyBodyLeft} onClick={prevPage}>&lt;</p>
        <p className={styles.contentBodyBodyRight} onClick={nextPage}>&gt;</p>
        <div className={styles.contentBodyBodyDesc}>
            <p>{current.description}</p><br /><br />
            {current.links.map((link) => (
                <div key={link.name}><span style={{fontWeight: "bold"}}>{link.name}: </span>{link.dont_link ? (link.link) : (<a href={link.link}>{link.link}</a>)}</div>
            ))}
        </div>
    </div>
}

export default function Projects(): ReactElement {
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
                    <p><a href="/blog">blog</a></p>
                    <p><a href="#" className="content-navbar-links-selected">projects</a></p>
                    <p><a href="/art">art</a></p>
                </div>
            </div>
            <div id="content-navbar-separator">
                <div id="content-navbar-separator-top-gradient"></div>
                <div id="content-navbar-separator-bottom-gradient"></div>
                <div id="content-navbar-separator-separator"></div>
            </div>
        </div>
        <Project />
    </div>;
}