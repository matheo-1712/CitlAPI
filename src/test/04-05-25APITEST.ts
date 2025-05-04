import axios from "axios";
import { GenshinCharacterModel } from "../models/GenshinCharacterModel";
import { GenshinCharacterInterface } from "../interfaces/GenshinCharacterInterface";

export class APITEST {
    public static async test() {
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

       try {
           const response = await axios.get("http://localhost:3000/api/genshin/characters/value/ayaka");
           // Vérifie si la réponse est équivalente à ce qu'il y a dans la base de données
              if (response.status === 200) {
                console.log("Test API réussi pour la route /api/genshin/characters/value/ayaka");
              } else {
                console.error("Test API échoué pour la route /api/genshin/characters/value/ayaka : ", response.status);
              }
       } catch (error) {
           console.error(error);
       }

       try {
        const character : GenshinCharacterInterface = {
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
        const response = await axios.post("http://localhost:3000/api/genshin/characters", character);
        // Vérifie si la réponse est équivalente à ce qu'il y a dans la base de données
           if (response.status === 200) {
             console.log("Test API réussi pour la route /api/genshin/characters");
           } else {
             console.error("Test API échoué pour la route /api/genshin/characters: ", response.status);
           }
       } catch (error) {
           console.error(error);
       }
    }
}