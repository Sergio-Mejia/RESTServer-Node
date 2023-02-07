const { Schema, model } = require("mongoose");


const ProductSchema = Schema({
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
    },
    precio : {
        type: Number,
        default: 0,
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    descripcion: { type: String },
    disponible: { type: Boolean, default: true },
    img: { type: String },
})

ProductSchema.methods.toJSON = function(){
    //Sacar version y password del json de respuesta, los demas params se guardan en ...usuario
    const { __v, estado, ...data } = this.toObject();
    return data;
}

module.exports = model( 'Product', ProductSchema)