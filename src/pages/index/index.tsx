import {type ReactElement} from "react";
import {useParticles} from "../common/common.ts";
import styles from "./index.module.css";

export default function Index(): ReactElement {
    useParticles();
    return <div className={styles.indexPage}>
        <div className={styles.indexParticles} id="particles"></div>
        <div className={styles.container}>
            <div className={styles.containerFediring}>
                <div className={styles.containerFediringLeft}>
                    <p><a style={{fontFamily: 'KoPub Batang'}} href="https://fediring.net/previous?host=meluhdy.dev">&lt;</a></p>
                </div>
                <div className={styles.containerFediringHome}>
                    <p><a href="https://fediring.net/">fediring</a></p>
                </div>
                <div className={styles.containerFediringRight}>
                    <p><a style={{fontFamily: 'KoPub Batang'}} href="https://fediring.net/next?host=meluhdy.dev">&gt;</a></p>
                </div>
            </div>
            <div className={styles.middle}>
                <div className={styles.middleTitle}>
                    <p>mel's home</p>
                </div>
                <div className={styles.middleLinks}>
                    <div className={styles.middleLinksPages}>
                        <p>
                            <a href="#" id="middle-links-pages-home" style={{textDecoration: "underline"}}>home</a>
                            -
                            <a href="/about" id="middle-links-pages-about">about</a>
                            -
                            <a href="/projects" id="middle-links-pages-about">projects</a>
                            -
                            <a href="/art" id="middle-links-pages-about">art</a>
                        </p>
                    </div>
                    <div className={styles.middleLinksSocials}>
                        <a href="https://twitter.com/meluwudy"><img src="/assets/img/svg/twitter.svg" alt="Twitter" /></a>
                        <a href="https://youtube.com/@melodysm"><img src="/assets/img/svg/youtube.svg" alt="Youtube" /></a>
                        <a href="https://github.com/melowody"><img src="/assets/img/svg/github.svg" alt="Github" /></a>
                        <a href="https://mk.moth.zone/@melody"><img src="/assets/img/svg/activitypub.svg" alt="AcitivityPub" /></a>
                    </div>
                </div>
            </div>
            <div className={styles.containerRoboring}>
                <div className={styles.containerRoboringLeft}>
                    <p><a style={{fontFamily: 'KoPub Batang'}} href="https://stellophiliac.github.io/roboring/meluwudy/previous">&lt;</a></p>
                </div>
                <div className={styles.containerRoboringHome}>
                    <p><a href="https://stellophiliac.github.io/roboring/">roboring</a></p>
                </div>
                <div className={styles.containerRoboringRight}>
                    <p><a style={{fontFamily: 'KoPub Batang'}} href="https://stellophiliac.github.io/roboring/meluwudy/next">&gt;</a></p>
                </div>
            </div>
        </div>
    </div>;
}