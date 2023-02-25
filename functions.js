const g = require("./users");
const malScraper = require("mal-scraper");
const QuickChart = require("quickchart-js");

// function that returns info about a user
export function getUser(cs) {
    return new Promise((resolve, reject) => {
        let rpm = '';
        g.getUser(cs)
            .then((data) => {
                for (let prop in data)
                    rpm = rpm + '**' + prop + ':**' + '\t' + data[prop] + '\n';
                if (rpm !== "")
                    resolve(rpm); // Resolve the Promise with the updated value of rpm
                else
                    resolve("User doesn't exist!");
            }).catch((err) => reject(err));
    });
}

// function that returns pictures of a show
export function getPictures(cs) {
    return new Promise((resolve, reject) => {
        malScraper.getPictures(cs)
            .then((data) => {
                let rpm = "";
                const finalObj = {}
                for(let prop1 in data){
                    Object.assign(finalObj, data[prop1])
                    for(let prop2 in finalObj) {
                        rpm = rpm + prop2 + ': ' + finalObj[prop2] + '\n'
                    }
                }
                if (rpm !== "")
                    resolve(rpm); // Resolve the Promise with the updated value of rpm
                else
                    resolve("This series doesn't exists!");
            }).catch((err) => reject(err));
    });
}

// function that returns stats of a show in a visual way
export function getStats(cs){
    return new Promise((resolve, reject) => {
        malScraper.getStats(cs).then(async (data) => {
            let states = []
            for (let prop in data)
                states.push(data[prop])
            const chart = new QuickChart();
            chart.setConfig({
                type: 'bar',
                data: {
                    labels: ['Watching', 'Completed', 'On Hold', 'Dropped', 'PTW'],
                    datasets: [{
                        label: 'User State',
                        data: [states[0], states[1], states[2], states[3], states[4]],
                        backgroundColor: '#4effdf'
                    }]
                },
                options: {
                    plugins: {
                        datalabels: {
                            color: '#fff'
                        }
                    }
                }
            });
            let url = await chart.getShortUrl();
            resolve(`User States: ${url}`);
            chart.setConfig({
                type: 'bar',
                data: { labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
                    datasets: [{ label: 'User Rating', data: [states[15], states[14], states[13], states[12], states[11],
                            states[10], states[9], states[8], states[7], states[6] ] }]
                },
                options: {
                    plugins: {
                        datalabels: {
                            color: '#fff'
                        }
                    }
                }
            });
            url = await chart.getShortUrl();
            resolve(`User Rating: ${url}`);
        }).catch((err) => reject(err));
    });
}

// function that returns info for a series
export function getInfo(cs){
    return new Promise((resolve, reject) => {
        let rpm = "";
        malScraper.getInfoFromName(cs, true).then((data) => {
            for(let prop in data) {
                if(prop !== 'characters' && prop !== 'staff')
                    rpm = rpm + '**' + prop + ':**' + '\t' + data[prop] + '\n'
            }
            if (rpm !== "")
                resolve(rpm); // Resolve the Promise with the updated value of rpm
            else
                resolve("Series doesn't exist!");
        }).catch((err) => reject(err))
    });
}
