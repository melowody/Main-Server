import {useEffect} from "react";

const loadParticles = () => (window as any).particlesJS.load('particles', "/assets/json/particles.json", () => {});

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