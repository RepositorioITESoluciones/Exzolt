using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Exzolt.Framework.AccesoDatos
{
    public class ParametroAcceso
    {
        public static SqlParameter CrearParametro(string nombreParametro, SqlDbType tipo, object valor, ParameterDirection direccion)
        {
            var sqlParameter = new SqlParameter(nombreParametro, tipo);

            if (tipo.Equals(SqlDbType.Bit) && !valor.Equals(DBNull.Value))
                sqlParameter.Value = Convert.ToBoolean(valor);
            else if (!tipo.Equals(SqlDbType.Bit))
                sqlParameter.Value = valor; //!= null ? valor : DBNull.Value;

            sqlParameter.Direction = direccion;

            return sqlParameter;
        }

        public static void AgregarParametros(SqlCommand sqlCommand, IEnumerable<SqlParameter> sqlParameter)
        {
            if (sqlParameter != null)
            {
                foreach (SqlParameter p in sqlParameter)
                {
                    if (p != null)
                    {
                        // Check for derived output value with no value assigned
                        if ((p.Direction == ParameterDirection.InputOutput ||
                            p.Direction == ParameterDirection.Input) &&
                            (p.Value == null))
                        {
                            p.Value = DBNull.Value;
                        }
                        sqlCommand.Parameters.Add(p);
                    }
                }
            }
        }
    }
}
