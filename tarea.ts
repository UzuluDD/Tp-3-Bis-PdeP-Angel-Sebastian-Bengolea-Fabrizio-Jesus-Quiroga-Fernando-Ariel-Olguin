export class Tarea {
    titulo: string;
    descripcion: string;
    estado: "PENDING" | "IN-PROGRESS" | "FINISHED" | "CANCELED";
    creacion: string;
    ultimaedicion: string | null; 
    vencimiento: string | null;
    dificultad: number;

    constructor(
        titulo: string, 
        descripcion: string = "", 
        estado: "PENDING" | "IN-PROGRESS" | "FINISHED" | "CANCELED" = "PENDING",
        vencimiento: string | null = null,
        dificultad: number = 1,
        creacion: string = new Date().toISOString(),
        ultimaedicion: string | null = null
    ) {
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.estado = estado;
        this.creacion = creacion;
        this.vencimiento = vencimiento;
        this.dificultad = dificultad;
        this.ultimaedicion = ultimaedicion;
    }

    obtenerDificultadVisual(): string {
        switch (this.dificultad) {
            case 1: return "⭐ (Fácil)";
            case 2: return "⭐⭐ (Medio)";
            case 3: return "⭐⭐⭐ (Difícil)";
            default: return "⭐ (Fácil)";
        }
    }

    cambiarEstado(nuevoEstado: "PENDING" | "IN-PROGRESS" | "FINISHED" | "CANCELED") {
        const estadosValidos = ["PENDING", "IN-PROGRESS", "FINISHED", "CANCELED"];
        if (estadosValidos.includes(nuevoEstado)) {
            this.estado = nuevoEstado;
            this.ultimaedicion = new Date().toISOString(); // Registramos la última edición
            console.log(`¡Estado actualizado a: ${this.estado}!`);
        } else {
            console.log("Error: Estado no válido.");
        }
    }
}