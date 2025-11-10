/**
 * Wrap a unit of work in a database transaction.
 * Ensures rollback on error and commit on success.
 * Passes the `transaction` to the provided function.
 *
 * @param {import('sequelize').Sequelize} sequelize
 * @param {(ctx: { transaction: import('sequelize').Transaction }) => Promise<any>} work
 */
async function withTransaction(sequelize, work) {
  const transaction = await sequelize.transaction();
  try {
    const result = await work({ transaction });
    await transaction.commit();
    return result;
  } catch (error) {
    try {
      await transaction.rollback();
    } catch (_) {
      // ignore rollback errors
    }
    throw error;
  }
}

module.exports = { withTransaction };


