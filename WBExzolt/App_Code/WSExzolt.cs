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
    public string nombreConcursante(int nConcursante)
    {
        try
        {
            Usuario usr = new Usuario();
            usr.nConcursante = nConcursante;
            usr = NegocioUsr.DatosConcursante(usr);
            return usr.nombre;
        }
        catch (Exception e)
        {
            return e.Message;
        }
    }
    [WebMethod]
    public string puntajeConcursante(int nConcursante)
    {
        try
        {
            Usuario usr = new Usuario();
            usr.nConcursante = nConcursante;
            usr = NegocioUsr.DatosConcursante(usr);
            return usr.puntaje.ToString();
        }
        catch (Exception e)
        {
            return e.Message;
        }
    }

    [WebMethod]
    public String insertarUsuario(String nombre, String foto)
    {
        try
        {
            Usuario usr = new Usuario();
            usr.nombre = nombre;
            usr.foto = foto;
            return NegocioUsr.insertaUsuario(usr); ;
        }
        catch (Exception e)
        {
            throw e;
        }
    }

    /*
     * Lista de usuarios
     */
    [WebMethod]
    public List<Usuario> tableroPuntaje()
    {
        try
        {
            List<Usuario> listUsuario;
            listUsuario = NegocioUsr.tableroPuntaje();
            return listUsuario;
        }
        catch (Exception e)
        {
            throw e;
        }
    }


    public Boolean puntajeScore(int idUsuario, int bandera, int score)
    {
        try
        {
            Boolean sw;
            sw = NegocioUsr.puntajeScore(idUsuario, bandera, score);
            return sw;
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

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

    [WebMethod]
    public Boolean verifiaSesion(String nombre)
    {
        try
        {
            Boolean verifia;
            verifia = NegocioUsr.verifiaSesion(nombre);
            return verifia;
        }
        catch (Exception e)
        {
            throw e;
        }
    }

    #endregion

}

