console.log("app.js cargado");
async function probarConexion() {
    try {

        const { data, error } = await supabaseClient
            .from('clientes')
            .select('*');

        if (error) {
            document.getElementById('resultado').innerHTML =
                '❌ ' + error.message;
            return;
        }

        document.getElementById('resultado').innerHTML =
            '✅ Conexión OK - ' + data.length + ' clientes registrados';

    } catch (err) {

        document.getElementById('resultado').innerHTML =
            '❌ Error: ' + err.message;

        console.error(err);
    }
}
