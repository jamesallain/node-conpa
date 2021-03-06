import { ToastsComponent } from "../toasts/toasts.component.js";

export class StatsTemplate {
    static update(render, { symbol = "" } = {}) {
        if (!symbol) {
            render`
                <h2>Last Asset Stats</h2>

                No stats available for last asset.
            `;

            return;
        }

        workway("node://finance.js").then(async({ namespace: finance }) => {
            /* eslint-disable indent */
            render`
                <h2>Last Asset Stats ${symbol}</h2>

                ${{
                    any: finance.getKeyStatistics({ symbol }).then(data => {
                        if (!data) {
                            return "Fundamental data not available for the asset.";
                        }

                        const labels = Object.keys(data);

                        return hyperHTML.wire()`
                            <table class="f7 mw8 center pa2" cellpsacing="0">
                                <tbody>${labels.map(label => {
                                    const trClasses = "pv1 pr1 bb b--black-20 tr";
                                    const value = data[label] && data[label].fmt;

                                    if (!value) {
                                        return hyperHTML.wire()`<tr></tr>`;
                                    }

                                    return hyperHTML.wire()`<tr>
                                        <td class="${trClasses}">${label}</td>
                                        <td class="${trClasses}">${value}</td>
                                    </tr>`;
                                })
                            }</tbody>
                            </table>
                        `;
                    }).catch(err => ToastsComponent.update({ message: err.message || err })),
                    placeholder: "Loading..."
                }}
            `;
            /* eslint-enable indent */
        });
    }
}
