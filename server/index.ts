import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from "fs";
import {ImapFlow} from "imapflow";

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
let loaded: boolean = false;

let resolveOtp: (() => void) | null = null;

const otpReady = new Promise<void>((resolve) => {
    resolveOtp = resolve;
});

const latestOtp: {code: string, timeUpdated: Date, timeUsed: Date} = {code: "000000", timeUpdated: new Date(), timeUsed: new Date()}
const imapClient = new ImapFlow({
    host: process.env.MAIL_SERVER_URL!,
    port: Number(process.env.MAIL_SERVER_PORT!),
    secure: true,
    auth: {
        user: process.env.MAIL_SERVER_USER!,
        pass: process.env.MAIL_SERVER_PASSWORD!
    }
})

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
    const headers = response.headers;

    console.log(body);
    console.log(headers);

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

async function verify2fa(): Promise<boolean> {

    console.log("Verifying...");

    const timeout = new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 30_000));
    const ready = otpReady.then(() => true);
    const ok = await Promise.race([ready, timeout]);
    if (!ok) return false;

    console.log("New:", latestOtp.code);

    const response = await fetch("https://api.vrchat.cloud/api/1/auth/twofactorauth/emailotp/verify", {
        method: 'POST',
        body: JSON.stringify({"code": latestOtp.code}),
        headers: {
            "User-Agent": "Mozilla/5.0 (platform; rv:gecko-version) Gecko/gecko-trail Firefox/firefox-version",
            "Content-Type": "application/json",
            cookie: `auth=${authCookie}`
        }
    });
    if (response.status !== 200) {
        return false;
    }

    await setUserId();
    latestOtp.timeUsed = new Date();
    loaded = true;
    return true;
}

app.post("/api/vrchat/login", async (req, res) => {
    if (loaded) {
        return res.json({success: true});
    }
    const { cookie, body } = await getAuthCookie();

    authCookie = cookie!;

    if (body.requiresTwoFactorAuth?.includes("totp")) {
        return res.json({
            success: await verify2fa()
        });
    }

    if (body.requiresTwoFactorAuth?.includes("emailOtp")) {
        return res.json({
            success: await verify2fa()
        });
    }

    await setUserId();

    loaded = true;
    res.json({
        success: true
    });
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

async function sendShock() {
    /*if (!client) {
        client = createClient({
            socket: {
                host: "redis.pishock.com",
                port: 6379
            },
            username: `user${process.env.PISHOCK_USERID}`,
            password: process.env.PISHOCK_TOKEN
        });
        client.connect();
        console.log("Pishock Connected");
    }*/
}

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
            try {
                await sendShock();
            } catch (err) {
                console.error(err);
            }
            await updateAvatar(state.lastAvatarId);
        }
    } catch (err) {
        console.error("Could not sync: ", err);
    }
}

let interval = 2000;

async function syncLoop() {
    try {
        await syncAvatar();
        interval = 2000;
    } catch {
        interval = Math.min(interval * 2, 60000);
    }

    setTimeout(syncLoop, interval);
}

async function otpListener() {
    await imapClient.connect();
    const mailbox = await imapClient.mailboxOpen("INBOX");
    let latestUid = mailbox.exists;

    imapClient.on("exists", async () => {
        console.log("Got email");

        const lock = await imapClient.getMailboxLock("INBOX");
        try {
            const messages = imapClient.fetch(`${latestUid + 1}:*`, {
                uid: true,
                envelope: true,
                bodyParts: ["1"]
            });

            for await (const msg of messages) {
                const body = msg.bodyParts?.get("1")?.toString("utf8") ?? "";
                const otp = body.match(/\b\d{6}\b/)?.[0];

                console.log("UID:", msg.uid);
                console.log("Body:", body);

                if (otp && msg.uid > latestUid) {
                    latestUid = msg.uid;
                    latestOtp.code = otp;
                    latestOtp.timeUpdated = new Date();

                    console.log("New:", otp);
                    resolveOtp?.();
                }
            }
        } finally {
            lock.release();
        }
    });

    await imapClient.idle();
}

void syncLoop();
otpListener().then(_ => {
    latestOtp.timeUsed = new Date();
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}!`);
});