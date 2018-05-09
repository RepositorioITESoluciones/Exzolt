using System;
using Exzolt.Datos;
using Exzolt.Entidades;
using System.Collections.Generic;

namespace Exzolt.Negocio {
    public class NegocioUsuario {

        DatosUsuario DatosUsr = new DatosUsuario();

        /*
         * @param usuario 
         * Valida Sesión
         */
        public Usuario login(Usuario usuario) {
            Usuario usr;
            usr = DatosUsr.login(usuario);
            return usr;
        }

        /*
         * @param usuario 
         * Inserta Usuario
         */
        public int insertaUsuario(Usuario usuario) {
            int respuesta = 0;
            try {
                respuesta = DatosUsr.insertaUsuario(usuario);
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
            List<Usuario> listUsuario;
            try {
                listUsuario = DatosUsr.tableroPuntaje();
            } catch (Exception ex) {
                throw ex;
            }
            return listUsuario;
        }

    }
}
