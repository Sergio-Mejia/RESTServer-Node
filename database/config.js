const mongoose = require('mongoose')


const dbConnection = async() => {

    try{
        //Await para esperar que la conexion se haga
        await mongoose.connect( process.env.MONGODB_CNN) 

        console.log('Base de datos online'); 

    }catch(error){
        console.log("aaaaaaaaaaaaaaaa", error); 
        throw new Error("Error al iniciar base de datos ")
    }
}


module.exports = {
    dbConnection
}