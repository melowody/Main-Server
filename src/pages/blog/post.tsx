import {type ReactElement, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Subpage} from "../common/subpage.tsx";
import {useParticles} from "../common/common.tsx";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import styles from "./post.module.css";

type Post = {
    id: string;
    name: string;
    file: string;
    desc: string;
    date: number;
}

export default function Test(): ReactElement {
    useParticles();
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [md, setMd] = useState<string | null>(null);

    useEffect(() => {
        fetch("/assets/json/blogs.json")
            .then(res => res.json())
            .then((data: Post[]) => {
                const post = data.find(post => post.id === id);
                setPost(post || null);
                setLoading(false);
            })
    }, [id]);

    useEffect(() => {

        if (!post?.file) return;

        fetch(`/assets/md/blog/${post?.file}`)
            .then(res => res.text())
            .then(text => setMd(text));
    }, [post]);

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
                >{md}</Markdown>
            </div>
        </>
    } index={-1} title={post!.name} />;
}