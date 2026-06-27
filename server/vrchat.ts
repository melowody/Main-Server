import {getNextEmail} from "./imap";
import * as fs from "node:fs";
import dotenv from "dotenv";

dotenv.config();

const STATE_FILE = "./state.json"

enum LoginState {
    Completed,
    TwoFactor,
    Error
}

type AvatarState = {
    lastAvatarId?: string;
};

function loadState(): AvatarState {
    try {
        return JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"))
    } catch {
        return {};
    }
}

function saveState(state: AvatarState) {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 4));
}

const state: {
    authCookie: string | null;
    otpCode: string | null;
    userId: string | null;
    avatar: AvatarState | null;
} = {
    authCookie: null,
    otpCode: null,
    userId: null,
    avatar: null
}

async function getAuthCookie(): Promise<LoginState> {
    const auth = Buffer.from(`${encodeURIComponent(process.env.VRCHAT_EMAIL!)}:${encodeURIComponent(process.env.VRCHAT_PASSWORD!)}`).toString('base64');

    const response = await fetch("https://api.vrchat.cloud/api/1/auth/user", {
        method: 'GET',
        headers: {
            "Authorization": `Basic ${auth}`,
            "User-Agent": "Mozilla/5.0 (platform; rv:gecko-version) Gecko/gecko-trail Firefox/firefox-version",
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        return LoginState.Error;
    }

    const body = await response.json();
    const headers = response.headers;

    console.log(body);
    console.log(headers);

    const cookie = response.headers.get("set-cookie")!.match(/auth=([^;]+)/)?.[1];

    console.log(cookie);

    state.authCookie = cookie ? cookie : null;
    return body.requiresTwoFactorAuth?.length ? LoginState.TwoFactor : LoginState.Completed;
}

async function send2FA(): Promise<LoginState> {
    const response = await fetch("https://api.vrchat.cloud/api/1/auth/twofactorauth/emailotp/verify", {
        method: 'POST',
        body: JSON.stringify({"code": state.otpCode}),
        headers: {
            "User-Agent": "Mozilla/5.0 (platform; rv:gecko-version) Gecko/gecko-trail Firefox/firefox-version",
            "Content-Type": "application/json",
            cookie: `auth=${state.authCookie}`
        }
    });

    if (!response.ok) {
        return LoginState.Error;
    }

    return LoginState.Completed;
}

async function setUserId(): Promise<LoginState> {
    const userRes = await fetch("https://api.vrchat.cloud/api/1/auth/user", {
        headers: {
            "User-Agent": "Mozilla/5.0 (platform; rv:gecko-version) Gecko/gecko-trail Firefox/firefox-version",
            cookie: `auth=${state.authCookie}`
        }
    });

    if (!userRes.ok) {
        return LoginState.Error;
    }

    const user = await userRes.json();
    state.userId = user.id;

    return LoginState.Completed
}

async function auth() {
    const curr = await getAuthCookie();
    if (curr == LoginState.Error) {
        console.error("Could not authenticate");
        return;
    } else if (curr == LoginState.TwoFactor) {
        const email = await getNextEmail();
        console.log(email);
        const code = email.match(/code: (\d{6})/)?.[1];
        state.otpCode = code ? code : null;
        console.log(state.otpCode);
        if (await send2FA() == LoginState.Error) {
            console.error("Could not register 2FA");
            return;
        }
    }
    if (await setUserId() == LoginState.Error) {
        console.error("Could not get User ID");
        return;
    }
}

async function updateAvatar(avatarId: string) {
    return await fetch(`https://api.vrchat.cloud/api/1/avatars/${encodeURIComponent(avatarId)}/select`, {
        method: "PUT",
        headers: {
            "User-Agent": "Mozilla/5.0 (platform; rv:gecko-version) Gecko/gecko-trail Firefox/firefox-version",
            "Content-Type": "application/json",
            cookie: `auth=${state.authCookie}`
        }
    });
}

async function avatarLoop(): Promise<void> {
    try {
        if (!state.avatar || !state.userId || !state.authCookie) return;

        const response = await fetch(`https://api.vrchat.cloud/api/1/users/${state.userId}/avatar`, {
            method: "GET",
            headers: {
                "User-Agent": "Mozilla/5.0 (platform; rv:gecko-version) Gecko/gecko-trail Firefox/firefox-version",
                "Content-Type": "application/json",
                cookie: `auth=${state.authCookie}`
            }
        });

        const data = await response.json();
        const id: string = data.id;

        if (id != state.avatar.lastAvatarId) {
            await updateAvatar(state.avatar.lastAvatarId!);
        }
    } catch (err) {
        console.error("Could not sync avatar:", err);
        return;
    }
}

export async function setAvatar(avatarId: string): Promise<boolean> {
    const oldId = state.avatar!.lastAvatarId;
    state.avatar!.lastAvatarId = avatarId;
    const response = await updateAvatar(avatarId);
    if (!response.ok) {
        state.avatar!.lastAvatarId = oldId;
    } else {
        saveState(state.avatar!);
    }
    return response.ok;
}

export async function startAvatarLoop() {
    state.avatar = loadState();
    await auth();

    let interval = 2000;

    const loopImpl = async () => {
        try {
            await avatarLoop();
            interval = 2000;
        } catch {
            interval = Math.min(interval * 2, 60000);
        }

        setTimeout(loopImpl, interval);
    };

    void loopImpl();
}