import express, { Application } from "express"
import * as dotevnv from "dotenv"
import cors from "cors"
import helmet from "helmet"
import { GenshinCharacterModel } from "./models/GenshinCharacterModel"
import { GenshinRoute } from "./routes/GenshinRoute"

dotevnv.config()

class App {
    public app: Application
    private readonly port: number

    public readonly modelsGenshinCharacter = new GenshinCharacterModel({});
    
    constructor() {
        this.app = express();
        this.port = Number(process.env.PORT) || 3000;
    }

    private middlewares() {
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(cors())
        this.app.use(helmet())
    }

    private routes() {
        this.app.get("/", (req, res) => {
            res.send("Hello World!")
        })
        this.app.use("/api/genshin", new GenshinRoute().router)
    }

    public start() {
        this.middlewares()
        this.routes()
        this.app.listen(this.port, () => {
            console.log(`L'API Serveur est en route sur le port ${this.port}`)
        })
    }
}


async function start() {
    // Instanciation de l'application
    const app = new App()

    // Lancement de l'application
    app.start()

    // Remplissage de la table des genshin characters
    await app.modelsGenshinCharacter.fillTable();
}

start().catch((error) => {
    console.error("Erreur lors du démarrage de l'application :", error)
})


