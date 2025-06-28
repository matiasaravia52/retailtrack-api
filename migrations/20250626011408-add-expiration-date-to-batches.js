'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Verificar si la columna ya existe para evitar errores
      const tableInfo = await queryInterface.describeTable('batches');
      
      if (!tableInfo.expiration_date) {
        // Añadir la columna expiration_date a la tabla batches
        await queryInterface.addColumn('batches', 'expiration_date', {
          type: Sequelize.DATE,
          allowNull: true,
          after: 'unit_cost' // Añadir después de la columna unit_cost
        });
        console.log('Columna expiration_date añadida correctamente a la tabla batches');
      } else {
        console.log('La columna expiration_date ya existe en la tabla batches');
      }
    } catch (error) {
      console.error('Error al añadir la columna expiration_date:', error);
      throw error;
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Verificar si la columna existe antes de intentar eliminarla
      const tableInfo = await queryInterface.describeTable('batches');
      
      if (tableInfo.expiration_date) {
        // Eliminar la columna expiration_date de la tabla batches
        await queryInterface.removeColumn('batches', 'expiration_date');
        console.log('Columna expiration_date eliminada correctamente de la tabla batches');
      } else {
        console.log('La columna expiration_date no existe en la tabla batches');
      }
    } catch (error) {
      console.error('Error al eliminar la columna expiration_date:', error);
      throw error;
    }
  }
};
