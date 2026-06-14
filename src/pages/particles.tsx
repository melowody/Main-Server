import {type ReactElement} from "react";
import {useParticles} from "./common/common.tsx";

export default function Particles(): ReactElement {
    useParticles();
    return <div id="particles"></div>;
}