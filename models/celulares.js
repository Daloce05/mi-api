module.exports = (sequelize, DataTypes) => {
    const celular = sequelize.define('Celular', {
      nombre : {
        type: DataTypes.STRING,
        allowNull: false
      },
      marca : {
        type: DataTypes.STRING,
        allowNull: false
      },
      color: {
        type: DataTypes.STRING,
        allowNull: false
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      almacenamiento : {
        type: DataTypes.STRING,
        allowNull: false
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      ubicacion: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true
      }
    });
  
    return celular;
  };
  