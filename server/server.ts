import express from 'express';
import cors from 'cors';
import {setAvatar} from "./vrchat";

const PORT = 7566;

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/vrchat/avatar", async (req, res) => {
    res.json({"success": await setAvatar(req.body.avatar)});
});

export async function startServer() {
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}!`);
    });
}