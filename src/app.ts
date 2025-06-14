import express, { Application } from "express"
import * as dotevnv from "dotenv"
import cors from "cors"
import helmet from "helmet"
import { GenshinCharacterModel } from "./models/GenshinCharacterModel"
import { GenshinRoute } from "./routes/GenshinRoute"
import { TokenModel } from "./models/TokenModel"
import { InfographicService } from "./services/InfographicService"
import { InfographicRoute } from "./routes/InfographicRoute"

dotevnv.config()

/**
 * App class
 * @classdesc This class represents the application.
 * @extends express.Application
 * @implements {TokenModel}
 * @implements {GenshinCharacterModel}
 * @implements {GenshinRoute}
 */



class App {
    public app: Application
    private readonly port: number


    constructor(
        public readonly modelToken = new TokenModel({}),
        public readonly modelGenshinCharacter = new GenshinCharacterModel({}),
        public readonly infographicService = new InfographicService()
    ) {

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
            res.status(200).send("Bienvenue sur l'API CitlAPI !")
        })
        this.app.use("/api/genshin", new GenshinRoute().router)
        this.app.use("/api/infographics", new InfographicRoute().router)
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

    // Génération des tokens initiales
    await app.modelToken.generateInitialTokens();

    // Remplissage de la table des genshin characters
    await app.modelGenshinCharacter.fillTable();

    // Test de l'API
    //APITEST.test();

    // Enregistrement des infographies
    await app.infographicService.saveInfographics_GI();
}

start().catch((error) => {
    console.error("Erreur lors du démarrage de l'application :", error)
})


