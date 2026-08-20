// require("dotenv").config();

// const baseUrl = process.env.MONNIFY_BASE_URL;

// async function generateVirtualAccount() {
//   // GENERATE AUTH TOKEN
//   // 1. FETCH TOKEN FROM DB, CHECK IF TOKEN IS NOT EXPIRED
//   // 2. IF NOT EXPIRED, USE IT
//   // 3. ELSE IF EXPIRED, GENERATE NEW TOEKN
//   const token = await auth();

//   fetch(`${baseUrl}/v2/bank-transfer/reserved-accounts`, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },

//     body: JSON.stringify({
//       accountReference: "abc1niui23",
//       accountName: "Test Reserved Account",
//       currencyCode: "NGN",
//       contractCode: process.env.MONNIFY_CONTRACT_CODE,
//       customerEmail: "test@tester.com",
//       customerName: "John Doe",
//       bvn: "21212121212",
//       getAllAvailableBanks: "true",2
//       preferredBanks: ["50515"],
//       incomeSplitConfig: [
//         {
//           subAccountCode: "MFY_SUB_319452883228",
//           feePercentage: 10.5,
//           splitPercentage: 20,
//           feeBearer: true,
//           splitAmount: 100,
//         },
//       ],
//       restrictPaymentSource: true,
//       allowedPaymentSources: {
//         bvns: ["21212121212", "20202020202"],
//         bankAccounts: [
//           {
//             accountNumber: "0068687503",
//             bankCode: "232",
//           },
//         ],
//         accountNames: ["SAMUEL DAMILARE OGUNNAIKE"],
//       },
//       nin: "12345678901",
//     }),
//   });
// }

const axios = require("axios");
const crypto = require("crypto");
const getAccessToken = require("./auth");
const ENDPOINTS = require("./endpoints");
const AppError = require("../../utils/AppError");

class MonnifyService {
  // =====================================
  // INITIALIZE PAYMENT
  // =====================================

  async initializeTransaction(data) {
    try {
      const accessToken = await getAccessToken();

      const response = await axios.post(
        `${process.env.MONNIFY_BASE_URL}${ENDPOINTS.INITIALIZE_TRANSACTION}`,

        {
          amount: Number(data.amount),

          customerName: data.customerName,

          customerEmail: data.customerEmail,

          paymentReference: data.paymentReference,

          paymentDescription: data.paymentDescription || "Wallet Funding",

          currencyCode: "NGN",

          contractCode: process.env.MONNIFY_CONTRACT_CODE,

          redirectUrl: `${process.env.CLIENT_URL}/payment/callback`,

          paymentMethods: ["CARD", "ACCOUNT_TRANSFER", "USSD"],
        },

        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      const transaction = response.data.responseBody;

      return {
        paymentReference: transaction.paymentReference,

        transactionReference: transaction.transactionReference,

        checkoutUrl: transaction.checkoutUrl,

        responseBody: transaction,
      };
    } catch (error) {
      throw new AppError(
        error.response?.data?.responseMessage ||
          "Unable to initialize payment.",

        error.response?.status || 500,
      );
    }
  }

  // =====================================
  // VERIFY PAYMENT
  // =====================================

  async verifyTransaction(transactionReference) {
    try {
      const accessToken = await getAccessToken();

      const response = await axios.get(
        `${process.env.MONNIFY_BASE_URL}${ENDPOINTS.VERIFY_TRANSACTION}/${transactionReference}`,

        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const transaction = response.data.responseBody;

      return {
        paymentReference: transaction.paymentReference,

        transactionReference: transaction.transactionReference,

        paymentStatus: transaction.paymentStatus,

        paymentMethod: transaction.paymentMethod,

        amountPaid: Number(transaction.amountPaid),

        currency: transaction.currency,

        paidOn: transaction.paidOn,

        rawResponse: transaction,
      };
    } catch (error) {
      throw new AppError(
        error.response?.data?.responseMessage ||
          "Unable to verify transaction.",

        error.response?.status || 500,
      );
    }
  }

  // =====================================
  // WEBHOOK SIGNATURE VALIDATION
  // =====================================

  verifyWebhookSignature(signature, rawBody) {
    if (!signature) {
      return false;
    }

    const hash = crypto
      .createHmac("sha512", process.env.MONNIFY_SECRET_KEY)
      .update(rawBody)
      .digest("hex");

    return hash === signature;
  }

  // =====================================
  // CREATE RESERVED ACCOUNT
  // =====================================

  async createReservedAccount(data) {
    try {
      const accessToken = await getAccessToken();

      const response = await axios.post(
        `${process.env.MONNIFY_BASE_URL}${ENDPOINTS.RESERVED_ACCOUNT}`,
        {
          accountReference: data.accountReference,

          accountName: data.accountName,

          currencyCode: "NGN",

          contractCode: process.env.MONNIFY_CONTRACT_CODE,

          customerEmail: data.customerEmail,

          customerName: data.customerName,

          getAllAvailableBanks: true,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      const account = response.data.responseBody;

      return {
        accountNumber: account.accounts?.[0]?.accountNumber,

        bankName: account.accounts?.[0]?.bankName,

        bankCode: account.accounts?.[0]?.bankCode,

        accountName: account.accounts?.[0]?.accountName || data.accountName,

        rawResponse: account,
      };
    } catch (error) {
      console.log(
        "Monnify Reserved Account Error:",
        error.response?.data || error.message,
      );

      throw new AppError(
        error.response?.data?.responseMessage ||
          "Unable to create reserved account.",

        error.response?.status || 500,
      );
    }
  }
}

module.exports = new MonnifyService();
