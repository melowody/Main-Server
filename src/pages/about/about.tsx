import type {ReactElement} from "react";
import {useParticles} from "../common/common.tsx";
import "../common/common.css";
import styles from "./about.module.css";
import {Subpage} from "../common/subpage.tsx";

export default function About(): ReactElement {
    useParticles();
    return <Subpage component={<>
        <div className={styles.contentBodyBody}>
            <div className={styles.contentBodyBodyTop}>
                <p>hey! i'm melody, a 21 year old robot with a passion for learning and developing. when i was just
                    7 years old i learned of programming, saw a future where i could make anything i'd want, and
                    immediately jumped on board, learning about javascript at the time, and now a whole slew of
                    languages such as python, java/kotlin, html/css, c++, and others. you can find the projects i've
                    made with them in the projects tab on the left.</p>
                <img src="/assets/img/png/space.png" alt="Mel floating in space"/>
            </div>
            <div className={styles.contentBodyBodyBottom}>
                <img src="/assets/img/png/desk.png" alt="Mel with her paws on the desk"/>
                <p>i find beauty in the simplicity. i could've gone over the top with this website, but i wanted to
                    keep it simple but aesthetically pleasing. same with my sona, images of whom you can see to the
                    left and above. you can find more art of her in the art tab on the left if you're so inclined.
                    she was fully realized with the help of my friend sam (who definitely had no say in making her a
                    moth) and i feel is very representative of who i am.</p>
            </div>
        </div>
    </>} index={0} title={"about me"} />;
}