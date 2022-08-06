
import { chaosBag } from "./chaos_bag";
import {
    Chart,
    ArcElement,
    LineElement,
    PointElement,
    LineController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip,
    SubTitle
} from 'chart.js';

Chart.register(
    ArcElement,
    LineElement,
    PointElement,
    LineController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip,
    SubTitle
);

export function setupOutcomeView(element) {
    // chaosBag.setCount('frost', 4);
    element.innerHTML = `<div class="outcome-container card"><canvas id="outcomesChart"></canvas></div>`;

    // Colors - dark by default
    Chart.defaults.color = 'rgb(255, 255, 255, 0.95)';
    let gridColor = 'rgb(255, 255, 255, 0.3)';
    let lineColors = [
        'rgb(147,248,255)',
        'rgb(115,185,255)',
        'rgb(89,125,255)'
    ];


    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        Chart.defaults.color = '#1b1b1b';
        gridColor = 'rgb(30, 30, 30, 0.3)';
        lineColors = [
            'rgb(147,248,255)',
            'rgb(115,185,255)',
            'rgb(89,125,255)'        ];
    }

    const thresholds = [0, 2, 3];

    // Data
    const { labels, chances } = chaosBag.chance(thresholds);
    // const labels = Array.from({ length: chances[0].length }, (_, idx) => start + idx);
    const dataSetList = [];
    for (const [threshold, dataPoints] of Object.entries(chances)) {
        const thresholdNum = parseInt(threshold);
        dataPoints.push(100);  // Sets the y-scale in chart.js
        const dataSet = {
            label: thresholdNum === 0 ? 'success' : `succeed by ${thresholdNum}`,
            backgroundColor: lineColors[dataSetList.length],
            borderColor: lineColors[dataSetList.length],
            data: dataPoints
        };
        dataSetList.push(dataSet);
    }

    const data = {
        labels: labels,
        datasets: dataSetList
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            scales: {
                x: {
                    grid: {
                        color: gridColor
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: gridColor
                    }
                }
            }
            // plugins: {
            //     legend: {
            //         labels: {
            //             color: 'red'
            //         }
            //     }
            // }
        }
    };

    const outcomesChart = new Chart(document.getElementById('outcomesChart'), config);
    chaosBag.onChange(function () {
        const { chances } = chaosBag.chance(thresholds);
        outcomesChart.data.datasets.forEach((dataSet, idx) => dataSet.data = [...chances[thresholds[idx]], 100]);
        outcomesChart.update();
    });
}
