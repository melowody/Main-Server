import {type ReactElement, useEffect, useState} from "react";
import {useParticles} from "../common/common.tsx";
import styles from "./blog.module.css";
import {useNavigate} from "react-router-dom";
import {Subpage} from "../common/subpage.tsx";
import type {Post} from "./common.ts";


export default function Blog(): ReactElement {
    useParticles();
    const navigate = useNavigate();

    const [data, setData] = useState<Post[]>([]);

    useEffect(() => {
        fetch("https://directus.meluhdy.dev/items/blogs")
            .then(res => res.json())
            .then(data => {
                setData(data.data.map((post) => {console.log(post); return {
                    id: post.id,
                    title: post.title,
                    slug: post.slug,
                    date: new Date(post.date),
                    description: post.description,
                    post: post.post
                };}).sort((a, b) => a.date - b.date));
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
                <div className={styles.contentBodyEntry} key={post.id} onClick={() => {openPage(post.slug)}}>
                    <div className={styles.contentBodyEntryTitle}>
                        <span>{post.title}</span> - {(() => {
                        const date = new Date(post.date)
                        return `${date.toLocaleString("default", {month: "long"})} ${date.getDate()}, ${date.getFullYear()} ${date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`.toLocaleLowerCase();
                    })()}
                    </div>
                    <p>{post.description}</p>
                </div>
            ))}
            <div className={styles.contentBodySpacer}></div>
        </div>
        <div className={styles.contentBodyTopGradient}></div>
        <div className={styles.contentBodyBottomGradient}></div>
    </>} index={1} />;
}