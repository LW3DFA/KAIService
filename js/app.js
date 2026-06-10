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
async function cargarClientesSelect() {

    const { data, error } = await supabaseClient
        .from('clientes')
        .select('id,nombre')
        .order('nombre');

    if (error) {
        console.error(error);
        return;
    }

    const select = document.getElementById('cliente_id');

    select.innerHTML =
        '<option value="">Seleccione un cliente</option>';

    data.forEach(cliente => {

        select.innerHTML += `
            <option value="${cliente.id}">
                ${cliente.nombre}
            </option>
        `;
    });
}



async function guardarMaquina() {

    const cliente_id =
        document.getElementById('cliente_id').value;

    const tipo_maquina =
        document.getElementById('tipo_maquina').value;

    const maquina =
        document.getElementById('maquina').value;

    const marca =
        document.getElementById('marca').value;

    const modelo =
        document.getElementById('modelo').value;

    const serie =
        document.getElementById('serie').value;

    const ubicacion =
        document.getElementById('ubicacion').value;

    const observaciones =
        document.getElementById('obs_maquina').value;

    const { error } = await supabaseClient
        .from('maquinas')
        .insert([
            {
                cliente_id,
                tipo_maquina,
                maquina,
                marca,
                modelo,
                serie,
                ubicacion,
                observaciones
            }
        ]);

    if (error) {
        alert(error.message);
        return;
    }

    alert('Máquina guardada correctamente');
}

async function listarMaquinas() {

    const { data, error } = await supabaseClient
        .from('maquinas')
        .select(`
            *,
            clientes(nombre)
        `)
        .order('maquina');

    if (error) {
        console.error(error);
        return;
    }

    let html = `
        <table border="1" width="100%">
            <tr>
                <th>Cliente</th>
                <th>Máquina</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Serie</th>
            </tr>
    `;

    data.forEach(m => {

        html += `
            <tr>
                <td>${m.clientes?.nombre || ''}</td>
                <td>${m.maquina || ''}</td>
                <td>${m.marca || ''}</td>
                <td>${m.modelo || ''}</td>
                <td>${m.serie || ''}</td>
            </tr>
        `;
    });

    html += '</table>';

    document.getElementById('listaMaquinas').innerHTML = html;
}