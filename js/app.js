console.log("app.js cargado");

async function probarConexion() {

    const { data, error } =
        await supabaseClient
            .from('clientes')
            .select('*');

    document.getElementById('resultado').innerHTML =
        error
            ? `❌ ${error.message}`
            : `✅ Conexión OK - ${data.length} clientes registrados`;
}

async function guardarCliente() {

    const nombre = document.getElementById('nombre').value;
    const telefono = document.getElementById('telefono').value;
    const email = document.getElementById('email').value;
    const direccion = document.getElementById('direccion').value;
    const observaciones = document.getElementById('observaciones').value;

    const { error } = await supabaseClient
        .from('clientes')
        .insert([
            {
                nombre,
                telefono,
                email,
                direccion,
                observaciones
            }
        ]);

    if (error) {
        alert("Error: " + error.message);
        return;
    }

    alert("Cliente guardado correctamente");
}
async function listarClientes() {

    const { data, error } = await supabaseClient
        .from('clientes')
        .select('*')
        .order('nombre');

    if (error) {
        console.error(error);
        return;
    }

    let html = `
        <table border="1" width="100%">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Teléfono</th>
                    <th>Dirección</th>
                    <th>Email</th>
                </tr>
            </thead>
            <tbody>
    `;

    data.forEach(cliente => {

        html += `
            <tr>
                <td>${cliente.nombre || ''}</td>
                <td>${cliente.telefono || ''}</td>
                <td>${cliente.direccion || ''}</td>
                <td>${cliente.email || ''}</td>
            </tr>
        `;

    });

    html += `
            </tbody>
        </table>
    `;

    document.getElementById('listaClientes').innerHTML = html;
}			
				
async function buscarClientes() {

    const texto =
        document.getElementById('buscarCliente')
        .value
        .trim();

    const { data, error } =
        await supabaseClient
        .from('clientes')
        .select('*')
        .ilike('nombre', `%${texto}%`);

    if (error) {
        console.error(error);
        return;
    }

    let html = '';

    data.forEach(cliente => {

        html += `
            <div>
                <strong>${cliente.nombre}</strong><br>
                ${cliente.telefono || ''}
            </div>
            <hr>
        `;
    });

    document.getElementById('listaClientes').innerHTML = html;
}
