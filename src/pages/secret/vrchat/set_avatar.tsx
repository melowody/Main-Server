// let authCookie;

import {type SyntheticEvent, useEffect, useState} from "react";

export function SetAvatar() {
    const setAvatar = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);
        const avatar = formData.get("avatar");
        fetch("/api/vrchat/avatar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"avatar": avatar})
        });
    }
    
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        async function set() {
            const login = await fetch("/api/vrchat/login", {
                method: "POST"
            });
            
            const data = await login.json();
            if (!data.success) {
                alert("Could not load 2FA!");
            }
            
            setLoaded(true);
        }
        
        set().then(r => r);
    }, []);
    if (loaded) {
        return <>
            <form onSubmit={setAvatar}>
                <input name="avatar" />
                <button type="submit">Submit</button>
            </form>
        </>;
    }

    return <></>;
}