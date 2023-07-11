
const rates = {
    eur: [],
    usd: []
}
const labels = [];

const getRatesForDate = (date) => {

    const URL = `https://www.bnm.md/ro/official_exchange_rates?get_xml=1&date=${date}`;

    const xhr = new XMLHttpRequest();
    xhr.open('GET', URL)
    xhr.send();


    xhr.onload = () => {
        let res = xhr.responseText


        ///parsing XML
        let xmlParser = new DOMParser();

        let xmlDoc = xmlParser.parseFromString(res, "text/xml");

        let eur = xmlDoc.querySelector('[ID="47"]');
        let usd = xmlDoc.querySelector('[ID="44"]');

        //EUR & USD-> MDL
        let valueEur = parseFloat(eur.lastElementChild.innerHTML);
        let valueUsd = parseFloat(usd.lastElementChild.innerHTML);

        rates.eur.push(valueEur);
        rates.usd.push(valueUsd);

        //   console.log(usd)
    }

}

const getRates = (fromDate, toDate) => {
    for (let date = fromDate; date <= toDate; date++) {

        if (date < 10) {
            date = `0${date}`;
        }
        labels.push(`${date}.07.2023`);
        getRatesForDate(`${date}.07.2023`);
    }
}
getRates(1, 11);

const plotData = () => {
    const ctx = document.getElementById('ratesChart');
    let minDataValue = Math.min(...rates.eur, ...rates.usd);
    let maxDataValue = Math.max(...rates.eur, ...rates.usd);

    console.log(minDataValue, maxDataValue)

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'EUR',
                data: rates.eur,
                borderColor: 'rgb(220, 20, 60)',
                backgroundColor: 'rgb(220, 20, 60)',
                yAxisID: 'y',
            },
            {
                label: 'USD',
                data: rates.usd,
                borderColor: 'rgb(0, 250, 154)',
                backgroundColor: 'rgb(0, 250, 154)',
                yAxisID: 'y1',
            }
        ]
    };

    const config = {
        type: 'line',
        data: data
    }

    const stackedLine = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            stacked: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Hystorical Exchange Rates EUR & USD / MDL'
                }
            },
            scales: {
                y: {
                    suggestedMin: minDataValue,
                    suggestedMax: maxDataValue
                },
                y1: {
                    type: 'linear',
                    display: false,
                    position: 'right',
                    suggestedMin: minDataValue,
                    suggestedMax: maxDataValue
                }
            }
        }
    });
};






setTimeout(plotData, 2000)

console.log(rates)

//HW try to display a second currency in paralel USD