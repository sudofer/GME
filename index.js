const path = require ('path')
const axios = require('axios');
const notifier = require('node-notifier');
function crossThreshold(currentPrice, previousPrice) {
    var lower = lowerThreshold(previousPrice)
    var upper = upperThreshold(previousPrice)
    if (currentPrice < lower) return lower
    if (currentPrice > upper) return upper
    return null
}
function upperThreshold(previousPrice) {
    return lowerThreshold(previousPrice) + 10;
}
function lowerThreshold(previousPrice) {
    var sany = previousPrice.replace('$', '');
    var noDecimal = Math.floor(sany);
    var divide = noDecimal / 10;
    return Math.floor(divide) * 10
}
setInterval(function () {
    axios.get('https://api.nasdaq.com/api/quote/GME/info?assetclass=stocks')
        .then(function (response) {
            // handle success
            var data = response.data.data
            var lastSale = response.data.data.primaryData.lastSalePrice;
            var previousPrice = data.keyStats.PreviousClose.value
            var thresholdCrossed = crossThreshold(lastSale, previousPrice);
            if (thresholdCrossed != null) {
                var netChange = data.primaryData.netChange
                if (netChange.charAt(0) == '-') {
                    //if negative, it's lower thresh
                    notifier.notify('flash sale! buy dip');
                }
                else {
                    //pissitive
                    notifier.notify('banana');
                }
            }
            else {
                notifier.notify(
                    {
                        title: 'My awesome title',
                        message: 'BANANANA4!',
                        icon: path.join(__dirname, 'upper.jpg'), // Absolute path (doesn't work on balloons)
                        sound: true, // Only Notification Center or Windows Toasters
                        wait: true // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
                    },
                    function (err, response, metadata) {
                        // Response is response from notification
                        // Metadata contains activationType, activationAt, deliveredAt
                    }
                );

            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });



}, 30 * 1000)
notifier.notify(
    {
        title: 'My awesome title',
        message: 'BANANANANA',
        icon: path.join(__dirname, 'upper.jpg'), // Absolute path (doesn't work on balloons)
        sound: true, // Only Notification Center or Windows Toasters
        wait: false, // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
        timeout: 2,
    },
    function (err, response, metadata) {
        // Response is response from notification
        // Metadata contains activationType, activationAt, deliveredAt
    }
);


