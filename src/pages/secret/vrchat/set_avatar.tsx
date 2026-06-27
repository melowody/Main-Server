// let authCookie;

import {type SyntheticEvent} from "react";

export function SetAvatar() {
    const setAvatar = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);
        const avatar = formData.get("avatar");
        void fetch("/api/vrchat/avatar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"avatar": avatar})
        });
    }

    return <>
        <form onSubmit={setAvatar}>
            <input name="avatar" />
            <button type="submit">Submit</button>
        </form>
    </>;
}