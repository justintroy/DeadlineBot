module.exports = (sequelize, DataTypes) => {
    return sequelize.define('events', {
        name: {
            type: DataTypes.STRING,
            unique: true,
        },
        creator: DataTypes.STRING,
        event_date: DataTypes.DATE,
    });
};