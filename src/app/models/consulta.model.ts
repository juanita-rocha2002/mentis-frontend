export interface NotaEvolucion {
  id?: number;
  fechaRegistro?: string;
  profesionalNombre?: string;
  contenido: string;
}

export interface DatosFormularioExtendidos {
  // Identificación
  escolaridad?: 'Sin Escolaridad' | 'Primaria' | 'Secundaria / Bachillerato' | 'Técnico / Tecnológico' | 'Universitario' | 'Posgrado';
  
  // Historia y Antecedentes
  enfermedadProblemaActual?: string;
  historiaPersonal?: string;
  historiaFamiliar?: string;
  antecedentesSaludMental?: string;
  antecedentesMedicosFarmaco?: string;
  
  // Áreas de Funcionamiento
  areaSocialAcademicaLaboral?: string;
  areaAfectivaPareja?: string;
  consumoSustancias?: 'No reporta' | 'Ocasional' | 'Frecuente / Problemático' | 'En remisión';
  
  // Riesgo y Diagnóstico
  evaluacionRiesgoNivel?: 'Sin riesgo apreciable' | 'Bajo' | 'Moderado' | 'Alto' | 'Inminente';
  evaluacionRiesgoDetalle?: string;
  medidasAdoptadas?: string;
  diagnosticoDiferencial?: string;
  
  // Plan e Intervención
  objetivosTerapeuticos?: string;
  enfoquePlanIntervencion?: string;
  requiereRemision?: 'No' | 'Sí - Psiquiatría' | 'Sí - Medicina General' | 'Sí - Trabajo Social' | 'Sí - Otra Especialidad';
  detalleRemision?: string;

  // Campos previos existentes
  [key: string]: any;
}

export interface Consulta {
  id?: number;
  profesionalNombre: string;
  profesionalRegistro: string;
  usuarioNombre: string;
  usuarioDocumentoTipo: string;
  usuarioDocumentoNumero: string;
  fechaAtencion: string;
  horaInicio: string;
  horaFin: string;
  datosFormulario: DatosFormularioExtendidos;
  evoluciones: NotaEvolucion[];
  firmaProfesional?: string;
  fechaRegistro?: string;
  ultimaActualizacion?: string;
}

export interface HistoriaClinicaPaciente {
  usuarioDocumentoTipo: string;
  usuarioDocumentoNumero: string;
  usuarioNombre: string;
  totalAtenciones: number;
  atenciones: Consulta[];
}