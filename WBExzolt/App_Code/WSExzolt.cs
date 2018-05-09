using System;
using System.Web.Services;
using Exzolt.Negocio;
using Exzolt.Entidades;
using System.Collections.Generic;

[System.Web.Script.Services.ScriptService]

public class WSExzolt : System.Web.Services.WebService
{
    public WSExzolt() { }
    readonly NegocioUsuario NegocioUsr = new NegocioUsuario();

    /*
     * @param id 
     * Valida Sesión
     */
    [WebMethod]
    public String login(int id) {
        String res;
        Usuario usr = new Usuario();
        usr.id = id;
        usr = NegocioUsr.login(usr);
        res = (usr != null) ? "Ok" : "No";
        return res;
    }

    /*
     * @param nombre 
     * Verifica Registro
     */
    [WebMethod]
    public Boolean verifiaSesion(String nombre) {
        Boolean verifia;
        verifia = NegocioUsr.verifiaSesion(nombre);
        return verifia;
    }

    /*
     * @param nombre 
     * Inserta Usuario
     */
    [WebMethod]
    public int insertarUsuario(String nombre) {
        Usuario usr = new Usuario();
        usr.nombre  = nombre;
        int respuesta = NegocioUsr.insertaUsuario(usr);
        return respuesta;
    }

    /*
     * Lista de usuarios
     */
    [WebMethod]
    public List<Usuario> tableroPuntaje() {
        List<Usuario> listUsuario;
        listUsuario = NegocioUsr.tableroPuntaje();
        return listUsuario;
    }

}

