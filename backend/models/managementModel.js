import mongoose from 'mongoose';

const managementSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    profileImage: {
        type: String,
    },
    role: {
        type: String,
        enum: ['seller', 'admin'],
        default: 'seller',
    },
}, { timestamps: true });

const managementModel = mongoose.model('Management', managementSchema);

export default managementModel;