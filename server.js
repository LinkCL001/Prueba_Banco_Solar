const { Pool } = require("pg"); //1. Utilizar el paquete pg paraconectarseaPostgreSQLyrealizarconsultasDMLparala gestión y persistencia de datos. (3 Puntos)
//const { Client } = require("pg");
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

const insertarUsuario = async (data) => {
  const SQLQuery = {
    text: "INSERT INTO usuarios (nombre, balance) values ($1,$2) RETURNING *;",
    values: data,
  };
  try {
    const res = await pool.query(SQLQuery);
    console.log(`Ultimo Usuario ${res.rows[0].nombre} agregado con éxito.`);
  } catch (error_consulta) {
    console.log("! Error consulta !", error_consulta.code);
    return error_consulta;
  }
};

const getUsuarios = async () => {
  try {
    const res = await pool.query("SELECT * FROM usuarios");
    console.log("Registro actual:", res.rows);
    return res;
  } catch (error_consulta) {
    console.log("Error de conexion: ", error_consulta.code);
    return error_consulta;
  }
};

const editUsuario = async (data) => {
  const SQLQuery = {
    text: "UPDATE usuarios SET nombre = $1, balance = $2 WHERE id = $3 RETURNING *",
    values: data,
  };
  try {
    const res = await pool.query(SQLQuery);
    console.log("Registro Editado: ", res.rows);
    return res;
  } catch (error_consulta) {
    console.log("Error de conexion: ", error_consulta.code);
  }
};

const eliminarUsuario = async (id) => {
  const SQLQuery = {
    name: "eliminar-usuario",
    text: "DELETE FROM usuarios WHERE id = $1 RETURNING *;",
    values: [id],
  };
  try {
    const res = await pool.query(SQLQuery);
    console.log("Usuario Eliminado: ", res.rows);
    return res;
  } catch (error_consulta) {
    console.log("Error de consulta: ", error_consulta.code);
    return error_consulta;
  }
};

const insertarTransferencia = async (data, client) => {
  const date = new Date();
  datos.push(date);
  try {
    await client.query("BEGIN");
    const res = await client.query(
      "insert into transferencias (emisor, receptor, monto, fecha) values ($1, $2, $3, $4) RETURNING *;",
      [data[3], data[4], data[2], data[5]]
    );
    await client.query("COMMIT");
    return res;
  } catch (error_consulta) {
    console.log("Error de consulta: ", error_consulta.code);
    await client.query("ROLLBACK");
  }
};

const getTransferencias = async () => {
  const SQLquery = {
    rowMode: "array",
    text: `SELECT (select nombre from usuarios where id = emisor) as emisor, (select nombre from usuarios where id = receptor) as receptor, monto, fecha FROM transferencias;`,
  };
  try {
    const result = await pool.query(SQLquery);
    return result;
  } catch (error) {
    console.log(error.code);
    return error;
  }
};

const realizarTransferencia = async (data) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const retiro = {
      text: "UPDATE usuarios SET balance = balance - $2 WHERE id = $1 RETURNING *;",
      values: [data[3], data[2]],
    };
    const deposito = {
      text: "UPDATE usuarios SET balance = balance + $2 WHERE id = $1 RETURNING *;",
      values: [data[4], data[2]],
    };
    await client.query(retiro);
    await client.query(deposito);
    await client.query("COMMIT");
    const result = await insertarTransferencia(client, data); 
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error);
  } finally {
    client.release();
  }
};

http
  .createServer(async (req, res) => {
    if (req.url == "/" && req.method === "GET") {
      try {
        res.setHeader("Content-Type", "text/html");
        const html = fs.readFileSync("index.html", "utf8");
        res.end(html);
        res.statusCode = 200;
      } catch (error) {
        console.log(error.code);
        res.statusCode = 500;
        res.statusMessage = "Server Error";
        return error;
      }
    }

    if (req.url.startsWith("/usuario") && req.method === "POST") {
      let body = "";
      req.on("data", (payload) => {
        body += payload;
      });
      req.on("end", async () => {
        const data = Object.values(JSON.parse(body));
        try {
          const res = await insertarUsuario(data);
          res.statusCode = 200;
          res.end(JSON.stringify(res));
        } catch (error) {
          res.statusCode = 500;
          res.statusMessage = "Error para insertar Usuario";
          console.log(error.code);
          return error;
        }
      });
    }

    if (req.url.startsWith("/usuarios") && req.method === "GET") {
      try {
        const result = await getUsuarios();
        res.setHeader("Content-Type", "application/json");
        res.statusCode = 200;
        res.end(JSON.stringify(result.rows));
      } catch (error) {
        console.log(error.code);
        res.statusCode = 500;
        res.statusMessage = "Error para consultar Usuarios";
        return error;
      }
    }

    if (req.url.includes("/usuario?") && req.method === "PUT") {
      const { id } = url.parse(req.url, true).query;
      let body = "";
      req.on("data", (payload) => {
        body += payload;
      });
      req.on("end", async () => {
        const data = Object.values(JSON.parse(body));
        data.push(id);
        try {
          const result = await editUsuario(data);
          res.statusCode = 200;
          res.end(JSON.stringify(result.rows));
        } catch (error) {
          res.statusCode = 500;
          res.statusMessage = "Error para editar el usuario";
          console.log(error.code);
          return error;
        }
      });
    }
    if (req.url.includes("/usuario?") && req.method === "DELETE") {
      const { id } = url.parse(req.url, true).query;
      try {
        const result = await eliminarUsuario(id);
        res.statusCode = 200;
        res.end(JSON.stringify(result.rows));
      } catch (error) {
        res.statusCode = 500;
        res.statusMessage = "Error para eliminar el usuario";
        console.log(error.code);
        return error;
      }
    }

    if (req.url.startsWith("/transferencia") && req.method == "POST") {
      let body = "";
      req.on("data", (payload) => {
        body = +payload;
      });
      req.on("end", async () => {
        const data = Object.values(JSON.parse(body));
        try {
          const result = await realizarTransferencia(data);
          res.statusCode = 200;
          res.end(JSON.stringify(result.rows));
        } catch (error) {
          res.statusCode = 500;
          res.statusMessage = "Error para ingresar transferencia";
          console.log(error.code);
          return error;
        }
      });
    }
    if (req.url.startsWith("/transferencias") && req.method == "GET") {
      try {
        const result = await getTransferencias();
        res.statusCode = 200;
        res.end(JSON.stringify(result.rows));
      } catch (error) {
        res.statusCode = 500;
        res.statusMessage = "Error consulta de transferencias";
        console.log(error.code);
      }
    }
  })
  .listen(3000, () => console.log("Servidor ON en puerto 3000"));

//2. Usar transacciones SQL para realizar el registro de las transferencias. (2 Puntos)
//3. Servir una API RESTful en el servidor con los datos de losusuariosalmacenadosen PostgreSQL. (3 Puntos)
//4. Capturar los posibles errores que puedan ocurrir a través de bloques catch o parámetros de funciones callbacks para condicionar las funciones del servidor.(1 Punto)
//5. Devolver correctamente los códigos de estado según las diferentes situaciones.(1 Punto)
