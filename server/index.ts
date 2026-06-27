import dotenv from "dotenv";
import {startServer} from "./server";
import {startAvatarLoop} from "./vrchat";

dotenv.config();

void startAvatarLoop();
void startServer();