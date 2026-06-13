import {type ReactElement, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Subpage} from "../common/subpage.tsx";
import {useParticles} from "../common/common.tsx";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import styles from "./post.module.css";
import type {Post} from "./common.ts";

export default function Test(): ReactElement {
    useParticles();
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetch(`https://directus.meluhdy.dev/items/blogs?filter[slug][_eq]=${id}`)
            .then(res => res.json())
            .then((data: any) => {
                const post = data.data[0];
                setPost(post || null);
                setLoading(false);
            })
    }, [id]);

    if (loading) return <Subpage component={<div className="loading">Loading post...</div>} index={-1} />;

    if (post == null) navigate(-1)

    return <Subpage component={
        <>
            <hr style={{width: "80%"}} />
            <div className={styles.contentMarkdown}>
                <Markdown
                    components={{
                        code({node, inline, className, children, ...props}: any) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                                <SyntaxHighlighter
                                    {...props}
                                    style={oneLight}
                                    language={match[1]}
                                    PreTag="div"
                                >
                                    {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                            ) : (
                                <code className={className} {...props}>{children}</code>
                            )
                        }
                    }}
                >{post!.post}</Markdown>
            </div>
        </>
    } index={-1} title={post!.title} />;
}