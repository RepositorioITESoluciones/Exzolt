using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Exzolt.Entidades {
    public class Usuario {
        public int id { set; get; }
        public String nombre { set; get; }
        public String apellido_paterno { set; get; }
        public String apellido_materno { set; get; }
        public string nombreUsuario { set; get; }
        public string contraseña { set; get; }
        public string contraseñaVali { set; get; }
    }
}
