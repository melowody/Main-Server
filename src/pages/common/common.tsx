import {useEffect} from "react";
import {createDirectus, rest} from "@directus/sdk";

interface DirectusSchema {
    art: DirectusArt[];
}

interface DirectusArt {
    id: number;
    title: string;
    file: string;
    position: string | null;
    artist_name: string;
    artist_link: string | null;
    date: string;
}

const loadParticles = () => (window as any).particlesJS.load('particles', "/assets/json/particles.json", () => {});
export const directus = createDirectus<DirectusSchema>("https://directus.meluhdy.dev").with(rest());

export function useParticles() {
    useEffect(() => {
        if (!(window as any).particlesJS) {
            const script = document.createElement("script");
            script.src = "/particles.js";
            script.onload = () => loadParticles();
            document.head.appendChild(script);
        } else {
            loadParticles();
        }
    }, []);
}