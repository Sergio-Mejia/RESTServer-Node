const { Schema, model } = require("mongoose");


const categorySchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio '],
        unique: true
    },
    estado : {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
})

categorySchema.methods.toJSON = function(){
    //Sacar version y password del json de respuesta, los demas params se guardan en ...usuario
    const { __v, estado, ...data } = this.toObject();
    return data;
}

module.exports = model( 'Category', categorySchema)