import {type ReactElement, useEffect, useState} from "react";
import {useParticles} from "../common/common.ts";
import styles from "./art.module.css";

type Work = {
    name: string;
    image: {
        name: string;
        position?: string;
    };
    artist: {
        name: string;
        link?: string;
    };
    date: number;
}

function mod(n: number, m: number) {
    return ((n % m) + m) % m;
}

function Project() {
    const IMAGE_PATH = "/assets/img/png/art/";

    const [data, setData] = useState<Work[]>([]);
    const [selected, setSelected] = useState(0);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        fetch("/assets/json/art.json")
            .then(res => res.json())
            .then(data => {
                const out = data as Work[];
                out.sort((a, b) => a.date - b.date);
                setData(out);
            })
    }, []);

    const current: Work = data[selected];

    if (!current) {
        return <div id="content-body">Loading! :3</div>;
    }

    const prevPage = () => setSelected((s) => mod(s - 1, data.length));
    const nextPage = () => setSelected((s) => mod(s + 1, data.length));

    const showOverlay = () => setVisible(true);
    const hideOverlay = () => setVisible(false);

    return <>
        <div id="content-body">
            <p className={styles.contentBodyTitle}>art</p>
            <p className={styles.contentBodyLeft} onClick={prevPage}>&lt;</p>
            <p className={styles.contentBodyRight} onClick={nextPage}>&gt;</p>
            <div className={styles.contentBodyArt}>
                <img className={styles.contentBodyArtImage} onClick={showOverlay} style={{objectPosition: current.image.position ?? undefined}} src={`${IMAGE_PATH}${current.image.name}`} alt={current.name}/>
                <div className={styles.contentBodyArtDesc}>
                    <p className={styles.contentBodyArtDescName}>{current.name}</p>
                    <p className={styles.contentBodyArtDescCredits}>
                        <span style={{fontWeight: "bold"}}>artist:</span> {current.artist.link ? (<a href={current.artist.link}>{current.artist.name}</a>) : (current.artist.name)}<br />
                        <span style={{fontWeight: "bold"}}>commission date:</span> {(() => {
                            const date = new Date(current.date)
                            return `${date.toLocaleString("default", {month: "long"})} ${date.getDate()}, ${date.getFullYear()} ${date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`.toLocaleLowerCase();
                        })()}
                    </p>
                </div>
            </div>
        </div>
        <div className={styles.contentOverlay} style={{display: visible ? "flex" : "none"}}>
            <img className={styles.contentOverlayImage} src={`${IMAGE_PATH}${current.image.name}`} alt={current.name}/>
            <img className={styles.contentOverlayClose} onClick={hideOverlay} src="/assets/svg/close.svg" alt="Close"/>
        </div>
    </>
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
                    <p><a href="/projects">projects</a></p>
                    <p><a href="#" className="content-navbar-links-selected">art</a></p>
                </div>
            </div>
            <div id="content-navbar-separator">
                <div id="content-navbar-separator-top-gradient"></div>
                <div id="content-navbar-separator-bottom-gradient"></div>
                <div id="content-navbar-separator-separator"></div>
            </div>
        </div>
        <Project/>
    </div>;
}