# Prueba_Banco_Solar
●Conectar una base de datos PostgreSQL con Node.
●Realizar consultas DML con Node y el paquete pg.
●Realizar consultas TCL con Node y el paquete pg.
●Construir una API RESTful  utilizando PostgreSQL para la persistencia de datos.
●Manejar errores.
●Manejar códigos de estado HTTP

El Banco Solar acaba de decidir invertir una importante suma de dinero para contratar un
equipo de desarrolladores Full Stack que desarrollen un nuevo sistema de transferencias, y
han anunciado que todo aquel que postule al cargo debe realizar un servidorconNodeque
utilice PostgreSQL para la gestión y persistencia de datos, y simular un sistema de
transferencias.
Elsistemadebepermitirregistrarnuevosusuariosconunbalanceinicialybasadosenéstos,
realizar transferencias de saldos entre ellos.
En esta prueba contarás con una aplicación cliente preparada para consumir las rutas que
deberás crear en el servidor. A continuación se muestra una imagen con la interfaz
mencionada

●/ GET: Devuelve la aplicación cliente disponible enel apoyo de la prueba.
●/usuario POST: Recibe los datos de un nuevo usuarioy los almacena en PostgreSQL.
●/usuarios GET: Devuelve todos los usuarios registradoscon sus balances.
●/usuario PUT: Recibe los datos modificados de un usuarioregistrado y los actualiza.
●/usuario DELETE: Recibe el id de un usuario registradoy lo elimina .
●/transferencia POST: Recibe los datos para realizaruna nueva transferencia. Se debe
ocupar una transacción SQL en la consulta a la base de datos.
●/transferencias GET: Devuelve todas las transferenciasalmacenadas en la base de
datos en formato de arreglo.

Requerimientos
1. Utilizar el paquete pg paraconectarseaPostgreSQLyrealizarconsultasDMLparala
gestión y persistencia de datos. (3 Puntos)
2. Usar transacciones SQL para realizar el registro de las transferencias. (2 Puntos)
3. Servir una API RESTful en el servidor con los datos de losusuariosalmacenadosen
PostgreSQL. (3 Puntos)
4. Capturar los posibles errores que puedan ocurrir a través de bloques catch o
parámetros de funciones callbacks para condicionar las funciones del servidor.
(1 Punto)
5. Devolver correctamente los códigos de estado según las diferentes situaciones.
(1 Punto)
