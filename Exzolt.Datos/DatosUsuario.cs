using System;
using System.Data;
using System.Data.SqlClient;
using Exzolt.Entidades;
using Exzolt.Framework.AccesoDatos;
using System.Collections.Generic;

namespace Exzolt.Datos {

    public class DatosUsuario {

        /*
         * @param usuario 
         * Valida Sesión
         */
        public Usuario login(Usuario usuario) {
            String query = "SELECT * FROM usuarios WHERE idUsuario = " + usuario.id + "";
            Usuario usr = new Usuario();
            DataTable dt = new DataTable();
            SqlConnection connection = null;
            try {
                using (connection = Conexion.ObtieneConexion("ConexionBD")) {
                    SqlDataReader consulta;
                    connection.Open();
                    consulta = Ejecuta.ConsultaConRetorno(connection, query);
                    dt.Load(consulta);
                    connection.Close();
                }
                foreach (DataRow row in dt.Rows) {
                    usr.id = Convert.ToInt32(row["idUsuario"].ToString());
                    usr.nombre = row["nombre"].ToString();
                }

            } catch (Exception ex) {
                Console.WriteLine(ex);
            }
            return usr;
        }

        /*
         * @param nombre
         * Verifica Registro
         */
        public Boolean verifiaSesion(String nombre) {
            String query = "SELECT * FROM usuarios WHERE nombre = '" + nombre + "'";
            DataTable dt = new DataTable();
            SqlConnection connection = null;
            Boolean verifica = false;
            try {
                using (connection = Conexion.ObtieneConexion("ConexionBD")) {
                    SqlDataReader consulta;
                    connection.Open();
                    consulta = Ejecuta.ConsultaConRetorno(connection, query);
                    dt.Load(consulta);
                    connection.Close();
                }
                verifica = (dt.Rows.Count > 0) ? true : false;
            } catch (Exception ex) {
                Console.WriteLine(ex);
            }
            return verifica;
        }

        /*
         * @param usuario 
         * Inserta Usuario
         */
        public int insertaUsuario(Usuario usuario) {
            String query = "INSERT INTO usuarios (nombre, nIntentos, avatar, score)"
                         + "VALUES ('" + usuario.nombre + "', 0, '" + usuario.foto + "', 0) "
                         + "SELECT idUsuario from usuarios WHERE nombre = '" + usuario.nombre + "'";
            DataTable dt = new DataTable();
            SqlConnection connection = null;
            int respuesta = 0;
            try {
                using (connection = Conexion.ObtieneConexion("ConexionBD")) {
                    SqlDataReader consulta;
                    connection.Open();
                    consulta = Ejecuta.ConsultaConRetorno(connection, query);
                    dt.Load(consulta);
                    connection.Close();
                }
                foreach (DataRow row in dt.Rows) {
                    respuesta = Convert.ToInt32(row["idUsuario"].ToString());
                }
            } catch (Exception ex) {
                Console.WriteLine(ex);
            }
            return respuesta;
        }

        /*
         * Valida Sesión
         * Consulta Tablero Principal
         */
        public List<Usuario> tableroPuntaje() {
            List<Usuario> listUsuario = new List<Usuario>();
            DataTable dt = new DataTable();
            SqlConnection connection = null;
            String query = "SELECT idUsuario, nombre, score FROM usuarios";
            try {

                using (connection = Conexion.ObtieneConexion("ConexionBD")) {
                    SqlDataReader consulta;
                    connection.Open();
                    consulta = Ejecuta.ConsultaConRetorno(connection, query);
                    dt.Load(consulta);
                    connection.Close();
                }
                foreach (DataRow row in dt.Rows) {
                    Usuario usr = new Usuario();
                    usr.id = Convert.ToInt32(row["idUsuario"].ToString());
                    usr.nombre = row["nombre"].ToString();
                    usr.score = Convert.ToInt32(row["score"].ToString());
                    listUsuario.Add(usr);
                }

            } catch (Exception ex) {
                Console.WriteLine(ex);
            }
            return listUsuario;
        }

        public Boolean actualizaPuntaje(int idUsuario, int puntaje) {
            return true;
        }
    }
}
