<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "usuariosPrueba";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

$correo = $_POST['correo'];  // Asegúrate de que estás utilizando el nombre correcto del campo
$password = $_POST['password'];

// Utiliza sentencias preparadas para evitar la inyección de SQL
$resultado = mysqli_query($conn,"SELECT * FROM admins WHERE email='$correo' and password='$password'");

if ($resultado->num_rows > 0) {
    // Credenciales válidas
    $response = array('success' => true);
} else {
    // Credenciales inválidas
    $response = array('success' => false);
}

error_log("Error en validarUsuarios.php: " . json_encode($_POST));

// Devolver respuesta al frontend
echo json_encode($response);

// Cerrar la conexión a la base de datos
$conn->close();
?>
