import {ImapFlow} from "imapflow";
import dotenv from "dotenv";

dotenv.config();

console.log(process.env.MAIL_SERVER_URL!);

const imapClient = new ImapFlow({
    host: process.env.MAIL_SERVER_URL!,
    port: Number(process.env.MAIL_SERVER_PORT!),
    secure: true,
    auth: {
        user: process.env.MAIL_SERVER_USER!,
        pass: process.env.MAIL_SERVER_PASSWORD!
    }
});

await imapClient.connect();

export async function getNextEmail(): Promise<string> {
    const mailbox = await imapClient.mailboxOpen("INBOX");
    let latestUid = mailbox.exists;

    let enabled = true;

    return new Promise((resolve, reject) => {
        const handler = async (): Promise<void> => {
            if (!enabled) return;
            const lock = await imapClient.getMailboxLock("INBOX");

            try {
                const messages = imapClient.fetch(`${latestUid + 1}:*`, {
                    uid: true,
                    envelope: true,
                    bodyParts: ["1"]
                });

                for await (const message of messages) {
                    latestUid = Math.max(latestUid, message.uid);

                    if (message.envelope?.from?.[0].address !== "noreply@vrchat.com") continue;

                    const body = message.bodyParts?.get("1")?.toString("utf-8") ?? "";

                    resolve(body);
                    enabled = false;
                }
            } catch (err) {
                enabled = false;
                reject(err);
            } finally {
                lock.release();
            }
        }

        imapClient.on("exists", handler);
    });
}