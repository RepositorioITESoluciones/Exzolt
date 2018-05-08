using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Exzolt.Entidades;
using Exzolt.Framework.AccesoDatos;

namespace Exzolt.Datos {
    public class DatosUsuario {

        public Usuario login(Usuario usuario) {
            Usuario campos = new Usuario();
            DataTable dt = new DataTable();
            SqlConnection connection = null;
            List<Usuario> camposList = new List<Usuario>();
            try {
                using (connection = Conexion.ObtieneConexion("ConexionBD")) {
                    SqlDataReader consulta;
                    connection.Open();
                    consulta = Ejecuta.ConsultaConRetorno(connection, "SELECT * FROM usuarios WHERE nombre = '" + usuario.nombre + "' OR nombre_usuario = '" + usuario.nombreUsuario + "' AND contrasena = '" + usuario.contraseña + "'");
                    dt.Load(consulta);
                    connection.Close();
                }
                foreach (DataRow row in dt.Rows) {                   
                    campos.id = Convert.ToInt32(row["id"].ToString());
                    campos.nombre = row["nombre"].ToString();
                    campos.nombre = row["apellido_materno"].ToString();
                    campos.nombre = row["apellido_paterno"].ToString();
                    campos.nombreUsuario = row["nombreUsuario"].ToString();
                    campos.contraseña = row["contrasena"].ToString();              
                }       
            } catch (Exception ex) {
                Console.WriteLine(ex);
            }
            Console.WriteLine(campos);
            return campos;
        }

        public bool insertarUserDatos(Usuario usuario) {        
            SqlConnection connection = null;
            bool respuesta = false;
            try {
                using (connection = Conexion.ObtieneConexion("ConexionBD")) {
                    connection.Open();
                    Ejecuta.ConsultaSinRetorno1(connection, "INSERT INTO usuarios (nombre,apellido_paterno,apellido_materno,nombre_usuario,contrasena) VALUES ('" + usuario.nombre + "','" + usuario.apellido_paterno + "','" + usuario.apellido_materno + "','" + usuario.nombreUsuario + "','" + usuario.contraseña + "')");           
                    connection.Close();
                }
                respuesta = true;
            } catch (Exception ex) {
                Console.WriteLine(ex);
            }        
            return  respuesta;            
        }


    }
}
