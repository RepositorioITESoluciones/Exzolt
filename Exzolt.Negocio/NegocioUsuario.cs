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
         * @param nombre
         * Verifica Registro
         */
        public Boolean verifiaSesion(String nombre) {
            Boolean verifica;
            verifica = DatosUsr.verifiaSesion(nombre);
            return verifica;
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

        public Boolean puntajeScore(int idUsuario, int bandera, int puntaje) {
            Boolean sw;
            sw = DatosUsr.puntajeScore(idUsuario, bandera, puntaje);
            return true;
        }
        public Boolean numeroIntentos(int idUsuario)
        {
            Boolean sw;
            sw = DatosUsr.numeroIntentos(idUsuario);
            return true;
        }

    }
}
