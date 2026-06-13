import {type ReactElement, useEffect, useState} from "react";
import {useParticles} from "../common/common.tsx";
import styles from "./projects.module.css";
import {Subpage} from "../common/subpage.tsx";

type Project = {
    id: number;
    title: string;
    description: string;
    image: string;
    position: string | null;
    links: {
        id: number;
        projects_id: number;
        collection: string;
        item: {
            id: number;
            name: string;
            link: string;
            link_to: boolean;
        };
    }[];
};

function mod(n: number, m: number) {
    return ((n % m) + m) % m;
}

function Project() {
    const [data, setData] = useState<Project[]>([]);
    const [selected, setSelected] = useState(0);

    useEffect(() => {
        fetch("https://directus.meluhdy.dev/items/projects?fields=*,links.*,links.item.*")
            .then(res => res.json())
            .then(data => {
                setData(data.data);
            })
    }, []);

    const current: Project = data[selected];

    if (!current) {
        return <div id="content-body">Loading! :3</div>;
    }

    const prevPage = () => setSelected((s) => mod(s - 1, data.length));
    const nextPage = () => setSelected((s) => mod(s + 1, data.length));

    return <>
        <img className={styles.contentBodyBodyImage} src={`https://directus.meluhdy.dev/assets/${current.image}`} alt={current.title} style={{objectPosition: current.position ?? undefined}}/>
        <p className={styles.contentBodyBodyTitle}>{current.title}</p>
        <div className={styles.contentBodyBodySeparator}></div>
        <p className={styles.contentBodyBodyLeft} onClick={prevPage}>&lt;</p>
        <p className={styles.contentBodyBodyRight} onClick={nextPage}>&gt;</p>
        <div className={styles.contentBodyBodyDesc}>
            <p>{current.description}</p><br /><br />
            {current.links.map((link) => (
                <div key={link.item.name}><span style={{fontWeight: "bold"}}>{link.item.name}: </span>{!link.item.link_to ? (link.item.link) : (<a href={link.item.link}>{link.item.link}</a>)}</div>
            ))}
        </div>
    </>
}

export default function Projects(): ReactElement {
    useParticles();
    return <Subpage component={<Project />} index={2} title={"projects"} />;
}