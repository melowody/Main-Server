import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from "fs";

const PORT = 7566;
const STATE_FILE = "./state.json"

type State = {
    lastAvatarId?: string;
};

function loadState(): State {
    try {
        return JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"))
    } catch {
        return {};
    }
}

function saveState(state: State) {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 4));
}

const state = loadState();

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

let authCookie: string;
let userId: string;

async function getAuthCookie(): Promise<{cookie: string | undefined, body: any}> {
    const auth = Buffer.from(`${encodeURIComponent(process.env.VRCHAT_EMAIL!)}:${encodeURIComponent(process.env.VRCHAT_PASSWORD!)}`).toString('base64');

    const response = await fetch("https://api.vrchat.cloud/api/1/auth/user", {
        method: 'GET',
        headers: {
            "Authorization": `Basic ${auth}`,
            "User-Agent": "Mozilla/5.0 (platform; rv:gecko-version) Gecko/gecko-trail Firefox/firefox-version",
            "Content-Type": "application/json"
        }
    });

    const body = await response.json();

    const cookie = response.headers.get("set-cookie")!.match(/auth=([^;]+)/)?.[1];

    return { cookie, body };
}

async function setUserId() {
    const userRes = await fetch("https://api.vrchat.cloud/api/1/auth/user", {
        headers: {
            "User-Agent": "Mozilla/5.0 (platform; rv:gecko-version) Gecko/gecko-trail Firefox/firefox-version",
            cookie: `auth=${authCookie}`
        }
    });

    const user = await userRes.json();
    userId = user.id;
}

app.post("/api/vrchat/login", async (req, res) => {
    const { cookie, body } = await getAuthCookie();

    authCookie = cookie!;

    if (body.requiresTwoFactorAuth?.includes("totp")) {
        return res.json({
            requires2FA: true,
            type: "totp"
        });
    }

    if (body.requiresTwoFactorAuth?.includes("emailOtp")) {
        return res.json({
            requires2FA: true,
            type: "email"
        });
    }

    await setUserId();

    res.json({
        requires2FA: false
    });
})

app.post("/api/vrchat/2fa", async (req, res) => {
    const response = await fetch("https://api.vrchat.cloud/api/1/auth/twofactorauth/emailotp/verify", {
        method: 'POST',
        body: JSON.stringify({"code": req.body.code}),
        headers: {
            "User-Agent": "Mozilla/5.0 (platform; rv:gecko-version) Gecko/gecko-trail Firefox/firefox-version",
            "Content-Type": "application/json",
            cookie: `auth=${authCookie}`
        }
    });
    if (response.status !== 200) {
        return res.json({success: false});
    }

    await setUserId();

    res.json({"success": response.status == 200});
})

async function updateAvatar(avatarId: string) {
    return await fetch(`https://api.vrchat.cloud/api/1/avatars/${encodeURIComponent(avatarId)}/select`, {
        method: "PUT",
        headers: {
            "User-Agent": "Mozilla/5.0 (platform; rv:gecko-version) Gecko/gecko-trail Firefox/firefox-version",
            "Content-Type": "application/json",
            cookie: `auth=${authCookie}`
        }
    });
}

app.post("/api/vrchat/avatar", async (req, res) => {
    const response = await updateAvatar(req.body.avatar);
    if (response.status === 200) {
        state.lastAvatarId = req.body.avatar;
        saveState(state);
    }
    res.json({"success": response.status == 200});
});

async function syncAvatar() {
    try {
        if (!state.lastAvatarId || !userId || !authCookie) return;

        const response = await fetch(`https://api.vrchat.cloud/api/1/users/${userId}/avatar`, {
            method: "GET",
            headers: {
                "User-Agent": "Mozilla/5.0 (platform; rv:gecko-version) Gecko/gecko-trail Firefox/firefox-version",
                "Content-Type": "application/json",
                cookie: `auth=${authCookie}`
            }
        });

        const data = await response.json();
        const id: string = data.id;
        if (id != state.lastAvatarId) {
            await updateAvatar(state.lastAvatarId);
        }
    } catch (err) {
        console.error("Could not sync: ", err);
    }
}

setInterval(syncAvatar, 15 * 1000);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}!`);
});