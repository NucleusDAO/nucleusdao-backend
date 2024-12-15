const axios = require('axios');

exports.getAeternityPrice = async (req, res) => {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=aeternity&vs_currencies=usd'
    );
    console.log(response.data);
    const price = response.data.aeternity.usd;
    res.send({ price: price });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: 'Failed to retrieve price', error: error.message });
  }
};
