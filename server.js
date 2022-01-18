const { Pool } = require("pg"); //1. Utilizar el paquete pg paraconectarseaPostgreSQLyrealizarconsultasDMLparala gestión y persistencia de datos. (3 Puntos)
const fs = require("fs");
const http = require("http");
const url = require("url");

const pool = new Pool(config);

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
};

http
  .createServer((req, res) => {
    if (req.url == "/" && req.method == "GET") {
      res.setHeader("Content-Type", "text/html");
      fs.readFile("index.html", "utf8", (err, data) => {
        res.end(data);
      });
    }
    if (req.url.startsWith("/usuario") && req.method == "POST") {
      const nuevoUsuario = (req, res, pool) => {
        let body = "";
        req.on("data", (data) => {
          body += data;
        });
        req.on("end", async () => {
          const data = Object.values(JSON.parse(body));
          const codigo = await insertarUsuario(data, pool);
          codigo ? (res.statusCode = 201) : (res.statusCode = codigo);
          res.end();
        });
      };
      nuevoUsuario(req, res, pool);
    }
    if (req.url.startsWith("/usuario") && req.method == "PUT") {
        const actualizarUsuario = (req, res, pool) => {
            const params = url.parse(req.url, true).query; 
            const id = params.id;
            let body = "";
            req.on("data", (e) => {
              body += e;
            });
            req.on("end", async () => {
              const data = Object.values(JSON.parse(body));
              const codigo = await editarUsuario(data, id, pool); 
              if (codigo > 0) {
                res.statusCode = 200;
                texto = "Registro editado con éxito!";
              } else {
                res.statusCode = 400;
                texto = "Error para editar el registro";
              }
              res.end(console.log(texto));
            });
          };
      actualizarUsuario(req, res, pool);
    }
    if (req.url.startsWith("/usuario") && req.method == "DELETE") {
      const eliminarUsuario = async (req, res, pool) => {
        const params = url.parse(req.url, true).query;
        const id = params.id;
        const codigo = await eliminarUsuario(id, pool);
        let texto = "";
        if (codigo > 0) {
          res.statusCode = 200;
          texto = "Registro eliminado con éxito!";
        } else {
          res.statusCode = 400;
          texto = "Error para eliminar el registro";
        }
        res.end(console.log(texto));
      };
      eliminarUsuario(req, res, pool);
    }
    if (req.url.startsWith("/usuarios") && req.method == "GET") {
      const listadoUsuarios = async (res, pool) => {
        const registros = await listadoUsuarios(pool);
        registros ? (res.statusCode = 200) : (res.statusCode = 404);
        res.end(JSON.stringify(registros.rows));
      };
      listadoUsuarios(res, pool);
    }
    if (req.url.startsWith("/transferencia") && req.method == "POST") {
      nuevaTransferencia(req, res, pool);
    }
    if (req.url.startsWith("/transferencias") && req.method == "GET") {
      listaTransferencia(res, pool);
    }
  })
  .listen(3000, () => console.log("Servidor ON en puerto 3000"));

//2. Usar transacciones SQL para realizar el registro de las transferencias. (2 Puntos)
//3. Servir una API RESTful en el servidor con los datos de losusuariosalmacenadosen PostgreSQL. (3 Puntos)
//4. Capturar los posibles errores que puedan ocurrir a través de bloques catch o parámetros de funciones callbacks para condicionar las funciones del servidor.(1 Punto)
//5. Devolver correctamente los códigos de estado según las diferentes situaciones.(1 Punto)
