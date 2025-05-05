// src/services/InfographicService.ts
import puppeteer, { Browser, Page } from "puppeteer";
import { Service } from "./Service";
import { InfographicInterface } from "../interfaces/InfographicInterface";
import { GenshinCharacterModel } from "../models/GenshinCharacterModel";
import { InfographicRepository } from "../repositories/InfographicRepository";

/**
 * InfographicService class
 * @classdesc This class represents an infographic service is used to manage the infographic data.
 * @extends Service
 */

export class InfographicService extends Service {

    private static readonly listeBuilds_GI: string[] = ["freeze", "melt-build", "melt", "melt-dps", "support", "teams", "burgeon-build", "melt-bunny-bomber-dps-build",
        "melt-charged-shot-dps-build", "teams", "bloom", "dps", "support", "mechanics", "quickswap", "support",
        "c6-aggravate", "hyperbloom", "cryo-dps", "physical-dps", "freeze", "melt", "quadratic-scaling",
        "driver", "sunfire", "electro", "aggravate", "burgeon", "on-field-dps", "nilou-bloom", "off-field-support",
        "on-field-driver", "on-field-dps-build", "c6-dps", "reaction", "off-field", "aggravate", "hyperbloom",
        "on-field", "physical", "transformative", "reverse-melt", "off-field", "on-field", "quicken",
        "burgeon", "freeze-and-mono-cryo-dps", "pyro", "shielder"];

    private static readonly listeBuilds_HSR: string[] = ["dps", "support", "healer", "tank", "sub-dps", "off-field-dps"]

    private static page: Page;
    private static browser: Browser;
    private static readonly baseUrl: string = 'https://keqingmains.com/i/'
    private static readonly modelsGenshin = new GenshinCharacterModel({});
    private static readonly repositoryInfographic = new InfographicRepository();

    constructor() {
        super("InfographicService");
    }

    // Méthode pour récupérer les infographies et les enregistrer dans la base de données
    static async saveInfographics_GI(): Promise<void> {
        try {
            // Lancer le navigateur
            InfographicService.browser = await puppeteer.launch({ headless: true });
            InfographicService.page = await InfographicService.browser.newPage();
        }
        catch (error) {
            console.error("Erreur lors du lancement du navigateur de puppeteer:", error);
            return;
        }

        try {

            const charactersList = await InfographicService.modelsGenshin.getAll();

            for (const character of charactersList) {

                // Récupérer l'url de l'infographie
                const defaultUrl = InfographicService.baseUrl + character.formatedValue.toLowerCase() + '/';

                // Vérifier si le lien est valide et ne renvoie pas une erreur 404 (avec fetch)
                const response = await fetch(defaultUrl);
                if (response.status !== 404) {

                    // Ouvrir la page de l'infographie
                    await InfographicService.page.goto(defaultUrl, { waitUntil: 'networkidle2' });

                    // Récupérer l'url de l'infographie
                    const url = InfographicService.page.url();

                    // Enregistrer l'infographie dans la base de données
                    const infographic: InfographicInterface = {
                        id_genshin_character: character.id,
                        jeu: "GI",
                        url: url,
                        build: 'Classique',
                        source: 'keqingmains',
                    }

                    try {
                        if (await InfographicService.repositoryInfographic.exists(infographic)) {
                            InfographicService.repositoryInfographic.updateInfographic(infographic);
                        } else {
                            InfographicService.repositoryInfographic.saveGI(infographic);
                        }
                    } catch (error) {
                        console.error("Erreur lors de l'enregistrement de l'infographie:", error);
                    }
                }

                for (const build of InfographicService.listeBuilds_GI) {

                    const url = InfographicService.baseUrl + character.formatedValue.toLowerCase() + '-' + build + '/';

                    // Vérifier si le lien est valide et ne renvoie pas une erreur 404 (avec fetch)
                    const response = await fetch(url);
                    if (response.status !== 404) {

                        // Aller à l'URL
                        await InfographicService.page.goto(url, { waitUntil: 'networkidle2' });

                        // Obtenir l'URL finale après exécution du JavaScript
                        const finalUrl = InfographicService.page.url(); // Ce sera l'URL finale après redirection

                        // Gestion du nom des builds
                        let buildName: string;

                        if (build === 'melt-build' || build === 'melt-dps') {
                            buildName = 'Melt';
                        } else if (build === 'on-field-dps-build' || build === 'on-field-dps') {
                            buildName = 'On-Field';
                        }
                        else {
                            buildName = build.charAt(0).toUpperCase() + build.slice(1);
                        }


                        // Enregistrer l'infographie dans la base de données
                        const infographic: InfographicInterface = {
                            id_genshin_character: character.id,
                            jeu: "GI",
                            url: finalUrl,
                            build: buildName,
                            source: 'keqingmains',
                        }

                        try {
                            if (await InfographicService.repositoryInfographic.exists(infographic)) {
                                InfographicService.repositoryInfographic.updateInfographic(infographic);
                            } else {
                                InfographicService.repositoryInfographic.saveGI(infographic);
                            }
                        } catch (error) {
                            console.error("Erreur lors de l'enregistrement de l'infographie:", error);
                        }
                    }
                }
            }
            // Fermer le navigateur
            await InfographicService.browser.close();
        } catch (error) {
            // Fermer le navigateur en cas d'erreur
            await InfographicService.browser.close();
            console.error("Erreur lors de la récupération de l'infographie:", error);
        }

    };
}