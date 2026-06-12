import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    refreshTokenHash: {
        type : String,
        required: [true, 'Refresh token hash is required']
    },
    userAgent:{
        type : String,
        required: [true, 'User agent is required']  
    },
    ipAddress:{
        type : String,
        required: [true, 'IP address is required']  
    },
    lastUsedAt: {
        type: Date,
        default: Date.now
    },
    expiresAt:{
        type: Date,
        required: [true, 'Expiration date is required']
    },
    isRevoked: {
        type:Boolean,
        default: false
    },
},{ timestamps: true});

export default mongoose.model('Session', SessionSchema);