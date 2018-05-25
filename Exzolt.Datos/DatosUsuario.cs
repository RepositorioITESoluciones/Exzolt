using System;
using System.Data;
using System.Data.SqlClient;
using Exzolt.Entidades;
using Exzolt.Framework.AccesoDatos;
using System.Collections.Generic;

namespace Exzolt.Datos
{

    public class DatosUsuario
    {

        /*
         * @param usuario 
         * Valida Sesión
         */
        public Usuario DatosConcursante(Usuario usuario)
        {
            String query = "SELECT * FROM usuarios WHERE nConcursante = " + usuario.nConcursante + "";
            Usuario usr = new Usuario();
            DataTable dt = new DataTable();
            SqlConnection connection = null;
            try
            {
                using (connection = Conexion.ObtieneConexion("ConexionBD"))
                {
                    SqlDataReader consulta;
                    connection.Open();
                    consulta = Ejecuta.ConsultaConRetorno(connection, query);
                    dt.Load(consulta);
                    connection.Close();
                }
                foreach (DataRow row in dt.Rows)
                {
                    usr.id = Convert.ToInt32(row["idUsuario"].ToString());
                    usr.nombre = row["nombre"].ToString();
                    usr.nConcursante = Convert.ToInt32(row["nConcursante"].ToString());
                    usr.nGallinas = Convert.ToInt32(row["nGallinas"].ToString());
                    usr.nAcaros = Convert.ToInt32(row["nAcaros"].ToString());
                    usr.nIntentos = Convert.ToInt32(row["nIntentos"].ToString());
                    usr.puntaje = Convert.ToInt32(row["puntaje"].ToString());
                }

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
            return usr;
        }

        /*
         * @param nombre
         * Verifica Registro
         */
        public Boolean verificaSesion(String nombre)
        {
            String query = "SELECT * FROM usuarios WHERE nombre = '" + nombre + "'";
            DataTable dt = new DataTable();
            SqlConnection connection = null;
            Boolean verifica = false;
            try
            {
                using (connection = Conexion.ObtieneConexion("ConexionBD"))
                {
                    SqlDataReader consulta;
                    connection.Open();
                    consulta = Ejecuta.ConsultaConRetorno(connection, query);
                    dt.Load(consulta);
                    connection.Close();
                }
                verifica = (dt.Rows.Count > 0) ? true : false;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
            return verifica;
        }

        public String insertaUsuario(Usuario usuario)
        {

            String queryVali = "SELECT count(*)Existencia FROM usuarios WHERE nombre = '" + usuario.nombre+"'";
            String queryNConcu = "SELECT MAX(nConcursante)nConcursante from usuarios;";

            

            DataTable dt = new DataTable();
            DataTable dtNcon = new DataTable();
            SqlConnection connection = null;
            String respuesta = "";
            int existencia = 0;
            int nconcur = 0;
            bool consulInsert = true;
            try
            {
                using (connection = Conexion.ObtieneConexion("ConexionBD"))
                {
                    //valida existencia
                    SqlDataReader consulta;
                    connection.Open();
                    consulta = Ejecuta.ConsultaConRetorno(connection, queryVali);
                    dt.Load(consulta);
                    connection.Close();


                    foreach (DataRow row in dt.Rows)
                    {
                        existencia = Convert.ToInt32(row["Existencia"].ToString());
                    }


                    if (existencia == 0)
                    {
                        //calcula nconcursante
                        SqlDataReader consultancon;
                        connection.Open();
                        consultancon = Ejecuta.ConsultaConRetorno(connection, queryNConcu);
                        dtNcon.Load(consultancon);
                        connection.Close();

                        foreach (DataRow row in dtNcon.Rows)
                        {
                            if (row["nConcursante"].ToString() == "")
                            {

                                nconcur = 1;

                            }
                            else { nconcur = Convert.ToInt32(row["nConcursante"].ToString()) + 1; }
                            
                        }

                        if (nconcur!=0) {
                            String query = "iNSERT INTO usuarios values('" + usuario.nombre + "',0,'" + usuario.foto + "',0,0,0," + nconcur + ")";
                            connection.Open();
                            consulInsert = Ejecuta.ConsultaSinRetorno1(connection, query);
                            connection.Close();
                        }


                        if (consulInsert == true){return nconcur.ToString();}
                        else{return "Error al insertar";}

                    }
                    else
                    {
                        return "El usuario ya existe";

                    }

                }
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }

        }

        /*
         * Valida Sesión
         * Consulta Tablero Principal
         */
        public List<Usuario> tableroPuntaje()
        {
            List<Usuario> listUsuario = new List<Usuario>();
            DataTable dt = new DataTable();
            SqlConnection connection = null;
            String query = "SELECT top 10 idUsuario, nombre, nIntentos, puntaje,avatar,nGallinas,nAcaros FROM usuarios ORDER BY puntaje DESC";
            try
            {

                using (connection = Conexion.ObtieneConexion("ConexionBD"))
                {
                    SqlDataReader consulta;
                    connection.Open();
                    consulta = Ejecuta.ConsultaConRetorno(connection, query);
                    dt.Load(consulta);
                    connection.Close();
                }
                foreach (DataRow row in dt.Rows)
                {
                    Usuario usr = new Usuario();
                    usr.id = Convert.ToInt32(row["idUsuario"].ToString());
                    usr.nombre = row["nombre"].ToString();
                    usr.nIntentos = Convert.ToInt32(row["nIntentos"].ToString());
                    usr.nGallinas = Convert.ToInt32(row["nGallinas"].ToString());
                    usr.nAcaros = Convert.ToInt32(row["nAcaros"].ToString());
                    usr.puntaje = Convert.ToInt32(row["puntaje"].ToString());
                    usr.foto = row["avatar"].ToString();
                    listUsuario.Add(usr);
                }

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
            return listUsuario;
        }

        public Boolean puntajeScore(int idUsuario, int bandera, int puntaje)
        {
            String query = "";

            if (bandera == 1)
            {
                query = "UPDATE usuarios SET score = score - " + puntaje + ", "
                          + "gallina = gallina + 1 WHERE idUsuario =  " + idUsuario + "";
            }
            else
            {
                query = "UPDATE usuarios SET score = score + " + puntaje + ", "
                         + "acaro = acaro + 1 WHERE idUsuario =  " + idUsuario + "";
            }

            DataTable dt = new DataTable();
            SqlConnection connection = null;
            Boolean verifica = false;
            try
            {
                using (connection = Conexion.ObtieneConexion("ConexionBD"))
                {
                    SqlDataReader consulta;
                    connection.Open();
                    consulta = Ejecuta.ConsultaConRetorno(connection, query);
                    dt.Load(consulta);
                    connection.Close();
                }
                verifica = true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
            return verifica;
        }

        public Boolean numeroIntentos(int idUsuario)
        {
            String query = "";
            query = "UPDATE usuarios SET nIntentos = nIntentos + 1"
                    + "WHERE idUsuario = " + idUsuario + " ";

            DataTable dt = new DataTable();
            SqlConnection connection = null;
            Boolean verifica = false;
            try
            {
                using (connection = Conexion.ObtieneConexion("ConexionBD"))
                {
                    SqlDataReader consulta;
                    connection.Open();
                    consulta = Ejecuta.ConsultaConRetorno(connection, query);
                    dt.Load(consulta);
                    connection.Close();
                }
                verifica = true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
            return verifica;
        }

        public Boolean verifiaSesion(String nombre)
        {
            String query = "SELECT * FROM usuarios WHERE nombre = '" + nombre + "'";
            DataTable dt = new DataTable();
            SqlConnection connection = null;
            Boolean verifica = false;
            try
            {
                using (connection = Conexion.ObtieneConexion("ConexionBD"))
                {
                    SqlDataReader consulta;
                    connection.Open();
                    consulta = Ejecuta.ConsultaConRetorno(connection, query);
                    dt.Load(consulta);
                    connection.Close();
                }
                verifica = (dt.Rows.Count > 0) ? true : false;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
            return verifica;
        }


    }
}
