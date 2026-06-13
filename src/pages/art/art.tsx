import {type ReactElement, useEffect, useState} from "react";
import {useParticles} from "../common/common.tsx";
import styles from "./art.module.css";
import {Subpage} from "../common/subpage.tsx";

type Work = {
    id: number;
    title: string;
    date: Date;
    file_path: string;
    position: string | null;
    artist_name: string;
    artist_link: string | null;
}

function mod(n: number, m: number) {
    return ((n % m) + m) % m;
}

function Project() {
    const [data, setData] = useState<Work[]>([]);
    const [selected, setSelected] = useState(0);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        fetch("https://directus.meluhdy.dev/items/art")
            .then(res => res.json())
            .then(data => {
                setData(data.data.map((work: any) => {
                    const n: Work = {
                        id: work.id,
                        title: work.title,
                        date: new Date(work.date),
                        file_path: `https://directus.meluhdy.dev/assets/${work.file}`,
                        position: work.position,
                        artist_name: work.artist_name,
                        artist_link: work.artist_link
                    }
                    return n;
                }).sort((a: any, b: any) => (a.date.getTime() - b.date.getTime())));
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
            <p className={styles.contentBodyLeft} onClick={prevPage}>&lt;</p>
            <p className={styles.contentBodyRight} onClick={nextPage}>&gt;</p>
            <div className={styles.contentBodyArt}>
                <img className={styles.contentBodyArtImage} onClick={showOverlay} style={{objectPosition: current.position ?? undefined}} src={current.file_path} alt={current.title}/>
                <div className={styles.contentBodyArtDesc}>
                    <p className={styles.contentBodyArtDescName}>{current.title}</p>
                    <p className={styles.contentBodyArtDescCredits}>
                        <span style={{fontWeight: "bold"}}>artist:</span> {current.artist_link ? (<a href={current.artist_link}>{current.artist_name}</a>) : (current.artist_name)}<br />
                        <span style={{fontWeight: "bold"}}>commission date:</span> {(() => {
                            return `${current.date.toLocaleString("default", {month: "long"})} ${current.date.getDate()}, ${current.date.getFullYear()} ${current.date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`.toLocaleLowerCase();
                        })()}
                    </p>
                </div>
            </div>
        </div>
        <div className={styles.contentOverlay} style={{display: visible ? "flex" : "none"}}>
            <img className={styles.contentOverlayImage} src={current.file_path} alt={current.title}/>
            <img className={styles.contentOverlayClose} onClick={hideOverlay} src="/assets/img/svg/close.svg" alt="Close"/>
        </div>
    </>
}

export default function Art(): ReactElement {
    useParticles();
    return <Subpage component={<Project/>} index={3} title={"art"} />;
}