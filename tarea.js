export class Tarea {
    titulo;
    descripcion;
    estado;
    creacion;
    ultimaedicion;
    vencimiento;
    dificultad;
    constructor(titulo, descripcion = "", estado = "PENDING", vencimiento = null, dificultad = 1, creacion = new Date().toISOString(), ultimaedicion = null) {
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.estado = estado;
        this.creacion = creacion;
        this.vencimiento = vencimiento;
        this.dificultad = dificultad;
        this.ultimaedicion = ultimaedicion;
    }
    obtenerDificultadVisual() {
        switch (this.dificultad) {
            case 1: return "⭐ (Fácil)";
            case 2: return "⭐⭐ (Medio)";
            case 3: return "⭐⭐⭐ (Difícil)";
            default: return "⭐ (Fácil)";
        }
    }
    cambiarEstado(nuevoEstado) {
        const estadosValidos = ["PENDING", "IN-PROGRESS", "FINISHED", "CANCELED"];
        if (estadosValidos.includes(nuevoEstado)) {
            this.estado = nuevoEstado;
            this.ultimaedicion = new Date().toISOString(); // Registramos la última edición
            console.log(`¡Estado actualizado a: ${this.estado}!`);
        }
        else {
            console.log("Error: Estado no válido.");
        }
    }
}
//# sourceMappingURL=tarea.js.map