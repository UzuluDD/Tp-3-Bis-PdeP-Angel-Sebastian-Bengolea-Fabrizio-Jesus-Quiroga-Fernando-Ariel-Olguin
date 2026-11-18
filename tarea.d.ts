export declare class Tarea {
    titulo: string;
    descripcion: string;
    estado: "PENDING" | "IN-PROGRESS" | "FINISHED" | "CANCELED";
    creacion: string;
    ultimaedicion: string | null;
    vencimiento: string | null;
    dificultad: number;
    constructor(titulo: string, descripcion?: string, estado?: "PENDING" | "IN-PROGRESS" | "FINISHED" | "CANCELED", vencimiento?: string | null, dificultad?: number, creacion?: string, ultimaedicion?: string | null);
    obtenerDificultadVisual(): string;
    cambiarEstado(nuevoEstado: "PENDING" | "IN-PROGRESS" | "FINISHED" | "CANCELED"): void;
}
//# sourceMappingURL=tarea.d.ts.map