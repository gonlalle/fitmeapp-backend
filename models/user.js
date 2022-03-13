const mongoose = require('mongoose');

let sexEnum = {
    values: ["Masculino", "Femenino"],
    message: '{VALUE} no es un sexo valido'
}

let activityEnum = {
    values: ["Ligera", "Moderada", "Intensa"],
    message: '{VALUE} no es una cantidad valida'
}

const userSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: String,
    name: String,
    familyName: String,
    phoneNumber: Number,
    password: String,
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isTestUser: {
        type: Boolean,
        default: false,
    },
    recommendedDailySteps: {
        type: Number,
        default: 10000,
    },
    currentDailySteps: Number,
    sex: {
        type: String,
        default: "Masculino",
        enum: sexEnum
    },
    height: Number,
    currentWeight: Number,
    goalWeight: Number,
    dailyActivity: {
        type: String,
        default: "Moderada",
        enum: activityEnum
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;