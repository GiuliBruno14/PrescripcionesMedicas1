-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 13-06-2024 a las 03:06:41
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `prescripcionesmedicas`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id` int(11) NOT NULL,
  `categoria` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id`, `categoria`) VALUES
(16, 'Alergias'),
(15, 'Analgésicos y antipiréticos'),
(8, 'Aparato Digestivo'),
(1, 'Aparato Respiratorio'),
(10, 'Cardiovascular'),
(5, 'Dermatología:'),
(14, 'Endocrinologia'),
(11, 'Gastroenterología'),
(7, 'Infectología'),
(9, 'Nutriologia'),
(12, 'Oftalmología'),
(6, 'Oncologia'),
(13, 'Psiquiatría'),
(3, 'Sistema Endocrino'),
(4, 'Sistema Musculoesquelético'),
(2, 'Sistema Nervioso');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `concentracion`
--

CREATE TABLE `concentracion` (
  `id` int(11) NOT NULL,
  `concentracion` int(20) NOT NULL,
  `unidad` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `concentracion`
--

INSERT INTO `concentracion` (`id`, `concentracion`, `unidad`) VALUES
(1, 10, 'mg'),
(2, 100, 'mg'),
(3, 200, 'mg'),
(4, 300, 'mg'),
(5, 400, 'mg'),
(6, 500, 'mg'),
(7, 600, 'mg'),
(8, 800, 'mg'),
(9, 1000, 'mg'),
(10, 10, 'ml'),
(11, 20, 'ml');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `especialidades`
--

CREATE TABLE `especialidades` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `id_profesion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `especialidades`
--

INSERT INTO `especialidades` (`id`, `nombre`, `id_profesion`) VALUES
(1, 'Medicina Familiar', 1),
(2, 'Geriatria', 1),
(3, 'Medicina de Urgencias', 1),
(4, 'Neonatologia', 2),
(5, 'Pediatria General', 2),
(6, 'Cardiologo Intervencionista', 3),
(7, 'Insuficiencia Cardiaca y transplante', 3),
(8, 'Neurocirugia', 4),
(9, 'Neurologia Pediatrica', 4),
(10, 'Neurologo Vascular', 4),
(11, 'Medicina Reproductiva', 5),
(12, 'Ginecologia Oncologica', 5),
(13, 'Uroginecologia', 5),
(14, 'Cirugia General', 6),
(15, 'Cirugia Plastica y Reconstructiva', 6),
(16, 'Cirugia Cardiovascular', 6),
(17, 'Dermatologia Clinica', 7),
(18, 'Dermatologia Pediatrica', 7),
(19, 'Dermatopatologia', 7),
(20, 'Psiquiatria General', 8),
(21, 'Psiquiatria de la Infancia y Adolescencia', 8),
(22, 'Oncologia Medica', 9),
(23, 'Oncologia Radioterapica', 9),
(24, 'Anestesia General', 10),
(25, 'Anestesia Pediatrica', 10),
(26, 'Manejo del dolor', 10);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `familias`
--

CREATE TABLE `familias` (
  `id` int(11) NOT NULL,
  `familia` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `familias`
--

INSERT INTO `familias` (`id`, `familia`) VALUES
(1, 'Analgesicos'),
(10, 'Antibioticos'),
(6, 'Anticoagulantes'),
(9, 'Antidepresivos'),
(12, 'Antidiabeticos'),
(4, 'Antiemeticos'),
(7, 'Antiepilepticos'),
(8, 'Antihipertensivos'),
(3, 'Antihistaminicos'),
(5, 'Antiinflamatorios'),
(2, 'Antivirales'),
(11, 'ISRS');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `formas_farmaceuticas`
--

CREATE TABLE `formas_farmaceuticas` (
  `id` int(11) NOT NULL,
  `forma_farmaceutica` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `formas_farmaceuticas`
--

INSERT INTO `formas_farmaceuticas` (`id`, `forma_farmaceutica`) VALUES
(1, 'comprimidos'),
(2, 'capsulas'),
(3, 'jarabe'),
(4, 'inyecciones'),
(5, 'supositorios'),
(6, 'crema'),
(7, 'gotas');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `indicacion`
--

CREATE TABLE `indicacion` (
  `id` int(11) NOT NULL,
  `indicacion` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `indicacion`
--

INSERT INTO `indicacion` (`id`, `indicacion`) VALUES
(1, 'Neumonia'),
(2, 'Tuberculosis'),
(3, 'Fracturas costales'),
(4, 'EPOC'),
(5, 'Evaluacion de anemia'),
(6, 'Trastornos de la coagulacion'),
(7, 'Evaluacion preoperatoria'),
(8, 'Dolor abdominal'),
(9, 'Evaluación de ritmo cardíaco anormal'),
(10, 'Evaluación de sangrado gastrointestinal'),
(11, 'Evaluación de síntomas gastrointestinale'),
(12, 'Traumatismo craneal'),
(13, 'Detección de tumores cerebrales'),
(14, 'Trauma o lesion');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medicamentos`
--

CREATE TABLE `medicamentos` (
  `id` int(11) NOT NULL,
  `nombre_generico` varchar(30) NOT NULL,
  `nombre_comercial` varchar(30) NOT NULL,
  `categoria` int(11) NOT NULL,
  `familia` int(11) NOT NULL,
  `estado` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `medicamentos`
--

INSERT INTO `medicamentos` (`id`, `nombre_generico`, `nombre_comercial`, `categoria`, `familia`, `estado`) VALUES
(9, 'Ibuprofeno', 'Ibupirac', 4, 1, 1),
(12, 'Loratadina', 'Civeran', 16, 3, 1),
(13, 'Amoxicilina', 'Amoxil', 7, 10, 1),
(14, 'Dipirona', 'Novalgina', 15, 1, 1),
(18, 'Metformina', '', 14, 12, 1),
(19, 'Paroxetina', 'Paxil', 13, 11, 1),
(21, 'Metoclopramida', '', 8, 4, 1),
(35, 'Paracetamol', 'Tylenol', 15, 1, 1),
(36, 'Cetirizina', 'Zyrtec', 16, 3, 0),
(37, 'Omeprazol', '', 8, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medicamentos_concentraciones`
--

CREATE TABLE `medicamentos_concentraciones` (
  `id_medicamento` int(20) NOT NULL,
  `id_concentracion` int(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `medicamentos_concentraciones`
--

INSERT INTO `medicamentos_concentraciones` (`id_medicamento`, `id_concentracion`) VALUES
(12, 5),
(14, 2),
(14, 3),
(18, 3),
(19, 5),
(9, 1),
(9, 2),
(9, 3),
(9, 5),
(9, 7),
(21, 2),
(37, 1),
(35, 5),
(35, 7),
(13, 2),
(13, 3),
(13, 4),
(13, 5),
(13, 6),
(13, 7),
(13, 8),
(13, 9),
(36, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medicamentos_formasf`
--

CREATE TABLE `medicamentos_formasf` (
  `id_medicamento` int(20) NOT NULL,
  `id_formasf` int(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `medicamentos_formasf`
--

INSERT INTO `medicamentos_formasf` (`id_medicamento`, `id_formasf`) VALUES
(12, 1),
(14, 1),
(14, 2),
(18, 1),
(19, 1),
(9, 1),
(9, 3),
(21, 1),
(37, 2),
(35, 1),
(35, 2),
(13, 1),
(13, 2),
(36, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medicamentos_presentaciones`
--

CREATE TABLE `medicamentos_presentaciones` (
  `id_medicamento` int(20) NOT NULL,
  `id_presentacion` int(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `medicamentos_presentaciones`
--

INSERT INTO `medicamentos_presentaciones` (`id_medicamento`, `id_presentacion`) VALUES
(12, 1),
(14, 1),
(14, 2),
(18, 1),
(19, 1),
(9, 1),
(21, 1),
(37, 2),
(35, 1),
(35, 2),
(13, 1),
(13, 2),
(13, 5),
(36, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `obra_social`
--

CREATE TABLE `obra_social` (
  `id` int(11) NOT NULL,
  `nombre` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `obra_social`
--

INSERT INTO `obra_social` (`id`, `nombre`) VALUES
(5, 'Galeno'),
(2, 'Medicus'),
(3, 'Omint'),
(1, 'Osde'),
(6, 'Prevencion Salud'),
(7, 'Sin obra social'),
(4, 'Swiss Medical');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pacientes`
--

CREATE TABLE `pacientes` (
  `id` int(11) NOT NULL,
  `nombre` varchar(30) NOT NULL,
  `apellido` varchar(30) NOT NULL,
  `documento` varchar(8) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `sexo` varchar(10) NOT NULL,
  `estado` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pacientes`
--

INSERT INTO `pacientes` (`id`, `nombre`, `apellido`, `documento`, `fecha_nacimiento`, `sexo`, `estado`) VALUES
(1, 'Juan', 'Lopez', '23456789', '1990-05-21', 'M', 1),
(2, 'Ana', 'Suarez', '23456235', '1972-05-12', 'F', 1),
(3, 'Vianney', 'Celiz', '44219287', '2002-06-27', 'M', 1),
(4, 'Juana', 'Martinez', '32567890', '1998-09-13', 'F', 1),
(5, 'Mariano', 'Dominguez', '34567234', '1988-03-31', 'M', 1),
(6, 'Sol', 'Lopez', '12345543', '2000-06-04', 'F', 1),
(7, 'Franco', 'Gomez', '45678432', '2003-06-07', 'M', 1),
(8, 'Facundo', 'Fernandez', '32456432', '1990-03-27', 'M', 1),
(12, 'Giulietta', 'Bruno', '42767443', '2000-08-14', 'F', 1),
(13, 'Valentina', 'Lencina', '43153863', '2000-12-05', 'F', 1),
(14, 'Laura', 'Perez', '12345678', '1980-01-12', 'F', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `paciente_obrasocial`
--

CREATE TABLE `paciente_obrasocial` (
  `id` int(11) NOT NULL,
  `id_paciente` int(11) NOT NULL,
  `id_obrasocial` int(11) NOT NULL,
  `plan` int(11) NOT NULL,
  `estado` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `paciente_obrasocial`
--

INSERT INTO `paciente_obrasocial` (`id`, `id_paciente`, `id_obrasocial`, `plan`, `estado`) VALUES
(53, 2, 5, 14, 0),
(54, 2, 2, 5, 1),
(55, 2, 7, 26, 1),
(56, 8, 2, 5, 1),
(57, 8, 7, 26, 1),
(58, 7, 7, 26, 1),
(59, 7, 2, 5, 1),
(60, 12, 2, 6, 1),
(61, 12, 7, 26, 1),
(62, 1, 7, 26, 1),
(63, 4, 2, 8, 1),
(64, 4, 7, 26, 1),
(65, 14, 1, 3, 1),
(66, 14, 7, 26, 1),
(67, 5, 2, 6, 1),
(68, 5, 7, 26, 1),
(69, 5, 4, 24, 1),
(70, 6, 7, 26, 1),
(71, 13, 7, 26, 1),
(72, 3, 4, 22, 1),
(73, 3, 7, 26, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `plan`
--

CREATE TABLE `plan` (
  `id` int(11) NOT NULL,
  `nombre` varchar(30) NOT NULL,
  `id_obrasocial` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `plan`
--

INSERT INTO `plan` (`id`, `nombre`, `id_obrasocial`) VALUES
(1, '210', 1),
(2, '310', 1),
(3, '410', 1),
(4, '450', 1),
(5, 'Azul', 2),
(6, 'Verde', 2),
(7, 'Rojo', 2),
(8, 'Oro', 2),
(9, 'Joven', 3),
(10, 'Basico', 3),
(11, 'Clasico', 3),
(12, 'Premium', 3),
(13, '220', 5),
(14, '220', 5),
(15, '330', 5),
(16, '440', 5),
(17, '550', 5),
(18, 'A', 6),
(19, 'B', 6),
(20, 'C', 6),
(21, 'D', 6),
(22, 'SMG20', 4),
(23, 'SMG40', 4),
(24, 'SMG50', 4),
(25, 'SMG60', 4),
(26, 'Sin plan', 7);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prescripciones`
--

CREATE TABLE `prescripciones` (
  `id` int(11) NOT NULL,
  `id_profesional` int(11) NOT NULL,
  `paciente_datos` int(11) NOT NULL,
  `diagnostico` text NOT NULL,
  `fechaPrescripcion` date NOT NULL,
  `vigencia` date NOT NULL,
  `observaciones` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `prescripciones`
--

INSERT INTO `prescripciones` (`id`, `id_profesional`, `paciente_datos`, `diagnostico`, `fechaPrescripcion`, `vigencia`, `observaciones`) VALUES
(26, 5, 54, 'gggg', '2024-06-13', '2024-07-13', ''),
(27, 5, 57, 'prueba', '2024-06-13', '0000-00-00', ''),
(28, 8, 58, 'fffffff', '2024-06-13', '0000-00-00', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prescripcion_medicamento`
--

CREATE TABLE `prescripcion_medicamento` (
  `id_prescripcion` int(11) NOT NULL,
  `id_medicamento` int(11) NOT NULL,
  `id_concentracion` int(11) NOT NULL,
  `id_formaf` int(11) NOT NULL,
  `id_presentacion` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `intervalo` varchar(15) NOT NULL,
  `duracion` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `prescripcion_medicamento`
--

INSERT INTO `prescripcion_medicamento` (`id_prescripcion`, `id_medicamento`, `id_concentracion`, `id_formaf`, `id_presentacion`, `cantidad`, `intervalo`, `duracion`) VALUES
(26, 13, 3, 2, 1, 12, '1 hora(s)', '12 dia(s)'),
(27, 14, 2, 2, 1, 1, '12 dia(s)', '12 semana(s)'),
(28, 13, 2, 1, 1, 1, '12 hora(s)', '1 semana(s)');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prescripcion_prestacion`
--

CREATE TABLE `prescripcion_prestacion` (
  `id_prescripcion` int(11) NOT NULL,
  `id_datosprestacion` int(11) NOT NULL,
  `lado` varchar(10) NOT NULL,
  `justificacion` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `prescripcion_prestacion`
--

INSERT INTO `prescripcion_prestacion` (`id_prescripcion`, `id_datosprestacion`, `lado`, `justificacion`) VALUES
(26, 1, 'Izquierdo', '1232312'),
(27, 1, 'Izquierdo', 'fffff');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `presentaciones`
--

CREATE TABLE `presentaciones` (
  `id` int(11) NOT NULL,
  `presentacion` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `presentaciones`
--

INSERT INTO `presentaciones` (`id`, `presentacion`) VALUES
(1, 'x10 unidades'),
(2, 'x20 unidades'),
(3, 'x1 unidad'),
(4, 'x3 unidades'),
(5, 'x30 unidades');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prestaciones`
--

CREATE TABLE `prestaciones` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `prestaciones`
--

INSERT INTO `prestaciones` (`id`, `nombre`) VALUES
(2, 'Analisis de sangre completo'),
(5, 'Colonoscopia'),
(3, 'Ecografia abdominal'),
(4, 'Electrocardiograma'),
(7, 'Mamografia'),
(11, 'Radiografia de hombro'),
(12, 'Radiografia de muñeca'),
(13, 'Radiografia de tobillo'),
(1, 'Radiografia de torax'),
(6, 'Tomografia computarizada cerebral');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prestacion_indicacion`
--

CREATE TABLE `prestacion_indicacion` (
  `id` int(11) NOT NULL,
  `id_prestacion` int(11) NOT NULL,
  `id_indicacion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `prestacion_indicacion`
--

INSERT INTO `prestacion_indicacion` (`id`, `id_prestacion`, `id_indicacion`) VALUES
(1, 2, 5),
(2, 2, 6),
(3, 2, 7),
(4, 3, 8),
(5, 4, 9),
(6, 5, 10),
(7, 5, 11),
(8, 6, 12),
(9, 6, 13),
(10, 11, 14),
(11, 1, 1),
(12, 1, 2),
(13, 1, 3),
(14, 1, 4),
(15, 12, 14),
(23, 13, 14),
(27, 2, 5),
(28, 2, 6),
(29, 2, 7),
(30, 2, 5),
(31, 2, 6),
(32, 2, 7),
(33, 2, 5),
(34, 2, 6),
(35, 2, 7),
(36, 2, 5),
(37, 2, 6),
(38, 2, 7),
(39, 5, 10),
(40, 5, 11);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profesionales`
--

CREATE TABLE `profesionales` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `documento` varchar(10) NOT NULL,
  `profesion` int(11) NOT NULL,
  `especialidad` int(11) NOT NULL,
  `domicilio` varchar(100) NOT NULL,
  `matricula` varchar(30) NOT NULL,
  `id_REFEPS` varchar(20) NOT NULL,
  `fecha_caducidad` date NOT NULL,
  `estado` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `profesionales`
--

INSERT INTO `profesionales` (`id`, `nombre`, `apellido`, `documento`, `profesion`, `especialidad`, `domicilio`, `matricula`, `id_REFEPS`, `fecha_caducidad`, `estado`) VALUES
(1, 'Juan', 'Perez', '12345678', 3, 7, 'Junin 898, San Luis', '12345', '01-12345-7', '2026-01-18', 1),
(2, 'Maria', 'Garcia', '27123456', 10, 25, 'San Martin 567, Catamarca', '54321', '02-54321-3', '2027-05-20', 1),
(3, 'Carlos', 'Gomez', '29123456', 7, 17, 'Belgrano 678', '67890', '03-67890-4', '2025-07-04', 1),
(4, 'Laura', 'Fernandez', '31123456', 6, 16, '9 de Julio 456, Mendoza', '13579', '04-13579-2', '2030-07-06', 1),
(5, 'Sergio', 'Gimenez', '23567543', 6, 16, 'Rivadavia 678, San Luis', '45678', '03-12345-8', '2030-05-04', 1),
(8, 'Carla', 'Rodriguez', '34267854', 10, 24, '25 de mayo 456, Santa Fe', '24562', '10-34567-1', '2030-04-02', 1),
(9, 'Pedro', 'Perez', '23674521', 10, 25, 'San Juan 567', '09123', '09-78901-2', '2026-07-04', 1),
(10, 'Roberto', 'Suarez', '21786098', 4, 9, 'General Paz 123', '67542', '08-23456-5', '2030-09-04', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profesiones`
--

CREATE TABLE `profesiones` (
  `id` int(11) NOT NULL,
  `nombre` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `profesiones`
--

INSERT INTO `profesiones` (`id`, `nombre`) VALUES
(10, 'Anestesiologia'),
(3, 'Cardiologia'),
(6, 'Cirugia'),
(7, 'Dermatologia'),
(5, 'Ginecologia y Obstetricia'),
(1, 'Medicina General'),
(4, 'Neurologia'),
(9, 'Oncologia'),
(2, 'Pediatria'),
(8, 'Psiquiatria');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(500) NOT NULL,
  `rol` varchar(30) NOT NULL,
  `id_profesional` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `username`, `password`, `rol`, `id_profesional`) VALUES
(1, 'admin1', '$2a$10$ZQ25siHfE01.21yPJj5MLe0rJdgEcw9L2F3MJoD26PfLIoGheU8/.', 'admin', NULL),
(2, 'carla24562', '$2a$10$1zKXwy0a1EGwVKFmC0l2iOglomXb8pFR/qP10Yuh57UcNbORfLwgq', 'profesional', 8),
(3, 'carlos67890', '$2a$10$8ZV3z694Bat61tLz0j6hJefxtGI2Puz0K02nC75FIwOeWE75XRhC.', 'profesional', 3),
(8, 'sergio45678', '$2a$10$nELvZPU6sJCwmix8WPLozueV1Xl6KPREm0tgxpffSFJpzU2OiEdv6', 'profesional', 5),
(9, 'laura13579', '$2a$10$jYNK0GVplqYmNNC3edWz4.4kiCY...XqLm2mKvlfCZMv8Mc6Gp88G', 'profesional', 4),
(10, 'maria54321', '$2a$10$vFm5NDArnKjfH.l9keL/o.EaybGJwCSUVwaKADDmFu1KeLmkhrLXO', 'profesional', 2),
(11, 'juan12345', '$2a$10$ytw6rYXtRCgOegr2nnunrOxEHPkU57jhAqn6/Jt/jfZYebQhNww3q', 'profesional', 1),
(12, 'pedro09123', '$2a$10$EqgTNUFg1PYGzGW3aWm/9.t4K2Vhaehf3nKKGo8i2VV7h18DlBxGq', 'profesional', 9),
(13, 'administrador2', '$2a$10$3KPdTN037JG0kytyTnuQ1uV/hb33I7ky.FQeyLFdfuqaeRV9.Nn4S', 'admin', NULL),
(14, 'roberto67542', '$2a$10$gd.gnBc18JiXZ5a3bEBv6eBVWt4d.4Y9uzIYKhm.kCXlqORjPB472', 'profesional', 10);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `categoria` (`categoria`);

--
-- Indices de la tabla `concentracion`
--
ALTER TABLE `concentracion`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `especialidades`
--
ALTER TABLE `especialidades`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`),
  ADD KEY `id_profesion` (`id_profesion`);

--
-- Indices de la tabla `familias`
--
ALTER TABLE `familias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `familia` (`familia`);

--
-- Indices de la tabla `formas_farmaceuticas`
--
ALTER TABLE `formas_farmaceuticas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `indicacion`
--
ALTER TABLE `indicacion`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `medicamentos`
--
ALTER TABLE `medicamentos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre_generico` (`nombre_generico`),
  ADD KEY `familia` (`familia`),
  ADD KEY `categoria` (`categoria`);

--
-- Indices de la tabla `medicamentos_concentraciones`
--
ALTER TABLE `medicamentos_concentraciones`
  ADD KEY `id_medicamento` (`id_medicamento`),
  ADD KEY `id_concentracion` (`id_concentracion`);

--
-- Indices de la tabla `medicamentos_formasf`
--
ALTER TABLE `medicamentos_formasf`
  ADD KEY `id_medicamento` (`id_medicamento`),
  ADD KEY `id_formasf` (`id_formasf`);

--
-- Indices de la tabla `medicamentos_presentaciones`
--
ALTER TABLE `medicamentos_presentaciones`
  ADD KEY `id_medicamento` (`id_medicamento`),
  ADD KEY `id_presentacion` (`id_presentacion`);

--
-- Indices de la tabla `obra_social`
--
ALTER TABLE `obra_social`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `documento` (`documento`);

--
-- Indices de la tabla `paciente_obrasocial`
--
ALTER TABLE `paciente_obrasocial`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_paciente` (`id_paciente`),
  ADD KEY `id_obrasocial` (`id_obrasocial`),
  ADD KEY `plan` (`plan`);

--
-- Indices de la tabla `plan`
--
ALTER TABLE `plan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_obrasocial` (`id_obrasocial`);

--
-- Indices de la tabla `prescripciones`
--
ALTER TABLE `prescripciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_profesional` (`id_profesional`),
  ADD KEY `prescripciones_ibfk_2` (`paciente_datos`);

--
-- Indices de la tabla `prescripcion_medicamento`
--
ALTER TABLE `prescripcion_medicamento`
  ADD KEY `id_medicamento` (`id_medicamento`),
  ADD KEY `id_prescripcion` (`id_prescripcion`),
  ADD KEY `id_formaf` (`id_formaf`),
  ADD KEY `id_concentracion` (`id_concentracion`),
  ADD KEY `id_presentacion` (`id_presentacion`);

--
-- Indices de la tabla `prescripcion_prestacion`
--
ALTER TABLE `prescripcion_prestacion`
  ADD KEY `id_prescripcion` (`id_prescripcion`),
  ADD KEY `prescripcion_prestacion_ibfk_2` (`id_datosprestacion`);

--
-- Indices de la tabla `presentaciones`
--
ALTER TABLE `presentaciones`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `prestaciones`
--
ALTER TABLE `prestaciones`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `prestacion_indicacion`
--
ALTER TABLE `prestacion_indicacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_indicacion` (`id_indicacion`),
  ADD KEY `id_prestacion` (`id_prestacion`);

--
-- Indices de la tabla `profesionales`
--
ALTER TABLE `profesionales`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `documento` (`documento`),
  ADD UNIQUE KEY `id_REFEPS` (`id_REFEPS`),
  ADD UNIQUE KEY `matricula` (`matricula`),
  ADD KEY `profesion` (`profesion`),
  ADD KEY `especialidad` (`especialidad`);

--
-- Indices de la tabla `profesiones`
--
ALTER TABLE `profesiones`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre_usuario_unique` (`username`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `concentracion`
--
ALTER TABLE `concentracion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `especialidades`
--
ALTER TABLE `especialidades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `familias`
--
ALTER TABLE `familias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `formas_farmaceuticas`
--
ALTER TABLE `formas_farmaceuticas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `indicacion`
--
ALTER TABLE `indicacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `medicamentos`
--
ALTER TABLE `medicamentos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT de la tabla `obra_social`
--
ALTER TABLE `obra_social`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `paciente_obrasocial`
--
ALTER TABLE `paciente_obrasocial`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- AUTO_INCREMENT de la tabla `plan`
--
ALTER TABLE `plan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `prescripciones`
--
ALTER TABLE `prescripciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT de la tabla `presentaciones`
--
ALTER TABLE `presentaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `prestaciones`
--
ALTER TABLE `prestaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `prestacion_indicacion`
--
ALTER TABLE `prestacion_indicacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT de la tabla `profesionales`
--
ALTER TABLE `profesionales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `profesiones`
--
ALTER TABLE `profesiones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `especialidades`
--
ALTER TABLE `especialidades`
  ADD CONSTRAINT `especialidades_ibfk_1` FOREIGN KEY (`id_profesion`) REFERENCES `profesiones` (`id`);

--
-- Filtros para la tabla `medicamentos`
--
ALTER TABLE `medicamentos`
  ADD CONSTRAINT `medicamentos_ibfk_1` FOREIGN KEY (`familia`) REFERENCES `familias` (`id`),
  ADD CONSTRAINT `medicamentos_ibfk_2` FOREIGN KEY (`categoria`) REFERENCES `categorias` (`id`);

--
-- Filtros para la tabla `medicamentos_concentraciones`
--
ALTER TABLE `medicamentos_concentraciones`
  ADD CONSTRAINT `medicamentos_concentraciones_ibfk_1` FOREIGN KEY (`id_medicamento`) REFERENCES `medicamentos` (`id`),
  ADD CONSTRAINT `medicamentos_concentraciones_ibfk_2` FOREIGN KEY (`id_concentracion`) REFERENCES `concentracion` (`id`);

--
-- Filtros para la tabla `medicamentos_formasf`
--
ALTER TABLE `medicamentos_formasf`
  ADD CONSTRAINT `medicamentos_formasf_ibfk_1` FOREIGN KEY (`id_medicamento`) REFERENCES `medicamentos` (`id`),
  ADD CONSTRAINT `medicamentos_formasf_ibfk_2` FOREIGN KEY (`id_formasf`) REFERENCES `formas_farmaceuticas` (`id`);

--
-- Filtros para la tabla `medicamentos_presentaciones`
--
ALTER TABLE `medicamentos_presentaciones`
  ADD CONSTRAINT `medicamentos_presentaciones_ibfk_1` FOREIGN KEY (`id_medicamento`) REFERENCES `medicamentos` (`id`),
  ADD CONSTRAINT `medicamentos_presentaciones_ibfk_2` FOREIGN KEY (`id_presentacion`) REFERENCES `presentaciones` (`id`);

--
-- Filtros para la tabla `paciente_obrasocial`
--
ALTER TABLE `paciente_obrasocial`
  ADD CONSTRAINT `paciente_obrasocial_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id`),
  ADD CONSTRAINT `paciente_obrasocial_ibfk_2` FOREIGN KEY (`id_obrasocial`) REFERENCES `obra_social` (`id`),
  ADD CONSTRAINT `paciente_obrasocial_ibfk_3` FOREIGN KEY (`plan`) REFERENCES `plan` (`id`);

--
-- Filtros para la tabla `plan`
--
ALTER TABLE `plan`
  ADD CONSTRAINT `plan_ibfk_1` FOREIGN KEY (`id_obrasocial`) REFERENCES `obra_social` (`id`);

--
-- Filtros para la tabla `prescripciones`
--
ALTER TABLE `prescripciones`
  ADD CONSTRAINT `prescripciones_ibfk_1` FOREIGN KEY (`id_profesional`) REFERENCES `profesionales` (`id`),
  ADD CONSTRAINT `prescripciones_ibfk_2` FOREIGN KEY (`paciente_datos`) REFERENCES `paciente_obrasocial` (`id`);

--
-- Filtros para la tabla `prescripcion_medicamento`
--
ALTER TABLE `prescripcion_medicamento`
  ADD CONSTRAINT `prescripcion_medicamento_ibfk_1` FOREIGN KEY (`id_medicamento`) REFERENCES `medicamentos` (`id`),
  ADD CONSTRAINT `prescripcion_medicamento_ibfk_2` FOREIGN KEY (`id_prescripcion`) REFERENCES `prescripciones` (`id`),
  ADD CONSTRAINT `prescripcion_medicamento_ibfk_3` FOREIGN KEY (`id_formaf`) REFERENCES `formas_farmaceuticas` (`id`),
  ADD CONSTRAINT `prescripcion_medicamento_ibfk_4` FOREIGN KEY (`id_concentracion`) REFERENCES `concentracion` (`id`),
  ADD CONSTRAINT `prescripcion_medicamento_ibfk_5` FOREIGN KEY (`id_presentacion`) REFERENCES `presentaciones` (`id`);

--
-- Filtros para la tabla `prescripcion_prestacion`
--
ALTER TABLE `prescripcion_prestacion`
  ADD CONSTRAINT `prescripcion_prestacion_ibfk_1` FOREIGN KEY (`id_prescripcion`) REFERENCES `prescripciones` (`id`),
  ADD CONSTRAINT `prescripcion_prestacion_ibfk_2` FOREIGN KEY (`id_datosprestacion`) REFERENCES `prestacion_indicacion` (`id`);

--
-- Filtros para la tabla `prestacion_indicacion`
--
ALTER TABLE `prestacion_indicacion`
  ADD CONSTRAINT `prestacion_indicacion_ibfk_1` FOREIGN KEY (`id_indicacion`) REFERENCES `indicacion` (`id`),
  ADD CONSTRAINT `prestacion_indicacion_ibfk_2` FOREIGN KEY (`id_prestacion`) REFERENCES `prestaciones` (`id`);

--
-- Filtros para la tabla `profesionales`
--
ALTER TABLE `profesionales`
  ADD CONSTRAINT `profesionales_ibfk_1` FOREIGN KEY (`profesion`) REFERENCES `profesiones` (`id`),
  ADD CONSTRAINT `profesionales_ibfk_2` FOREIGN KEY (`especialidad`) REFERENCES `especialidades` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
