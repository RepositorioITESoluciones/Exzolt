using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Exzolt.Datos;
using Exzolt.Entidades;

namespace Exzolt.Negocio {
    public class NegocioUsuario {

        DatosUsuario DatosUsr = new DatosUsuario();

        public Usuario ObtieneUser(Usuario usuario) {
            Usuario usr;
            usr = DatosUsr.login(usuario);
            return usr;
        }
        public bool insertarUser(Usuario usuario) {
            bool respuesta = false;
            if (usuario.contraseña == usuario.contraseñaVali) {
                try {
                    DatosUsr.insertarUserDatos(usuario);
                    respuesta = true;
                } catch (Exception ex) {
                    Console.WriteLine(ex);
                }
            } else {
               
            }
            return respuesta;
        }

    }
}
