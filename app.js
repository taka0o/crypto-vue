// The API we're using for grabbing metadata about each cryptocurrency
let CRYPTOCOMPARE_API_URI = "https://min-api.cryptocompare.com";

// The API we're using for grabbing cryptocurrency prices.
let COINMARKETCAP_API_URI = "https://api.coinmarketcap.com";

// Images path
let CRYPTO_COMPARE = "https://cryptocompare.com";

// The amount of milliseconds (ms) after which we should update
let UPDATE_INTERVAL = 60 * 1000;


let app = new Vue({
  el: "#app",
  data: {
    coins: [],
    coinData: {},
    loading: false
  },
  mounted: function() {
    this.getCoinData();
  },
  computed: {
    orderCoins: function() {
      return _.orderBy(this.coins, 'rank');
    }
  },
  methods: {

    /**
     * Load up all cryptocurrency data.  This data is used to find what logos
     * each currency has, so we can display things in a friendly way.
     */
    getCoinData: function() {
      let self = this;
      this.loading = true;

      axios.get(CRYPTOCOMPARE_API_URI + "/data/all/coinlist")
        .then(response => {
          this.coinData = response.data.Data;
          this.getCoins();
        })
        .catch(error => {
          this.getCoins();
          console.log(error);
        })
    },

    /**
     * Get the top 10 cryptocurrencies by value.  This data is refreshed each 5
     * minutes by the backing API service.
     */
    getCoins: function() {
      let self = this;

      axios.get(COINMARKETCAP_API_URI + "/v2/ticker/")
        .then(response => {
          this.coins = response.data.data;
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
        });

    },

    /**
     * Given a cryptocurrency ticket symbol, return the currency's logo
     * image.
     */
    getCoinImage: function(symbol) {

      if (this.coinData[symbol] == null) { return "No_Image_Available.png"; }
      
      let imageUrl = this.coinData[symbol].ImageUrl;

      if (imageUrl != null) {
        return CRYPTO_COMPARE + this.coinData[symbol].ImageUrl;
      } else {
        return "ajax-loader.gif";
      }
    },


    /**
     * Method that returns CryptoCompare URL for given coin
     */
    getCoinUrl: function(symbol) {
      return CRYPTO_COMPARE + "/coins/" + symbol;
    },
    
    /**
     * Change the color depending on increased or decreased value
     */
    getColor: function(val) {
      return (val > 0 ? "color:green" : "color:red");
    },

    /**
     * Method binded to the update button to manually refresh
     */
    updateButton: function() {
      this.getCoinData();
    }
  }
});

setInterval(() => {
  app.getCoins();
}, UPDATE_INTERVAL);