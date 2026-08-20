// =========================
// FIND WALLET BY ID
// =========================
const findOneWallet = async (id, lock = false, connection = dbConnection) => {
  let sql = `
    SELECT *
    FROM wallet
    WHERE id = ?
  `;

  if (lock) {
    sql += " FOR UPDATE";
  }

  const [[wallet]] = await connection.query(sql, [id]);

  if (!wallet) {
    throw new AppError("Wallet record not found.", 404);
  }

  return wallet;
};

// =========================
// FIND WALLET BY USER ID
// =========================
const findOneWalletByUserId = async (
  queryObject,
  lock = false,
  connection = dbConnection,
) => {
  let sql = `
    SELECT *
    FROM wallet
    WHERE user_id = ?
  `;

  if (lock) {
    sql += " FOR UPDATE";
  }

  const [[wallet]] = await connection.query(sql, [queryObject.userId]);

  if (!wallet) {
    throw new AppError("Wallet record not found.", 404);
  }

  return wallet;
};

module.exports = {
  findOneWallet,
  findOneWalletByUserId,
};