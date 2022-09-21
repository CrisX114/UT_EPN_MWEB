import { DataService } from './data.service';
import { Justification, status } from '../../models/justification.interface';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Data } from '../../models/data.interface';

@Injectable({ providedIn: 'root' })
export class JustificationService {
  //observable en donde estarán las justificaciones obtenidos por CloudFirestore
  //se almacenarán todas las justificaciones (para el rol Administrador)
  justification$: Observable<Justification[]>;
  //observable en donde estarán los datos obtenidos por CloudFirestore
  //se almacenarán las justificaciones de un determinado usuario (para el rol Empleado)
  justificationById$: Observable<Justification[]>;

  //se crea un objeto para gestionar el acceso al Cloud Firestore
  private justificationsCollection: AngularFirestoreCollection<Justification>;
  //se crea un objeto para gestionar el acceso al Cloud Firestore
  //se realizará una consulta de justificaciones en base al id de usuario
  private justificationsCollectionById: AngularFirestoreCollection<Justification>;

  //Constructor: se declara el servicio AngularFirestore para acceder a las características de
  //Cloud Firestore y el servicio Data para actualizar la informacion de registros
  constructor(
    private readonly afs: AngularFirestore,
    private dataSvc: DataService
  ) {
    this.justificationsCollection = this.afs.collection<Justification>(
      'justificaciones',
      (ref) => ref.orderBy('fecha', 'desc')
    );
  }

  //función para editar el campo "horaJustificada"
  editJustification(
    just: Justification,
    justId: string,
    state: status,
    horaE: String
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const id = justId;
        const status = state;
        just.status = state;
        const data = { id, ...just, horaJustificada: horaE + ':00' };
        const result = this.justificationsCollection.doc(id).set(data);
        resolve(result);
      } catch (error) {
        reject(error.message);
      }
    });
  }
  //función para crear una nueva justificación.
  onSaveJustification(
    justificacion: Justification,
    dataEdit: Data
  ): Promise<void> {
    console.log(justificacion);
    return new Promise(async (resolve, reject) => {
      try {
        const id = this.afs.createId() + justificacion.tipo;
        const { usuario } = dataEdit;
        const dataJustific = { id, ...justificacion, usuario };
        const result = this.justificationsCollection.doc(id).set(dataJustific);
        this.dataSvc.onEditDataJust(dataEdit, id);
        resolve(result);
      } catch (error) {
        reject(error.message);
      }
    });
  }
  //en el caso de que se de click en el botón "Aceptar" su status será a ACEPTADO
  onAccept(item: Justification, horaE: String, flag: boolean): void {
    try {
      const justificationId = item?.id || null;
      this.editJustification(item, justificationId, 'ACEPTADO', horaE);
      if (horaE != '') {
        if (flag) {
          const data = {
            id: item.idRegistro,
            horasExtra: horaE + ':00',
          };
          this.dataSvc.onUpdateDataJust(data);
        }
      }
    } catch (error) {}
  }
  //en el caso de que se de click en el botón "Rechazar" su status será a RECHAZADO
  onReject(item: Justification): void {
    try {
      if (item.tipo == 'FALTA') {
        const data = {
          id: item.idRegistro,
          horasTrabajadas: '00:00:00',
        };
        this.dataSvc.onUpdateDataJust(data);
      }
      if (item.tipo == 'HORAS_EXTRA') {
        const data = {
          id: item.idRegistro,
          horasExtra: '00:00:00',
        };
        this.dataSvc.onUpdateDataJust(data);
      }
      const justificationId = item?.id || null;
      this.editJustification(item, justificationId, 'RECHAZADO', '0:00');
    } catch (error) {}
  }
  //función para obtener todos los campos de la colección "justificaciones"
  getJustifications(): void {
    //se define el nombre de la colección que se leerá en el Cloud Firestore

    this.justification$ = this.justificationsCollection
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => a.payload.doc.data() as Justification)
        )
      );
  }
  //Se obtienen los documentos que coincidan con el argumento "userId"
  getJustId(userId: string): void {
    this.justificationsCollectionById = this.afs.collection<Justification>(
      'justificaciones',
      (ref) => ref.where('idUsuario', '==', userId)
    );
    //Se obtienen todos los usuarios
    this.justificationById$ = this.justificationsCollectionById
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => a.payload.doc.data() as Justification)
        )
      );
  }
}
