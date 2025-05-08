// src/services/InfographicService.ts
import puppeteer, { Browser, Page } from "puppeteer";
import { Service } from "./Service";
import { InfographicInterface } from "../interfaces/InfographicInterface";
import { GenshinCharacterModel } from "../models/GenshinCharacterModel";
import { InfographicRepository } from "../repositories/InfographicRepository";
import { GenshinCharacterInterface } from "../interfaces/GenshinCharacterInterface";

/**
 * InfographicService class
 * @classdesc This class represents an infographic service is used to manage the infographic data.
 * @extends Service
 */

export class InfographicService extends Service {

    private static readonly listeBuilds_GI: string[] = ["Classique", "freeze", "melt-build", "melt", "melt-dps", "support", "teams", "burgeon-build", "melt-bunny-bomber-dps-build",
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

    // Méthode pour démarrer le navigateur Puppeteer
    private async startBrowser(): Promise<void> {
        try {
            // Lancer le navigateur
            InfographicService.browser = await puppeteer.launch({ headless: true });
            InfographicService.page = await InfographicService.browser.newPage();

            // Vérifier si le navigateur est lancé
            if (!InfographicService.browser) {
                this.logError("Erreur lors du lancement du navigateur de puppeteer");
            }
        }
        catch (error) {
            console.error("Erreur lors du lancement du navigateur de puppeteer:", error);
            return;
        }
    }

    // Méthode pour récupérer l'ensemble des personnages de Genshin
    private async getGIAllCharacters(): Promise<GenshinCharacterInterface[]> {
        return await InfographicService.modelsGenshin.getAll();
    }

    // Méthode pour récupérer l'ensemble des personnages de HSR
    private async getHSRAllCharacters(): Promise<void> {
        // TODO : A FAIRE
        return this.logError("Cette méthode n'est pas encore implémentée.");
    }

    // Méthode pour récupérer les infographies et les enregistrer dans la base de données
    private async fetchInfographics(character: string, build: string): Promise<string | null> {
        // Vérifier si le navigateur est déjà lancé, sinon le démarrer
        if (!InfographicService.page) {
            await this.startBrowser();
        }

        // Vérifie quelle type de build est demandé
        let url: string;
        if (build === 'Classique') {
            url = InfographicService.baseUrl + character.toLowerCase() + '/';
        } else {
            url = InfographicService.baseUrl + character.toLowerCase() + '-' + build + '/';
        }

        // Vérifier si l'URL est valide
        const response = await fetch(url);
        if (response.status === 404) {
            return null;
        }

        // Aller à l'URL
        await InfographicService.page.goto(url, { waitUntil: 'networkidle2' });

        // Obtenir l'URL finale après exécution du JavaScript
        const finalUrl = InfographicService.page.url();

        // Vérifier si l'URL finale est valide (ne renvoie pas une erreur 404)
        const responseFinal = await fetch(finalUrl);
        if (responseFinal.status === 404 || url === finalUrl) {
            return null;
        }
        return finalUrl;
    }

    private async processCharacterInfographics(character: GenshinCharacterInterface): Promise<void> {
        for (const build of InfographicService.listeBuilds_GI) {
            const buildUrl = await this.fetchInfographics(character.formatedValue, build);

            // Si l'url est nulle, on passe à l'itération suivante
            if (!buildUrl) continue;

            const buildName = this.formatBuildName(build);

            const infographic: InfographicInterface = {
                id_genshin_character: character.id,
                jeu: "GI",
                url: buildUrl ?? '',
                build: buildName,
                source: 'keqingmains',
            };

            await this.saveOrUpdateInfographic(infographic);
        }
    }

    private formatBuildName(build: string): string {
        return build.charAt(0).toUpperCase() + build.slice(1);
    }

    private async saveOrUpdateInfographic(infographic: InfographicInterface): Promise<void> {
        try {
            const existingInfographic = await InfographicService.repositoryInfographic.exists(infographic);
            if (existingInfographic) {
                InfographicService.repositoryInfographic.updateInfographic(existingInfographic);
            } else {
                InfographicService.repositoryInfographic.saveGI(infographic);
            }
        } catch (error) {
            console.error("Erreur lors de l'enregistrement de l'infographie:", error);
        }
    }

    // Méthode pour récupérer les infographies et les enregistrer dans la base de données
    public async saveInfographics_GI(): Promise<void> {
        // Démarrer le navigateur Puppeteer
        await this.startBrowser();
        try {
            const charactersList = await this.getGIAllCharacters();

            for (const character of charactersList) {
                await this.processCharacterInfographics(character);
            }
        } catch (error) {
            this.logError("Erreur lors de la récupération des infographies", error instanceof Error ? error.message : String(error));
        }
    }
}