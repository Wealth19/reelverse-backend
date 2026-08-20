const axios = require("axios");
const ENDPOINTS = require("./endpoints");

const getAccessToken = async () => {
  try {
    const credentials = `${process.env.MONNIFY_API_KEY}:${process.env.MONNIFY_SECRET_KEY}`;

    const encodedCredentials = Buffer.from(credentials).toString("base64");

    const response = await axios.post(
      `${process.env.MONNIFY_BASE_URL}${ENDPOINTS.LOGIN}`,
      {},
      {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
        },
      },
    );

    return response.data.responseBody.accessToken;
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw error;
  }
};

module.exports = getAccessToken;
