
//Make them lines look pretty!
function getColor(stock){
    if(stock === "GME"){
        return 'rgba(61, 161, 61, 0.7)'
    }
    if(stock === "MSFT"){
        return 'rgba(209, 4, 25, 0.7)'
    }
    if(stock === "DIS"){
        return 'rgba(18, 4, 209, 0.7)'
    }
    if(stock === "BNTX"){
        return 'rgba(166, 43, 158, 0.7)'
    }
}

//Highest stock price function
function findHighest(values) {
    let highest = 0;
    values.forEach(value => {
        if (parseFloat(value.high) > highest) {
            highest = value.high
        }
    })
    return highest
}

//Main function for all of this
async function main() {

    const timeChartCanvas = document.querySelector('#time-chart');
    const highestPriceChartCanvas = document.querySelector('#highest-price-chart');
    const averagePriceChartCanvas = document.querySelector('#average-price-chart');

    //ChartJS Fetch API Request - took me forever to figure out to change the interval from 1 minute to 1 day to make it look right
    const response = await fetch('https://api.twelvedata.com/time_series?symbol=GME,MSFT,DIS,BNTX&interval=1day&apikey=82afa2aab5a44788ae09f2a5eb73255d')

    //Parse the response
    const result = await response.json();

    //Log the response
    console.log(result);

    //Destructuring syntax - turns the object into an arry on line 19
    //Already hit my limit on API requests in a minute says console.log ;)
    const { GME, MSFT, DIS, BNTX } = result;

    const stocks = [GME, MSFT, DIS, BNTX];

    //Reverse values for each stock from descending to ascending
    stocks.forEach( stock => stock.values.reverse());


    //Define first chart for time
    new Chart(timeChartCanvas.getContext('2d'), {
        type: 'line',
        data: {
            labels: stocks[0].values.map(value => value.datetime),
            datasets: stocks.map( stock => ({
                label: stock.meta.symbol,
                data: stock.values.map(value => parseFloat(value.high)),
                backgroundColor:  getColor(stock.meta.symbol),
                borderColor: getColor(stock.meta.symbol),
            }))
        }
    });
    
    //Define second chart for highest price - reference findHighest function
        new Chart(highestPriceChartCanvas.getContext('2d'), {
            type: 'bar',
            data: {
                labels: stocks.map(stock => stock.meta.symbol),
                datasets: [{
                    label: 'Highest',
                    backgroundColor: stocks.map(stock => (
                        getColor(stock.meta.symbol)
                    )),
                    borderColor: stocks.map(stock => (
                        getColor(stock.meta.symbol)
                    )),
                    data: stocks.map(stock => (
                        findHighest(stock.values)
                    ))
                }]
            }
        });
    

}

main()