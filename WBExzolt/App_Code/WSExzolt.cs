using System;
using System.Web.Services;
using Exzolt.Negocio;
using Exzolt.Entidades;
using System.Collections.Generic;

[System.Web.Script.Services.ScriptService]

public class WSExzolt : System.Web.Services.WebService
{
    public WSExzolt() { }

    // Clases Instanciadas
    readonly NegocioUsuario NegocioUsr = new NegocioUsuario();

    #region Modulos Usuario
    /*
     * @param id 
     * Valida Sesión
     */
    [WebMethod]
    public String login(int id) {
        try {
            String res;
            Usuario usr = new Usuario();
            usr.id = id;
            usr = NegocioUsr.login(usr);
            res = (usr != null) ? "Ok" : "No";
            return res;
        } catch (Exception e) {
            throw e;
        }
    }

    /*
     * @param nombre 
     * Verifica Registro
     */
    [WebMethod]
    public Boolean verifiaSesion(String nombre) {
        try {
            Boolean verifia;
            verifia = NegocioUsr.verifiaSesion(nombre);
            return verifia;
        } catch (Exception e) {
            throw e;
        }
    }

    /*
     * @param nombre 
     * Inserta Usuario
     */
    [WebMethod]
    public int insertarUsuario(String nombre, String foto) {
        try {
            Usuario usr = new Usuario();
            usr.nombre = nombre;
            usr.foto = foto;
            int respuesta = NegocioUsr.insertaUsuario(usr);
            return respuesta;
        } catch (Exception e) {
            throw e;
        }
    }

    /*
     * Lista de usuarios
     */
    [WebMethod]
    public List<Usuario> tableroPuntaje() {
        try {
            List<Usuario> listUsuario;
            listUsuario = NegocioUsr.tableroPuntaje();
            return listUsuario;
        } catch (Exception e) {
            throw e;
        }
    }

    /*
     * @param idUsuario
     * @param score
     * Puntuación
     */
    [WebMethod]
    public Boolean puntajeScore(int idUsuario, int bandera, int score) {
        try {
            Boolean sw;
            sw = NegocioUsr.puntajeScore(idUsuario, bandera, score);
            return sw;
        } catch (Exception ex) {
            throw ex;
        }
    }


    /*
     * @param idUsuario
     * Puntuación
     */
    [WebMethod]
    public Boolean numeroIntentos(int idUsuario)
    {
        try
        {
            Boolean sw;
            sw = NegocioUsr.numeroIntentos(idUsuario);
            return sw;
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }


    #endregion

}

