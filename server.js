const { Pool } = require("pg"); //1. Utilizar el paquete pg paraconectarseaPostgreSQLyrealizarconsultasDMLparala gestión y persistencia de datos. (3 Puntos)
const fs = require("fs");
const http = require("http");
const url = require("url");
const axios = require("axios");

const config = {
  user: "postgres",
  host: "localhost",
  password: "2619",
  database: "bancosolar",
  port: 5432,
  max: 20,
  idleTimeoutMillis: 5000,
  connnectionTimeoutMillis: 2000,
};

const pool = new Pool(config);

async function insertarUsuario(datos, pool) {
  pool.connect(async (error_conexion, client, release) => {
    if (error_conexion) return console.error(error_conexion.code);
    const SQLQuery = {
      text: "insert into usuarios (nombre, balance) values ($1,$2) RETURNING *;",
      values: datos,
    };
    try {
      const res = await client.query(SQLQuery);
      console.log(`Ultimo Usuario ${res.rows[0].nombre} agregado con éxito.`);
    } catch (error_consulta) {
      console.log("! Error consulta !", error_consulta.code);
    }
    release();
    pool.end();
  });
}

async function listarUsuarios() {
    try {
      const res = await pool.query("SELECT * FROM usuarios");
      console.log("Registro actual:", res.rows);
      return res
    } catch (error_consulta) {
      console.log("Error de conexion: ", error_consulta.code);
      return error; 
    }    
}


// async function editarUsuario(datos, pool) {
//   pool.connect(async (error_conexion, client, release) => {
//     if (error_conexion) return console.log(error_conexion.code);

//     const SQLQuery = {
//       name: "editarUsuario",
//       text: "UPDATE usuarios SET nombre = $1, balance = $2 WHERE id = $3 RETURNING *",
//       values: [...datos, id],
//     };
//     try {
//       const res = await client.query(SQLQuery);
//       console.log(`Usuario ${res.rows[0].id} editado con éxito`);
//     } catch (error_consulta) {
//       console.log("Error de conexion: ", error_consulta.code);
//     }
//     release();

//     pool.end();
//   });
// }

// async function borrarUsuario(datos, pool) {
//   pool.connect(async (error_conexion, client, release) => {
//     if (error_conexion)
//       return console.log("Error de conexion: ", error_conexion.code);

//     const SQLQuery = {
//       name: "eliminarUsuario",
//       text: "DELETE FROM usuarios WHERE id = $1 RETURNING *",
//       values: [datos],
//     };
//     try {
//       const res = await client.query(SQLQuery);
//       console.log(
//         `Registro de usuario con id ${res.rows[0].id} eliminado con éxito`
//       );
//     } catch (error_consulta) {
//       console.log("Error de consulta: ", error_consulta.code);
//     }
//     release();

//     pool.end();
//   });
// }

// async function insertarTransferencia(datos, pool) {
//   pool.connect(async (error_conexion, client, release) => {
//     if (error_conexion)
//       return console.log("Error de conexion: ", error_conexion.code);
//     try {
//       await client.query("BEGIN");
//       const sumaSaldo = `UPDATE usuarios set balance = balance + ${datos[2]} where nombre = '${datos[1]}';`;
//       await client.query(sumaSaldo);
//       const restaSaldo = `UPDATE usuarios set balance = balance - ${datos[2]} where nombre = '${datos[0]}';`;
//       await client.query(restaSaldo);
//       const transfer = `insert into transferencias (emisor, receptor, monto, fecha) values ((select id from usuarios where nombre = '${nuevaTransferencia[0]}'), (select id from usuarios where nombre = '${nuevaTransferencia[1]}'), ${nuevaTransferencia[2]}, now());`;
//       await client.query(transfer);
//       await client.query("COMMIT");
//     } catch (error_consulta) {
//       console.log("Error de consulta: ", error_consulta.code);
//       await client.query("ROLLBACK");
//     }
//     release();

//     pool.end();
//   });
// }

// async function consultaTransferencia() {
//   pool.connect(async (error_conexion, client, release) => {
//     if (error_conexion)
//       return console.log("Error de conexion: ", error_conexion.code);
//     try {
//       const consulta = {
//         rowMode: "array",
//         text: `SELECT (select nombre from usuarios where id = emisor) as emisor, (select nombre from usuarios where id = receptor) as receptor, monto, fecha FROM transferencias;`,
//       };
//       await client.query(consulta);
//     } catch (error_consulta) {
//       console.log("Error de consulta: ", error_consulta.code);
//       return error;
//     }
//     release();

//     pool.end();
//   });
// }

http
  .createServer((req, res) => {
    if (req.url == "/" && req.method === "GET") {
      res.setHeader("Content-Type", "text/html");
      fs.readFile("index.html", "utf8", (err, data) => {
        res.end(data);
      });
    }
    if (req.url.startsWith("/usuario") && req.method == "POST") {
      const nuevoUsuario = (req, res, pool) => {
        let body = "";
        req.on("data", (payload) => {
          body = JSON.parse(payload);
        });
        req.on("end", async () => {
          const data = [body.nombre, body.balance];
          const codigo = insertarUsuario(data, pool);
          codigo ? (res.statusCode = 201) : (res.statusCode = codigo);
          res.end();
        });
      };
      nuevoUsuario(req, res, pool);
    }
    // if (req.url.startsWith("/usuario") && req.method == "PUT") {
    //   const actualizarUsuario = (req, res, pool) => {
    //     let body = "";
    //     req.on("data", (payload) => {
    //       body = JSON.parse(payload);
    //     });
    //     req.on("end", async () => {
    //       data = [body.id, body.name, body.balance];
    //       const codigo = await editarUsuario(data, id, pool);
    //       if (codigo > 0) {
    //         res.statusCode = 200;
    //         texto = "Registro editado con éxito!";
    //       } else {
    //         res.statusCode = 400;
    //         texto = "Error para editar el registro";
    //       }
    //       res.end(console.log(texto));
    //     });
    //   };
    //   actualizarUsuario(req, res, pool);
    // }
    // if (req.url.startsWith("/usuario") && req.method == "DELETE") {
    //   const eliminarUsuario = async (req, res, pool) => {
    //     const { id } = url.parse(req.url, true).query;
    //     const codigo = await borrarUsuario(id, pool);
    //     let texto = "";
    //     if (codigo > 0) {
    //       res.statusCode = 200;
    //       texto = "Registro eliminado con éxito!";
    //     } else {
    //       res.statusCode = 400;
    //       texto = "Error para eliminar el registro";
    //     }
    //     res.end(console.log(texto));
    //   };
    //   eliminarUsuario(req, res, pool);
    // }
    if (req.url.startsWith("/usuarios") && req.method === "GET") {     
        listarUsuarios().then((registros) => {
        registros ? (res.statusCode = 200) : (res.statusCode = 404); 
        res.end(JSON.stringify(registros.rows)); 
        console.log(registros);
        }).catch(err => console.log(err))
    }
    // if (req.url.startsWith("/transferencia") && req.method == "POST") {
    //   const nuevaTransferencia = (req, res, pool) => {
    //     let body = "";
    //     req.on("data", (payload) => {
    //       body = JSON.parse(payload);
    //     });
    //     req.on("end", async () => {
    //       transferencia = [body.emisor, body.receptor, body.monto];
    //       const visual = await insertarTransferencia(transferencia, pool);
    //       visual ? (res.statusCode = 201) : (res.statusCode = 500);
    //       res.end();
    //     });
    //   };
    //   nuevaTransferencia(req, res, pool);
    // }
    // if (req.url.startsWith("/transferencias") && req.method == "GET") {
    //   const listarTransferencia = async (res, pool) => {
    //     const registros = await consultaTransferencia(pool);
    //     if (registros) {
    //       res.statusCode = 200;
    //       res.end(JSON.stringify(registros));
    //     } else {
    //       res.statusCode = 500;
    //       res.end();
    //     }
    //   };
    //   listarTransferencia(res, pool);
    // }
  })
  .listen(3000, () => console.log("Servidor ON en puerto 3000"));

//2. Usar transacciones SQL para realizar el registro de las transferencias. (2 Puntos)
//3. Servir una API RESTful en el servidor con los datos de losusuariosalmacenadosen PostgreSQL. (3 Puntos)
//4. Capturar los posibles errores que puedan ocurrir a través de bloques catch o parámetros de funciones callbacks para condicionar las funciones del servidor.(1 Punto)
//5. Devolver correctamente los códigos de estado según las diferentes situaciones.(1 Punto)
