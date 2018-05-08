using System;
using System.Collections.Generic;
using System.Web.Services;
using System.Data;
using Exzolt.Negocio;   
using Exzolt.Entidades;



/// <summary>
/// Summary description for MyServiceClass
/// </summary>
/// 
[System.Web.Script.Services.ScriptService]

public class WSExzolt : System.Web.Services.WebService
{
    public WSExzolt() { }
    readonly NegocioUsuario NegocioUsr = new NegocioUsuario();

    [WebMethod]
    public String login(String nombre, string nombreUsuario, string contrasena) {
        Usuario usr = new Usuario();
        usr.nombre = nombre;
        usr.nombreUsuario = nombreUsuario;
        usr.contraseña = contrasena;
        usr = NegocioUsr.ObtieneUser(usr);
        if (usr.nombre != null) {
            Console.WriteLine("Entra");
            return "OK";
        } else {
            Console.WriteLine("No entra");
            return "NO";
        }
    }

    [WebMethod]
    public bool insertar(string nombre, string apellido_paterno, string apellido_materno ,string nombreUsuario, string contrasena, string contrasenaVali) {
        Usuario usr = new Usuario();
        usr.nombre = nombre;
        usr.apellido_paterno = apellido_paterno;
        usr.apellido_materno = apellido_materno;
        usr.nombreUsuario = nombreUsuario;
        usr.contraseña = contrasena;
        usr.contraseñaVali = contrasenaVali;
        bool respuesta = NegocioUsr.insertarUser(usr);
        if (respuesta) {
            return respuesta;
        } else {        
            return respuesta;
        }


    }


}

