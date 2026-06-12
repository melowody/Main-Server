import {type ReactElement, useEffect, useState} from "react";
import {useParticles} from "../common/common.tsx";
import styles from "./blog.module.css";
import {useNavigate} from "react-router-dom";
import {Subpage} from "../common/subpage.tsx";

type Post = {
    id: string;
    name: string;
    file: string;
    desc: string;
    date: number;
}

export default function Blog(): ReactElement {
    useParticles();
    const navigate = useNavigate();

    const [data, setData] = useState<Post[]>([]);

    useEffect(() => {
        fetch("/assets/json/blogs.json")
            .then(res => res.json())
            .then(data => {
                setData(data);
            })
    }, []);

    const openPage = (id: string) => navigate("/blogs/" + id);

    return <Subpage component={<>
        <div className={styles.contentBodyTitle}>
            <p>blogs</p>
        </div>
        <div className={styles.contentBodyContainer}>
            <div className={styles.contentBodySpacer}></div>
            {data.map((post) => (
                <div className={styles.contentBodyEntry} key={post.id} onClick={() => {openPage(post.id)}}>
                    <div className={styles.contentBodyEntryTitle}>
                        <span>{post.name}</span> - {(() => {
                        const date = new Date(post.date)
                        return `${date.toLocaleString("default", {month: "long"})} ${date.getDate()}, ${date.getFullYear()} ${date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`.toLocaleLowerCase();
                    })()}
                    </div>
                    <p>{post.desc}</p>
                </div>
            ))}
            <div className={styles.contentBodySpacer}></div>
        </div>
        <div className={styles.contentBodyTopGradient}></div>
        <div className={styles.contentBodyBottomGradient}></div>
    </>} index={1} />;
}