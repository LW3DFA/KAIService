console.log("app.js cargado");

// ========================================================
// SECCIÓN: CONEXIÓN Y DIAGNÓSTICO
// ========================================================

async function probarConexion() {
    const { data, error } = await supabaseClient
        .from('clientes')
        .select('*');

    document.getElementById('resultado').innerHTML =
        error
            ? `❌ ${error.message}`
            : `✅ Conexión OK - ${data.length} clientes registrados`;
}

// ========================================================
// SECCIÓN: GESTIÓN DE CLIENTES
// ========================================================

async function guardarCliente() {
    const id = document.getElementById('cliente_id_hidden').value; // ID oculto para edición
    const nombre = document.getElementById('nombre').value;
    const telefono = document.getElementById('telefono').value;
    const email = document.getElementById('email').value;
    const direccion = document.getElementById('direccion').value;
    const observaciones = document.getElementById('observaciones').value;

    if (!nombre) {
        alert("El nombre del cliente es obligatorio.");
        return;
    }

    const datosCliente = {
        nombre,
        telefono,
        email,
        direccion,
        observaciones
    };

    let resultado;

    if (id) {
        // ACTUALIZAR cliente existente
        resultado = await supabaseClient
            .from('clientes')
            .update(datosCliente)
            .eq('id', id);
    } else {
        // INSERTAR cliente nuevo
        resultado = await supabaseClient
            .from('clientes')
            .insert([datosCliente]);
    }

    if (resultado.error) {
        alert("Error: " + resultado.error.message);
        return;
    }

    alert(id ? "Cliente actualizado correctamente" : "Cliente guardado correctamente");

    // Limpieza del formulario
    document.getElementById('cliente_id_hidden').value = "";
    document.getElementById('nombre').value = "";
    document.getElementById('telefono').value = "";
    document.getElementById('email').value = "";
    document.getElementById('direccion').value = "";
    document.getElementById('observaciones').value = "";
    document.getElementById('btn_guardar_cliente').innerText = "Guardar Cliente";

    listarClientes();
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
                    <th>Te / Whatsapp</th>
                    <th>Dirección</th>
                    <th>Email</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;

    data.forEach(cliente => {
        // Convertimos el objeto cliente a un string seguro para el botón
        const clienteString = btoa(unescape(encodeURIComponent(JSON.stringify(cliente))));

        html += `
            <tr>
                <td>${cliente.nombre || ''}</td>
                <td>${cliente.telefono || ''}</td>
                <td>${cliente.direccion || ''}</td>
                <td>${cliente.email || ''}</td>
                <td>
                    <button onclick="cargarFormularioEditarCliente('${clienteString}')">✏️ Editar</button>
                </td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    document.getElementById('listaClientes').innerHTML = html;
}

function cargarFormularioEditarCliente(clienteBase64) {
    const c = JSON.parse(decodeURIComponent(escape(atob(clienteBase64))));

    document.getElementById('cliente_id_hidden').value = c.id;
    document.getElementById('nombre').value = c.nombre || '';
    document.getElementById('telefono').value = c.telefono || '';
    document.getElementById('email').value = c.email || '';
    document.getElementById('direccion').value = c.direccion || '';
    document.getElementById('observaciones').value = c.observaciones || '';

    document.getElementById('btn_guardar_cliente').innerText = "⚠️ Actualizar Cliente";
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function buscarClientes() {
    const texto = document.getElementById('buscarCliente').value.trim();

    const { data, error } = await supabaseClient
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

// ========================================================
// SECCIÓN: GESTIÓN DE MÁQUINAS
// ========================================================

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
    if (!select) return;

    select.innerHTML = '<option value="">Seleccione un cliente</option>';

    data.forEach(cliente => {
        select.innerHTML += `
            <option value="${cliente.id}">
                ${cliente.nombre}
            </option>
        `;
    });
}

async function guardarMaquina() {
    const id = document.getElementById('maquina_id').value; // ID oculto para edición
    const cliente_id = document.getElementById('cliente_id').value;
    const tipo_maquina = document.getElementById('tipo_maquina').value;
    const maquina = document.getElementById('maquina').value;
    const marca = document.getElementById('marca').value;
    const modelo = document.getElementById('modelo').value;
    const serie = document.getElementById('serie').value;
    const ubicacion = document.getElementById('ubicacion').value;
    const observaciones = document.getElementById('obs_maquina').value;

    if (!cliente_id || !maquina) {
        alert("Por favor, seleccione un cliente y asigne un nombre a la máquina.");
        return;
    }

    const datosMaquina = {
        cliente_id: parseInt(cliente_id),
        tipo_maquina,
        maquina,
        marca,
        modelo,
        serie,
        ubicacion,
        observaciones
    };

    let resultado;

    if (id) {
        // ACTUALIZAR máquina existente
        resultado = await supabaseClient.from('maquinas').update(datosMaquina).eq('id', id);
    } else {
        // INSERTAR máquina nueva
        resultado = await supabaseClient.from('maquinas').insert([datosMaquina]);
    }

    if (resultado.error) {
        alert("Error: " + resultado.error.message);
        return;
    }

    alert(id ? 'Máquina actualizada correctamente' : 'Máquina guardada correctamente');

    // Limpieza del formulario
    document.getElementById('maquina_id').value = "";
    document.getElementById('tipo_maquina').value = "";
    document.getElementById('maquina').value = "";
    document.getElementById('marca').value = "";
    document.getElementById('modelo').value = "";
    document.getElementById('serie').value = "";
    document.getElementById('ubicacion').value = "";
    document.getElementById('obs_maquina').value = "";
    document.getElementById('cliente_id').value = "";
    document.getElementById('btn_guardar').innerText = "Guardar Máquina";

    listarMaquinas();
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
                <th>Acciones</th>
            </tr>
    `;

    data.forEach(m => {
        const maquinaString = btoa(unescape(encodeURIComponent(JSON.stringify(m))));

        html += `
            <tr>
                <td>${m.clientes?.nombre || ''}</td>
                <td>${m.maquina || ''}</td>
                <td>${m.marca || ''}</td>
                <td>${m.modelo || ''}</td>
                <td>${m.serie || ''}</td>
                <td>
                    <button onclick="cargarFormularioEditarMaquina('${maquinaString}')">✏️ Editar</button>
					<button	class="accion-btn" onclick="verHistorialMaquina(${m.id})">📜 Historial</button>
				</td>
				
            </tr>
        `;
    });

    html += '</table>';
    document.getElementById('listaMaquinas').innerHTML = html;
}

function cargarFormularioEditarMaquina(maquinaBase64) {
    const m = JSON.parse(decodeURIComponent(escape(atob(maquinaBase64))));

    document.getElementById('maquina_id').value = m.id;
    document.getElementById('cliente_id').value = m.cliente_id;
    document.getElementById('tipo_maquina').value = m.tipo_maquina || '';
    document.getElementById('maquina').value = m.maquina || '';
    document.getElementById('marca').value = m.marca || '';
    document.getElementById('modelo').value = m.modelo || '';
    document.getElementById('serie').value = m.serie || '';
    document.getElementById('ubicacion').value = m.ubicacion || '';
    document.getElementById('obs_maquina').value = m.observaciones || '';

    document.getElementById('btn_guardar').innerText = "⚠️ Actualizar Máquina";
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
// =========================
// HISTORIAL DE MAQUINA (OT)
// =========================
function verHistorialMaquina(id) {

    window.location.href =
        `historial_maquinas.html?maquina=${id}`;
}
// ======================
// OBTENER MAQUINA ACTUAL
// ======================
function obtenerMaquinaActual() {

    const params =
        new URLSearchParams(window.location.search);

    return params.get('maquina');
}

// ======================
// DATOS DE LA MAQUINA
// ======================
async function cargarDatosMaquina() {

    const maquina_id =
        obtenerMaquinaActual();

    const { data, error } =
        await supabaseClient
        .from('maquinas')
        .select(`
            *,
            clientes(nombre)
        `)
        .eq('id', maquina_id)
        .single();

    if (error) {
        console.error(error);
        return;
    }

    document.getElementById(
        'datosMaquina'
    ).innerHTML = `

        <div class="tarjeta-ot">

            <h3>
                ⚙ ${data.maquina || ''}
            </h3>

            <p>
                <strong>👤 Cliente:</strong>
                ${data.clientes?.nombre || ''}
            </p>

            <p>
                <strong>🏷 Marca:</strong>
                ${data.marca || '-'}
            </p>

            <p>
                <strong>📦 Modelo:</strong>
                ${data.modelo || '-'}
            </p>

            <p>
                <strong>🔢 Serie:</strong>
                ${data.serie || '-'}
            </p>

            <p>
                <strong>📍 Ubicación:</strong>
                ${data.ubicacion || '-'}
            </p>

            <p>
                <strong>📝 Observaciones:</strong>
                ${data.observaciones || '-'}
            </p>

        </div>
    `;
}

// ======================
// HISTORIAL MAQUINA
// ======================
async function listarHistorialMaquina() {

    const maquina_id =
        obtenerMaquinaActual();

    const { data, error } =
        await supabaseClient
        .from('ordenes')
        .select(`
            *,
            clientes(nombre)
        `)
        .eq('maquina_id', maquina_id)
        .order(
            'fecha_ingreso',
            { ascending: false }
        );

    if (error) {
        console.error(error);
        return;
    }

    let totalHoras = 0;

    let html = `
        <table border="1" width="100%">
            <thead>
                <tr>
                    <th>OT</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Horas</th>
                    <th>Falla</th>
                </tr>
            </thead>
            <tbody>
    `;

    data.forEach(o => {

        totalHoras +=
            Number(o.horas_totales || 0);

        let fecha =
            o.fecha_ingreso
            ? o.fecha_ingreso
                .split('-')
                .reverse()
                .join('/')
            : '-';

        html += `
            <tr>

                <td>
                    #${o.id}
                </td>

                <td>
                    ${fecha}
                </td>

                <td>
                    ${o.estado}
                </td>

                <td>
                    ${o.horas_totales || 0}
                </td>

                <td>
                    ${o.falla_reportada || ''}
                </td>

            </tr>
        `;
    });

    html += `
        </tbody>
        </table>

        <br>

        <strong>
            Total histórico de horas:
            ${totalHoras.toFixed(2)} hs
        </strong>
    `;

    document.getElementById(
        'historialMaquina'
    ).innerHTML = html;
}

// ========================================================
// SECCIÓN: ÓRDENES DE TRABAJO (OT)
// ========================================================
async function cargarClientesSelectOrdenes() {
    const { data, error } = await supabaseClient.from('clientes').select('id,nombre').order('nombre');
    if (!error && data) {
        const select = document.getElementById('orden_cliente_id');
        if (!select) return;
        select.innerHTML = '<option value="">Seleccione un cliente</option>';
        data.forEach(c => {
            select.innerHTML += `<option value="${c.id}">${c.nombre}</option>`;
        });
    }
}

async function cargarMaquinasDelCliente(clienteId) {
    const selectMaquina = document.getElementById('orden_maquina_id');
    if (!selectMaquina) return;
    
    if (!clienteId) {
        selectMaquina.innerHTML = '<option value="">Seleccione primero un cliente</option>';
        return;
    }

    const { data, error } = await supabaseClient
        .from('maquinas')
        .select('id, maquina, marca, modelo')
        .eq('cliente_id', clienteId)
        .order('maquina');

    if (error) {
        console.error("Error al cargar máquinas:", error);
        return;
    }

    selectMaquina.innerHTML = '<option value="">Seleccione una máquina</option>';
    
    if (data.length === 0) {
        selectMaquina.innerHTML = '<option value="">El cliente no tiene máquinas registradas</option>';
        return;
    }

    data.forEach(m => {
        selectMaquina.innerHTML += `
            <option value="${m.id}">
                ${m.maquina} - ${m.marca || ''} (${m.modelo || ''})
            </option>
        `;
    });
}
// ===========
// GUARDAR OT
// ===========
async function guardarOrden() {
	//const ordenId = document.getElementById('orden_id').value;
    const id = document.getElementById('orden_id').value;
    const cliente_id = document.getElementById('orden_cliente_id').value;
    const maquina_id = document.getElementById('orden_maquina_id').value;
    const estado = document.getElementById('estado_orden').value;
    const falla_reportada = document.getElementById('falla_reportada').value;
    const solucion_final = document.getElementById('obs_orden').value;

    if (!cliente_id || !maquina_id || !falla_reportada) {
        alert("Por favor, complete Cliente, Máquina y Falla Reportada.");
        return;
    }

    const datosOrden = {
        cliente_id: parseInt(cliente_id),
        maquina_id: parseInt(maquina_id),
        estado,
        falla_reportada,
        solucion_final: solucion_final || "",
        prioridad: "Normal",
        numero_ot: "OT-" + Date.now(),
        horas_totales: 0,
        costo_mano_obra: 0,
        costo_repuestos: 0
    };

    if (!id) {
        datosOrden.fecha_ingreso = new Date().toISOString(); 
    }

    if (estado === "Entregada") {
        datosOrden.fecha_cierre = new Date().toISOString().split('T')[0];
    }

    let resultado;

    if (id) {
        resultado = await supabaseClient.from('ordenes').update(datosOrden).eq('id', id);
    } else {
        resultado = await supabaseClient.from('ordenes').insert([datosOrden]);
    }

    if (resultado.error) {
        console.error("Error detallado de Supabase:", resultado.error);
        alert("Error al guardar la orden: " + resultado.error.message);
        return;
    }

    alert(id ? "Orden de Trabajo actualizada" : "Orden de Trabajo generada correctamente");

    // Limpieza de campos
    document.getElementById('orden_id').value = "";
    document.getElementById('falla_reportada').value = "";
    document.getElementById('obs_orden').value = "";
    document.getElementById('orden_maquina_id').innerHTML = '<option value="">Seleccione primero un cliente</option>';
    document.getElementById('orden_cliente_id').value = "";
    
    listarOrdenes();
}
// ===================================
// LISTAR Y EDITAR ORDENES DE TRABAJO
// ===================================
async function listarOrdenes() {
    const { data, error } = await supabaseClient
        .from('ordenes')
        .select(`
            *,
            clientes(nombre),
            maquinas(maquina, marca, modelo)
        `)
        .order('id', { ascending: false });

    if (error) {
        console.error("Error al listar órdenes:", error);
        return;
    }

    let html = `
        <table border="1" width="100%">
            <thead>
                <tr>
                    <th>N° OT</th>
                    <th>Fecha Ingreso</th>
                    <th>Cliente</th>
                    <th>Máquina</th>
                    <th>Falla Reportada</th>
                    <th>Estado</th>
					<th>Acciones</th>
				</tr>
			</thead>
            <tbody>
    `;

    data.forEach(o => {
        let fechaFormateada = o.fecha_ingreso ? o.fecha_ingreso.split('T')[0].split('-').reverse().join('/') : '-';

        let colorEstado = "";
        if (o.estado === "Ingresada") colorEstado = "#e2e3e5";    
        if (o.estado === "En Reparacion") colorEstado = "#fff3cd"; 
        if (o.estado === "Lista") colorEstado = "#d1e7dd";         
        if (o.estado === "Entregada") colorEstado = "#cff4fc";     

        html += `
			<tr style="background-color: ${colorEstado};">
				<td><strong>#${o.id}</strong></td>
				<td>${fechaFormateada}</td>
				<td>${o.clientes?.nombre || 'Desconocido'}</td>
				<td>${o.maquinas?.maquina || ''} ${o.maquinas?.marca || ''}</td>
				<td>${o.falla_reportada || ''}</td>
				<td><strong>${o.estado}</strong></td>
			<td style="white-space: nowrap;">
				<button onclick="editarOrden(${o.id})">
				✏️ Editar
				</button>

				<button onclick="abrirIntervenciones(${o.id})">
				🔧 Rep.
				</button>
			</td>
			</tr>
		`	;
    });

    html += '</tbody></table>';
    document.getElementById('listaOrdenes').innerHTML = html;
}

// ==========
// EDITAR OT
// ==========
async function editarOrden(id) {

    const { data, error } = await supabaseClient
        .from('ordenes')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error(error);
        alert("Error al cargar la orden");
        return;
    }

    document.getElementById('orden_id').value =
        data.id;

    document.getElementById('orden_cliente_id').value =
        data.cliente_id;

    // Cargar las máquinas del cliente
    await cargarMaquinasDelCliente(data.cliente_id);

    document.getElementById('orden_maquina_id').value =
        data.maquina_id;

    document.getElementById('estado_orden').value =
        data.estado || 'Ingresada';

    document.getElementById('falla_reportada').value =
        data.falla_reportada || '';
    		
	document.getElementById('obs_orden').value =
		data.solucion_final || '';	

    document.getElementById('btn_guardar_orden').innerText =
        'Actualizar Orden';

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}
// ==========
//  NUEVA OT
// ==========

function nuevaOrden() {

    document.getElementById('orden_id').value = '';

    document.getElementById('orden_cliente_id').value = '';

    document.getElementById('orden_maquina_id').innerHTML =
        '<option value="">Seleccione primero un cliente</option>';

    document.getElementById('estado_orden').value =
        'Ingresada';

    document.getElementById('falla_reportada').value = '';

    document.getElementById('obs_orden').value = '';

    document.getElementById('btn_guardar_orden').innerText =
        'Guardar Orden de Trabajo';
}
// ===================================
//  NUEVA REPARACION en una OT CREADA
// ===================================
function abrirIntervenciones(id) {
    window.location.href =
        `intervenciones.html?orden=${id}`;
}

function obtenerOrdenActual() {

    const params =
        new URLSearchParams(window.location.search);

    return params.get('orden');
}

// ======================
// GUARDAR INTERVENCION
// ======================
async function guardarIntervencion() {

    const orden_id = obtenerOrdenActual();

    const trabajo_realizado =
        document.getElementById('trabajo_realizado').value;

    const tiempo_empleado =
        document.getElementById('tiempo_empleado').value;

    const repuestos_utilizados =
        document.getElementById('repuestos_utilizados').value;

    const observaciones =
        document.getElementById('obs_intervencion').value;

    if (!trabajo_realizado) {
        alert('Ingrese el trabajo realizado');
        return;
    }

    const { error } = await supabaseClient
        .from('intervenciones')
        .insert([
            {
                orden_id: parseInt(orden_id),
                trabajo_realizado,
                tiempo_empleado:
                    tiempo_empleado || 0,
                repuestos_utilizados,
                observaciones
            }
        ]);

    if (error) {
        console.error(error);
        alert(error.message);
        return;
    }

    alert('Intervención guardada');

    document.getElementById('trabajo_realizado').value = '';
    document.getElementById('tiempo_empleado').value = '';
    document.getElementById('repuestos_utilizados').value = '';
    document.getElementById('obs_intervencion').value = '';

	listarIntervenciones();
	calcularHorasOT();
}
// ======================
// CARGAR DATOS DE OT
// ======================
async function cargarDatosOrden() {

    const orden_id = obtenerOrdenActual();

    const { data, error } = await supabaseClient
        .from('ordenes')
        .select(`
            *,
            clientes(nombre),
            maquinas(maquina, marca, modelo, ubicacion)
        `)
        .eq('id', orden_id)
        .single();

    if (error) {
        console.error(error);
        return;
    }

    document.getElementById('datosOrden').innerHTML = `
        <div class="tarjeta-ot">
            <h3>🔧 OT #${data.id}</h3>

            <p><strong>👤 Cliente:</strong>
                ${data.clientes?.nombre || ''}
            </p>

            <p><strong>⚙ Máquina:</strong>
                ${data.maquinas?.maquina || ''}
                ${data.maquinas?.marca || ''}
                ${data.maquinas?.modelo || ''}
            </p>

            <p><strong>📍 Ubicación:</strong>
                ${data.maquinas?.ubicacion || '-'}
            </p>

            <p><strong>📋 Estado:</strong>
                ${data.estado}
            </p>

            <p>
                <strong>🕒 Horas acumuladas:</strong>
                <span id="horasAcumuladas">0</span> hs
            </p>
        </div>
    `;
}

// ======================
// CALCULAR HORAS
// ======================
async function calcularHorasOT() {

    const orden_id = obtenerOrdenActual();

    const { data, error } = await supabaseClient
        .from('intervenciones')
        .select('tiempo_empleado')
        .eq('orden_id', orden_id);

    if (error) {
        console.error(error);
        return;
    }

    let total = 0;

    data.forEach(i => {
        total += Number(i.tiempo_empleado || 0);
    });

    const horasSpan =
        document.getElementById('horasAcumuladas');

    if (horasSpan) {
        horasSpan.innerText = total.toFixed(2);
    }

    await supabaseClient
        .from('ordenes')
        .update({
            horas_totales: total
        })
        .eq('id', orden_id);
}

// ====================
// LISTAR REPARACIONES
// ====================
async function listarIntervenciones() {

    const orden_id = obtenerOrdenActual();

    const { data, error } = await supabaseClient
        .from('intervenciones')
        .select('*')
        .eq('orden_id', orden_id)
        .order('fecha', { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    let html = `
        <table border="1" width="100%">
            <tr>
                <th>Fecha</th>
                <th>Trabajo</th>
                <th>Horas</th>
            </tr>
    `;

    data.forEach(i => {

        let fecha = i.fecha
			? i.fecha.split('T')[0]
			.split('-')
			.reverse()
			.join('/')
			: '';

        html += `
            <tr>
                <td>${fecha}</td>
                <td>${i.trabajo_realizado || ''}</td>
                <td>${i.tiempo_empleado || 0}</td>
            </tr>
        `;
    });

    html += '</table>';

    document.getElementById(
        'listaIntervenciones'
    ).innerHTML = html;
}

// ========================================================
// CONTROL DE AUTOMATIZACIÓN (AL CARGAR CADA PÁGINA)
// ========================================================

document.addEventListener('DOMContentLoaded', () => {
    // Eventos para la pantalla de Clientes
    if (document.getElementById('listaClientes')) {
        listarClientes();
    }

    // Eventos para la pantalla de Máquinas
    if (document.getElementById('cliente_id')) {
        cargarClientesSelect();
    }
    if (document.getElementById('listaMaquinas')) {
        listarMaquinas();
    }

    // Eventos para la pantalla de OT
    if (document.getElementById('orden_cliente_id')) {
        cargarClientesSelectOrdenes();
    }
    if (document.getElementById('listaOrdenes')) {
        listarOrdenes();
    }
	if (window.location.pathname.includes('intervenciones.html')) {
    console.log('Intervenciones cargadas');
	cargarDatosOrden();
    listarIntervenciones();
    calcularHorasOT();
	}
	if (window.location.pathname.includes('historial_maquinas.html')) {
    console.log('Historial máquina cargado');
    cargarDatosMaquina();
    listarHistorialMaquina();
	}
});