import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Consulta, HistoriaClinicaPaciente } from '../models/consulta.model';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {

  private apiUrl = 'http://localhost:8080/api/v1/consultas';

  constructor(private http: HttpClient) {}

  // 1. Guardar la atención clínica inicial
  guardarConsulta(consulta: Consulta): Observable<Consulta> {
    return this.http.post<Consulta>(this.apiUrl, consulta);
  }

  // 2. Buscar coincidencias en tiempo real por nombre o documento
  buscarSugerencias(query: string): Observable<Consulta[]> {
    return this.http.get<Consulta[]>(`${this.apiUrl}/buscar?q=${query}`);
  }

  // 3. Obtener la historia clínica consolidada del paciente
  obtenerHistoriaClinica(tipoDoc: string, numDoc: string): Observable<HistoriaClinicaPaciente> {
    return this.http.get<HistoriaClinicaPaciente>(
      `${this.apiUrl}/historia-clinica?tipoDoc=${tipoDoc}&numDoc=${numDoc}`
    );
  }

  // 4. Agregar nota de manejo enviando profesional + notaManejo
  agregarNotaManejo(idConsulta: number, profesional: string, contenidoNota: string): Observable<Consulta> {
    return this.http.patch<Consulta>(`${this.apiUrl}/${idConsulta}/nota-manejo`, {
      profesional: profesional,
      notaManejo: contenidoNota
    });
  }
}