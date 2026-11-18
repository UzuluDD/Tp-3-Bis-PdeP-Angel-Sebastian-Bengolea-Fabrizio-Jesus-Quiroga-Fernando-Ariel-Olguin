import promptSync from 'prompt-sync';
import { Tarea } from './tarea.js';
import * as fs from 'fs';
const prompt = promptSync();

function pausar() {
    prompt("Presiona cualquier tecla para continuar...");
}

function parsearEstado(letra: string): "PENDING" | "IN-PROGRESS" | "FINISHED" | "CANCELED" | "" {
    const l = letra.trim().toUpperCase();
    if (l === 'P') return 'PENDING';
    if (l === 'E') return 'IN-PROGRESS';
    if (l === 'T' || l === 'F') return 'FINISHED';
    if (l === 'C') return 'CANCELED';
    return '';
}

function esFechaValida(fechaStr: string): boolean {
    const partes = fechaStr.split("/");

    // Debe tener exactamente 3 partes: día, mes y año
    if (partes.length !== 3) return false;

    // Evitar partes vacías o con espacios (ej: "10//2026")
    if (partes.some(p => p.trim() === "")) return false;

    const dia = Number(partes[0]);
    const mes = Number(partes[1]);
    const anio = Number(partes[2]);

    // Verificar que sean números válidos y el año tenga 4 dígitos
    if (isNaN(dia) || isNaN(mes) || isNaN(anio)) return false;
    if (anio < 1000 || anio > 9999) return false;

    // Verificar que la fecha exista realmente en el calendario
    const fecha = new Date(anio, mes - 1, dia);
    const existeEnCalendario =
        fecha.getFullYear() === anio &&
        fecha.getMonth() === mes - 1 &&
        fecha.getDate() === dia;

    return existeEnCalendario;
}

const ARCHIVO_TAREAS = 'tareas.json';

function cargarTareas(): Tarea[] {
    try {
        if (!fs.existsSync(ARCHIVO_TAREAS)) return [];
        const contenido = fs.readFileSync(ARCHIVO_TAREAS, 'utf-8');
        const datosCrudos = JSON.parse(contenido);

        return datosCrudos.map((t: any) => new Tarea(
            t.titulo,
            t.descripcion,
            t.estado,
            t.vencimiento,
            t.dificultad,
            t.creacion,
            t.ultimaedicion
        ));
    } catch (error) {
        console.error("Error al cargar el archivo:", error);
        return [];
    }
}

function guardarTareas(tareas: Tarea[]) {
    try {
        fs.writeFileSync(ARCHIVO_TAREAS, JSON.stringify(tareas, null, 2), 'utf-8');
    } catch (error) {
        console.error("Error al guardar el archivo:", error);
    }
}

const misTareas: Tarea[] = cargarTareas();
console.log(`\n[Sistema] Se han cargado correctamente ${misTareas.length} tareas desde el archivo.`);

function main() {
    console.log("¡Hola Olivia!");

    while (true) {
        console.log("\n¿Qué deseas hacer?\n");
        console.log("[1] Ver Mis Tareas.");
        console.log("[2] Buscar una Tarea.");
        console.log("[3] Agregar una Tarea.");
        console.log("[0] Salir.");
        
        let opcion = prompt("> ");

        if (opcion === "0") {
            console.log("¡Hasta luego!");
            break;
        }

        switch (opcion) {
            case "1": {
                while (true) {
                    console.log("\n¿Qué tareas deseas ver?");
                    console.log("[1] Todas");
                    console.log("[2] Pendientes");
                    console.log("[3] En curso");
                    console.log("[4] Terminadas");
                    console.log("[5] Canceladas");
                    console.log("[0] Volver");

                    let subOpcion = prompt("> ");
                    if (subOpcion === "0") break;

                    let tareasFiltradas: Tarea[] = [];
                    if (subOpcion === "1") {
                        tareasFiltradas = misTareas;
                    } else if (subOpcion === "2") {
                        tareasFiltradas = misTareas.filter(t => t.estado === "PENDING");
                    } else if (subOpcion === "3") {
                        tareasFiltradas = misTareas.filter(t => t.estado === "IN-PROGRESS");
                    } else if (subOpcion === "4") {
                        tareasFiltradas = misTareas.filter(t => t.estado === "FINISHED");
                    } else if (subOpcion === "5") {
                        tareasFiltradas = misTareas.filter(t => t.estado === "CANCELED");
                    } else {
                        console.log("Opción inválida.");
                        continue;
                    }

                    if (tareasFiltradas.length === 0) {
                        console.log("\nNo hay tareas en esta categoría.");
                        pausar();
                        break;
                    }

                    console.log("\nEstas son todas tus tareas.");
                    tareasFiltradas.forEach((t, idx) => {
                        console.log(`[${idx + 1}] ${t.titulo}`);
                    });

                    console.log("\n¿Deseas ver los detalles de alguna?");
                    let seleccion = Number(prompt("Introduce el número para verla o 0 para volver: "));

                    if (seleccion === 0 || isNaN(seleccion)) break;

                    let indexReal = seleccion - 1;
                    if (indexReal >= 0 && indexReal < tareasFiltradas.length) {
                        let tareaSeleccionada: Tarea = tareasFiltradas[indexReal]!;

                        while (true) {
                            console.log("\nEsta es la tarea que elegiste.\n");
                            console.log(`${tareaSeleccionada.titulo}\n`);
                            console.log(`${tareaSeleccionada.descripcion}\n`);
                            console.log(`Estado:      ${tareaSeleccionada.estado}`);
                            console.log(`Dificultad:  ${tareaSeleccionada.obtenerDificultadVisual()}`);
                            console.log(`Vencimiento: ${tareaSeleccionada.vencimiento ? tareaSeleccionada.vencimiento : "Sin vencimiento"}`);
                            console.log(`Creación:    ${tareaSeleccionada.creacion}\n`);

                            console.log("Si deseas editarla, presiona E, o presiona 0 para volver.");
                            let accion = prompt("> ").trim();

                            if (accion === "0") {
                                break;
                            } else if (accion.toUpperCase() === "E") {
                                console.log(`\nEstás editando la tarea ${tareaSeleccionada.titulo}.`);
                                console.log("- Si deseas mantener los valores de un atributo, simplemente déjalo en blanco.");
                                console.log("- Si deseas dejar en blanco un atributo, escribe un espacio.\n");

                                let nuevaDesc = prompt("1. Ingresa la descripción: ");
                                if (nuevaDesc !== "") {
                                    tareaSeleccionada.descripcion = nuevaDesc === " " ? "" : nuevaDesc;
                                }

                                let nuevoEstInput = prompt("2. Estado ([P]endiente / [E]n curso / [T]erminada / [C]ancelada): ");
                                if (nuevoEstInput.trim() !== "") {
                                    let estParseado = parsearEstado(nuevoEstInput);
                                    if (estParseado) {
                                        tareaSeleccionada.cambiarEstado(estParseado);
                                    }
                                }

                                let nuevaDifInput = prompt("3. Dificultad ([1] / [2] / [3]): ");
                                if (nuevaDifInput.trim() !== "") {
                                    let difNum = Number(nuevaDifInput);
                                    if (!isNaN(difNum)) {
                                        tareaSeleccionada.dificultad = difNum;
                                    }
                                }

                                while (true) {
                                    let nuevoVenc = prompt("4. Vencimiento (DD/MM/AAAA): ");
                                    if (nuevoVenc === "") {
                                        break;
                                    } else if (nuevoVenc === " ") {
                                        tareaSeleccionada.vencimiento = null;
                                        break;
                                    } else if (esFechaValida(nuevoVenc.trim())) {
                                        tareaSeleccionada.vencimiento = nuevoVenc.trim();
                                        break;
                                    } else {
                                        console.log("¡Error! Fecha inválida o inexistente. Usa el formato DD/MM/AAAA (ej: 25/11/2026).");
                                    }
                                }

                                guardarTareas(misTareas);
                                console.log("\n¡Datos guardados!");
                                pausar();
                                break;
                            }
                        }
                    } else {
                        console.log("Número inválido.");
                        pausar();
                    }
                }
                break;
            }

            case "2": {
                console.log("\nIntroduce el título de una Tarea para buscarla:");
                let busqueda = prompt("> ").toLowerCase().trim();

                let resultados: Tarea[] = misTareas.filter(t => t.titulo.toLowerCase().includes(busqueda));

                if (resultados.length === 0) {
                    console.log("\nNo hay tareas relacionadas con la búsqueda.");
                    pausar();
                } else {
                    console.log("\nEstas son las tareas relacionadas:");
                    resultados.forEach((t, idx) => {
                        console.log(`[${idx + 1}] ${t.titulo}`);
                    });

                    console.log("\n¿Deseas ver los detalles de alguna?");
                    let seleccion = Number(prompt("Introduce el número para verla o 0 para volver: "));

                    if (seleccion !== 0 && !isNaN(seleccion)) {
                        let indexReal = seleccion - 1;
                        if (indexReal >= 0 && indexReal < resultados.length) {
                            let tareaEncontrada: Tarea = resultados[indexReal]!;

                            while (true) {
                                console.log("\nEsta es la tarea que elegiste.\n");
                                console.log(`${tareaEncontrada.titulo}\n`);
                                console.log(`${tareaEncontrada.descripcion}\n`);
                                console.log(`Estado:      ${tareaEncontrada.estado}`);
                                console.log(`Dificultad:  ${tareaEncontrada.obtenerDificultadVisual()}`);
                                console.log(`Vencimiento: ${tareaEncontrada.vencimiento ? tareaEncontrada.vencimiento : "Sin vencimiento"}`);
                                console.log(`Creación:    ${tareaEncontrada.creacion}\n`);

                                console.log("Si deseas editarla, presiona E, o presiona 0 para volver.");
                                let accion = prompt("> ").trim();

                                if (accion === "0") {
                                    break;
                                } else if (accion.toUpperCase() === "E") {
                                    console.log(`\nEstás editando la tarea ${tareaEncontrada.titulo}.`);
                                    console.log("- Si deseas mantener los valores de un atributo, simplemente déjalo en blanco.");
                                    console.log("- Si deseas dejar en blanco un atributo, escribe un espacio.\n");

                                    let nuevaDesc = prompt("1. Ingresa la descripción: ");
                                    if (nuevaDesc !== "") {
                                        tareaEncontrada.descripcion = nuevaDesc === " " ? "" : nuevaDesc;
                                    }

                                    let nuevoEstInput = prompt("2. Estado ([P]endiente / [E]n curso / [T]erminada / [C]ancelada): ");
                                    if (nuevoEstInput.trim() !== "") {
                                        let estParseado = parsearEstado(nuevoEstInput);
                                        if (estParseado) {
                                            tareaEncontrada.cambiarEstado(estParseado);
                                        }
                                    }

                                    let nuevaDifInput = prompt("3. Dificultad ([1] / [2] / [3]): ");
                                    if (nuevaDifInput.trim() !== "") {
                                        let difNum = Number(nuevaDifInput);
                                        if (!isNaN(difNum)) {
                                            tareaEncontrada.dificultad = difNum;
                                        }
                                    }

                                    while (true) {
                                        let nuevoVenc = prompt("4. Vencimiento (DD/MM/AAAA): ");
                                        if (nuevoVenc === "") {
                                            break;
                                        } else if (nuevoVenc === " ") {
                                            tareaEncontrada.vencimiento = null;
                                            break;
                                        } else if (esFechaValida(nuevoVenc.trim())) {
                                            tareaEncontrada.vencimiento = nuevoVenc.trim();
                                            break;
                                        } else {
                                            console.log("¡Error! Fecha inválida o inexistente. Usa el formato DD/MM/AAAA (ej: 25/11/2026).");
                                        }
                                    }

                                    guardarTareas(misTareas);
                                    console.log("\n¡Datos guardados!");
                                    pausar();
                                    break;
                                }
                            }
                        }
                    }
                }
                break;
            }

            case "3": {
                console.log("\nEstás creando una nueva tarea.\n");

                // Validación simple de campo obligatorio (Título)
                let titulo = prompt("1. Ingresa el Título (Obligatorio): ").trim();
                while (titulo === "") {
                    console.log("¡Error! El título es obligatorio.");
                    titulo = prompt("1. Ingresa el Título (Obligatorio): ").trim();
                }

                let descripcion = prompt("2. Ingresa la descripción: ");
                let estadoInput = prompt("3. Estado ([P]endiente / [E]n curso / [T]erminada / [C]ancelada): ");
                
                // Dificultad con validación numérica básica
                let dificultadInput = Number(prompt("4. Dificultad ([1] / [2] / [3]): "));
                let dificultadFinal = isNaN(dificultadInput) ? 1 : dificultadInput;

                // Vencimiento con validación de formato y fecha real
                let vencimientoFinal: string | null = null;
                while (true) {
                    let vencimientoInput = prompt("5. Vencimiento (DD/MM/AAAA o Enter para dejar sin vencimiento): ").trim();
                    if (vencimientoInput === "") {
                        vencimientoFinal = null;
                        break;
                    }
                    if (esFechaValida(vencimientoInput)) {
                        vencimientoFinal = vencimientoInput;
                        break;
                    }
                    console.log("¡Error! Fecha inválida o inexistente. Usa el formato DD/MM/AAAA (ej: 25/11/2026).");
                }

                let estadoFinal = parsearEstado(estadoInput) || "PENDING";

                const nuevaTarea = new Tarea(
                    titulo, 
                    descripcion, 
                    estadoFinal, 
                    vencimientoFinal, 
                    dificultadFinal
                );

                misTareas.push(nuevaTarea);
                guardarTareas(misTareas);
                console.log("\n¡Datos guardados!");
                pausar();
                break;
            }

            default: {
                console.log("Opción inválida.");
                break;
            }
        }
    }
}

main();