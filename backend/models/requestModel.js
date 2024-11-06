import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
    email: {
        type: String,
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'approved', 'rejected']
    },
}, { timestamps: true });

const requestModel = mongoose.model('UserRequests', requestSchema);

export default requestModel;