using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;


namespace Exzolt.Framework.AccesoDatos
{
    public class Conexion
    {
        public static SqlConnection ObtieneConexion(string cadena)
        {
            SqlConnection conexion;

            try
            {
                conexion = new SqlConnection(@"Data Source = 172.81.2.226\DOTNETSERVER; Initial Catalog = ExzoltBD; Persist Security Info = True; User ID = sa; Password = 12345");
                // conexion = new SqlConnection(ConfigurationManager.ConnectionStrings[cadena].ConnectionString);

            }
            catch (SqlException sqlExp)
            {
                Console.WriteLine(sqlExp);
                conexion = null;
            }

            return conexion;
        }
    }
}