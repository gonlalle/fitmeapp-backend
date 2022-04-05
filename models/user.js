const mongoose = require('mongoose');

let sexEnum = {
    values: ["Masculino", "Femenino"],
    message: '{VALUE} no es un sexo valido'
}

const userSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    nombre: String,
    apellidos: String,
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    email: String,
    telefono: Number,
    fecha: String,
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isTestUser: {
        type: Boolean,
        default: false,
    },
    pasos: {
        type: Number,
        default: 10000,
    },
    sexo: {
        type: String,
        default: "Masculino",
        enum: sexEnum
    },
    altura: Number,
    peso_inicial: Number,
    peso_actual: Number,
    objetivo: String,
    objetivo_peso: Number,
    objetivo_semanal: Number,
    dieta_pref: String,
    nivel_actividad: String,
    tipo_alimentacion: String,
    carbohidratos_recomendados: Number,
    grasas_recomendadas: Number,
    kcal_recomendadas: Number,
    proteinas_recomendadas: Number
});

const User = mongoose.model('User', userSchema);

module.exports = User;