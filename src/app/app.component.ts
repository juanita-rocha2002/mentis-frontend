import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Consulta, HistoriaClinicaPaciente } from './models/consulta.model';
import { ConsultaService } from './services/consulta.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // Control de interfaz
  tabActiva: 'registro' | 'buscador' = 'registro';
  
  // Buscador e Historia Clínica
  terminoBusqueda: string = '';
  sugerencias: Consulta[] = [];
  historia?: HistoriaClinicaPaciente;

  // Mapa para gestionar el texto de la nueva nota individual de cada atención
  textoNuevaNotaMap: { [consultaId: number]: string } = {};

  // Campo temporal para la primera nota de manejo al crear el registro inicial
  primeraNotaManejo: string = '';

  // Objeto modelo para el formulario de registro inicial
  consulta: Consulta = {
    profesionalNombre: '',
    profesionalRegistro: '',
    usuarioNombre: '',
    usuarioDocumentoTipo: 'CC',
    usuarioDocumentoNumero: '',
    fechaAtencion: new Date().toISOString().split('T')[0],
    horaInicio: '08:00:00', // Formato HH:mm:ss requerido por LocalTime de Java
    horaFin: '09:00:00',    // Formato HH:mm:ss requerido por LocalTime de Java
    evoluciones: [],
    firmaProfesional: '',
    datosFormulario: {
      plataforma: 'Zoom',
      verificacionIdentidad: true,
      privacidadEntorno: true
    }
  };

  constructor(private consultaService: ConsultaService) {}

  // ==========================================
  // REGISTRO DE ATENCIÓN INICIAL
  // ==========================================
  guardar(): void {
    if (!this.primeraNotaManejo.trim()) {
      alert('Debe ingresar la Nota de Manejo Inicial para guardar la atención.');
      return;
    }

    // Normalizar las horas al formato HH:mm:ss antes de enviar a Spring Boot
    const payloadConsulta: Consulta = {
      ...this.consulta,
      horaInicio: this.asegurarFormatoHora(this.consulta.horaInicio),
      horaFin: this.asegurarFormatoHora(this.consulta.horaFin),
      evoluciones: [
        {
          fechaRegistro: new Date().toISOString(),
          profesionalNombre: this.consulta.profesionalNombre || 'Profesional Registrado',
          contenido: this.primeraNotaManejo.trim()
        }
      ]
    };

    this.consultaService.guardarConsulta(payloadConsulta).subscribe({
      next: (res) => {
        alert(`Atención registrada con éxito. Registro clínico ID: ${res.id}`);
        this.resetFormulario();
      },
      error: (err) => {
        console.error('Error al guardar la consulta:', err);
        alert('Ocurrió un error al guardar la consulta clínica. Revisa la consola del navegador.');
      }
    });
  }

  // ==========================================
  // BUSCADOR Y SELECCIÓN DE PACIENTE
  // ==========================================
  buscarCoincidencias(): void {
    if (this.terminoBusqueda.trim().length < 3) {
      this.sugerencias = [];
      return;
    }

    this.consultaService.buscarSugerencias(this.terminoBusqueda.trim()).subscribe({
      next: (data) => this.sugerencias = data,
      error: (err) => console.error('Error en búsqueda de sugerencias:', err)
    });
  }

  seleccionarPaciente(paciente: Consulta): void {
    this.sugerencias = [];
    this.terminoBusqueda = `${paciente.usuarioNombre} (${paciente.usuarioDocumentoNumero})`;

    this.cargarHistoriaClinica(paciente.usuarioDocumentoTipo, paciente.usuarioDocumentoNumero);
  }

  private cargarHistoriaClinica(tipoDoc: string, numDoc: string): void {
    this.consultaService.obtenerHistoriaClinica(tipoDoc, numDoc).subscribe({
      next: (data) => {
        this.historia = data;
        this.textoNuevaNotaMap = {};
      },
      error: (err) => {
        console.error('Error al obtener historia clínica:', err);
        alert('No se pudo cargar la historia clínica del paciente.');
      }
    });
  }

  // ==========================================
  // ANEXAR NUEVA EVOLUCIÓN CON FECHA ACTUAL
  // ==========================================
  agregarEvolucion(idConsulta: number): void {
    const textoNota = this.textoNuevaNotaMap[idConsulta];

    if (!textoNota || !textoNota.trim()) {
      alert('Por favor ingrese el contenido de la nueva evolución clínica.');
      return;
    }

    // Se obtiene el nombre del profesional desde la consulta activa o la historia cargada
    const profesional = this.consulta.profesionalNombre.trim() || 'Profesional Tratante';

    this.consultaService.agregarNotaManejo(idConsulta, profesional, textoNota.trim()).subscribe({
      next: () => {
        alert('Nueva nota de manejo guardada exitosamente.');
        this.textoNuevaNotaMap[idConsulta] = '';
        
        if (this.historia) {
          this.cargarHistoriaClinica(
            this.historia.usuarioDocumentoTipo, 
            this.historia.usuarioDocumentoNumero
          );
        }
      },
      error: (err) => {
        console.error('Error al agregar la evolución:', err);
        alert('No se pudo guardar la nueva nota de manejo.');
      }
    });
  }

  // ==========================================
  // MÉTODOS AUXILIARES
  // ==========================================
  private asegurarFormatoHora(hora: string): string {
    if (!hora) return '08:00:00';
    return hora.length === 5 ? `${hora}:00` : hora;
  }

  private resetFormulario(): void {
  this.primeraNotaManejo = '';
  this.consulta = {
    profesionalNombre: this.consulta.profesionalNombre,
    profesionalRegistro: this.consulta.profesionalRegistro,
    usuarioNombre: '',
    usuarioDocumentoTipo: 'CC',
    usuarioDocumentoNumero: '',
    fechaAtencion: new Date().toISOString().split('T')[0],
    horaInicio: '08:00',
    horaFin: '09:00',
    evoluciones: [],
    firmaProfesional: '',
    datosFormulario: {
      escolaridad: 'Universitario',
      consumoSustancias: 'No reporta',
      evaluacionRiesgoNivel: 'Sin riesgo apreciable',
      requiereRemision: 'No',
      plataforma: 'Zoom',
      verificacionIdentidad: true,
      privacidadEntorno: true
    }
  };
}
}