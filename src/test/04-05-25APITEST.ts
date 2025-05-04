import axios from "axios";
import { GenshinCharacterInterface } from "../interfaces/GenshinCharacterInterface";

export class APITEST {
    public static async test() {

        // Vérification de la route GET /api/genshin/characters
        try {
            const response = await axios.get("http://localhost:3000/api/genshin/characters");
            // Vérifie si la réponse est équivalente à ce qu'il y a dans la base de données
            if (response.status === 200) {
                console.log("Test API réussi pour la route /api/genshin/characters");
            } else {
                console.error("Test API échoué pour la route /api/genshin/characters: ", response.status);
            }
        } catch (error) {
            console.error(error);
        }

        // Vérification de la route GET /api/genshin/characters/:id
        try {
            const response = await axios.get("http://localhost:3000/api/genshin/characters/1");
            // Vérifie si la réponse est équivalente à ce qu'il y a dans la base de données
            if (response.status === 200) {
                console.log("Test API réussi pour la route /api/genshin/characters/1");
            } else {
                console.error("Test API échoué pour la route /api/genshin/characters/1: ", response.status);
            }
        } catch (error) {
            console.error(error);
        }

        // Vérification de la route GET /api/genshin/characters/value/ayaka
        try {
            const response = await axios.get("http://localhost:3000/api/genshin/characters/value/ayaka");
            if (response.status === 200) {
                console.log("Test API réussi pour la route /api/genshin/characters/value/ayaka");
            } else {
                console.error("Test API échoué pour la route /api/genshin/characters/value/ayaka : ", response.status);
            }
        } catch (error) {
            console.error(error);
        }

        // Vérification de la route POST /api/genshin/characters sans token d'authentification
        try {
            const character: GenshinCharacterInterface = {
                id: 1000,
                name: "Ayaka",
                element: "cry",
                weapon: "sword",
                region: "mondstadt",
                rarity: 5,
                icon: "icon.png",
                ascensionStat: "ascensionStat",
                formatedValue: "ayaka",
            };
            await axios.post("http://localhost:3000/api/genshin/characters", character).then((response) => {
                // Vérifie si la réponse est équivalente à ce qu'il y a dans la base de données
                if (response.status === 401 && response.data.message === "Unauthorized") {
                    console.log("Test API réussi pour la route /api/genshin/characters sans token d'authentification");
                } else {
                    console.error("Test API échoué pour la route /api/genshin/characters sans token d'authentification: ", response.status);
                }

            });
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 401 && error.response.data.message === "Unauthorized") {
                    console.log("Test API réussi pour la route /api/genshin/characters sans token d'authentification");
                }
            } else {
                console.error("An unknown error occurred:", error);
            }
        }

        // Vérification de la route POST /api/genshin/characters avec token d'authentification
        try {
            const character: GenshinCharacterInterface = {
                id: 1000,
                name: "Ayaka",
                element: "cry",
                weapon: "sword",
                region: "mondstadt",
                rarity: 5,
                icon: "icon.png",
                ascensionStat: "ascensionStat",
                formatedValue: "ayaka",
            };
            await axios.post("http://localhost:3000/api/genshin/characters", character, {
                headers: {
                    Authorization: `${process.env.API_TOKEN}`,
                },
            }).then((response) => {
                // Vérifie si la réponse est équivalente à ce qu'il y a dans la base de données
                if (response.status === 200) {
                    console.log("Test API réussi pour la route POST /api/genshin/characters avec token d'authentification");
                } else {
                    console.error("Test API échoué pour la route /api/genshin/characters avec token d'authentification : ", response.status);
                }
            });
        } catch (error) {
            console.error(error);
        }

        // Vérification de la route PUT /api/genshin/characters avec token d'authentification
        try {
            const character: GenshinCharacterInterface = {
                id: 1000,
                name: "TEST ENCORE",
                element: "cry",
                weapon: "sword",
                region: "mondstadt",
                rarity: 5,
                icon: "icon.png",
                ascensionStat: "ascensionStat",
                formatedValue: "ayaka",
            };
            await axios.put("http://localhost:3000/api/genshin/characters", character, {
                headers: {
                    Authorization: `${process.env.API_TOKEN}`,
                },
            }).then((response) => {
                // Vérifie si la réponse est équivalente à ce qu'il y a dans la base de données
                if (response.status === 200) {
                    console.log("Test API réussi pour la route PUT /api/genshin/characters avec token d'authentification");
                } else {
                    console.error("Test API échoué pour la route /api/genshin/characters avec token d'authentification : ", response.status);
                }
            });
        } catch (error) {
            console.error(error);
        }

        // Vérification de la route DELETE /api/genshin/characters avec token d'authentification
        try {
            await axios.delete("http://localhost:3000/api/genshin/characters/", {
                data: { id: 1000 },
                headers: {
                    Authorization: `${process.env.API_TOKEN}`,
                },
            }).then((response) => {
                // Vérifie si la réponse est équivalente à ce qu'il y a dans la base de données
                if (response.status === 200) {
                    console.log("Test API réussi pour la route DELETE /api/genshin/characters avec token d'authentification");
                } else {
                    console.error("Test API échoué pour la route /api/genshin/characters avec token d'authentification : ", response.status);
                }
            });
        }
        catch (error) {
            console.error(error);
        }
    }
}
