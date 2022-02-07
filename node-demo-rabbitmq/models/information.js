const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Dashboard_Schema = new Schema({
dashboardStats : Number,
objectKey: String
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});


module.exports = mongoose.model('Information', Dashboard_Schema);
