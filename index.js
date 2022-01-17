const { Pool } = require("pg");//1. Utilizar el paquete pg paraconectarseaPostgreSQLyrealizarconsultasDMLparala gestión y persistencia de datos. (3 Puntos)
const fs = require("fs");
const http = require("http");

const config = {
    user: "postgres",
    host: "localhost",
    password: "123",
    database: "bancosolar",
    port: 5432,
    port: 5432,
    max: 20,
    idleTimeoutMillis: 5000,
    connnectionTimeoutMillis: 2000,
}











//2. Usar transacciones SQL para realizar el registro de las transferencias. (2 Puntos)
//3. Servir una API RESTful en el servidor con los datos de losusuariosalmacenadosen PostgreSQL. (3 Puntos)
//4. Capturar los posibles errores que puedan ocurrir a través de bloques catch o parámetros de funciones callbacks para condicionar las funciones del servidor.(1 Punto)
//5. Devolver correctamente los códigos de estado según las diferentes situaciones.(1 Punto)
