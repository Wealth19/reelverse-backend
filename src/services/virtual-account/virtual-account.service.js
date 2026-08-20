const dbConnection = require("../../configuration/db");
const AppError = require("../../utils/AppError");

const monnifyService = require("../../third-party/monnify/monnify.service");

class VirtualAccountService {
  /**
   * Create virtual account for user
   */
  async createUserVirtualAccount(user, connection = dbConnection) {
    try {
      // Check existing virtual account

      const [[existingAccount]] = await connection.query(
        `
          SELECT *
          FROM user_virtual_accounts
          WHERE user_id = ?
        `,
        [user.id],
      );

      if (existingAccount) {
        return existingAccount;
      }

      const accountReference = `USER_${user.id}_${Date.now()}`;

      // Create account with Monnify

      const account = await monnifyService.createReservedAccount({
        accountReference,

        accountName: user.name,

        customerName: user.name,

        customerEmail: user.email,
      });

      // Save account locally

      const [result] = await connection.query(
        `
          INSERT INTO user_virtual_accounts
          (
            user_id,
            provider,
            account_reference,
            account_number,
            bank_name,
            bank_code,
            account_name,
            currency,
            response_body
          )

          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)

        `,

        [
          user.id,

          "MONNIFY",

          accountReference,

          account.accountNumber,

          account.bankName,

          account.bankCode,

          account.accountName,

          "NGN",

          JSON.stringify(account),
        ],
      );

      const [[createdAccount]] = await connection.query(
        `
          SELECT *
          FROM user_virtual_accounts
          WHERE id = ?
        `,

        [result.insertId],
      );

      return createdAccount;
    } catch (error) {
      throw new AppError(
        error.message || "Unable to create virtual account.",
        500,
      );
    }
  }

  /**
   * Get user's virtual account
   */

  async getUserVirtualAccount(userId) {
    const [[account]] = await dbConnection.query(
      `
        SELECT *
        FROM user_virtual_accounts
        WHERE user_id = ?
      `,

      [userId],
    );

    if (!account) {
      throw new AppError("Virtual account not found.", 404);
    }

    return account;
  }
}

module.exports = new VirtualAccountService();
