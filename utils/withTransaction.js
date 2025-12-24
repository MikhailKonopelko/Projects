export async function withTransaction(sequelize, work) {
  const transaction = await sequelize.transaction();
  try {
    const result = await work({ transaction });
    await transaction.commit();
    return result;
  } catch (error) {
    try {
      await transaction.rollback();
    } catch (_) {
    }
    throw error;
  }
}


