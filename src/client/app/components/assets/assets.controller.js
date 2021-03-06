import { Util } from "../../util.js";
import { AssetsService } from "./assets.service.js";
import { BasketComponent } from "../basket/basket.component.js";
import { StatsComponent } from "../stats/stats.component.js";

export class AssetsController {
    constructor(render, template) {
        this.render = render;
        this.template = template;
        this.events = (e, payload) => Util.handleEvent(this, e, payload);
        this.state = {
            assets: AssetsService.getAssets(),
            weightsTD: [],
            weightsYTD: []
        };

        this.update();
    }

    update() {
        this.resetWeights();

        if (this.state.assets.length >= 3) {
            AssetsService.calcOptimalPortfolio().then(res => {
                this.state.weightsTD = res.optim.solution;
                this.template.update(this.render, this.state, this.events);
                AssetsService.saveAssets();
            });
            AssetsService.calcOptimalPortfolioYearToDate().then(res => {
                this.state.weightsYTD = res.optim.solution;
                this.template.update(this.render, this.state, this.events);
                AssetsService.saveAssets();
            });
        }

        this.template.update(this.render, this.state, this.events);
        AssetsService.saveAssets();
    }

    onAssetClick(e) {
        const item = JSON.parse(unescape(e.target.dataset.value));
        const isRemoved = AssetsService.removeAsset(item);

        if (isRemoved) {
            BasketComponent.update();
            StatsComponent.update();
            this.update();
        }
    }

    resetWeights() {
        this.state.assets.forEach((asset, index) => {
            this.state.weightsTD[index] = 0;
            this.state.weightsYTD[index] = 0;
        });
    }
}
