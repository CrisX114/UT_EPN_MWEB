import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Data } from '../../models/data.interface';

@Injectable({ providedIn: 'root' })
export class DataService {
  //observable en donde estarán los datos obtenidos por CloudFirestore
  //Se almacenarán todos los registros de usuarios (para rol Administrador)
  data$: Observable<Data[]> = null;
  //observable en donde estarán los datos obtenidos por CloudFirestore
  //Se almacenarán los registros del usuario autorizado (para rol Empleado)
  dataById$: Observable<Data[]> = null;

  //se crea un objeto para gestionar el acceso al Cloud Firestore
  private datasCollection: AngularFirestoreCollection<Data>;
  //se crea un objeto para gestionar el acceso al Cloud Firestore
  //se realizará una consulta de registros en base al id de usuario
  private datasCollectionById: AngularFirestoreCollection<Data>;

  //Constructor: se declara el servicio AngularFirestore para acceder a
  //las caracteristicas de Cloud Firestore
  constructor(private readonly afs: AngularFirestore) {
    //se define el nombre de la colección que se leerá en el Cloud Firestore
    //se aplica un filtro de orden por fecha
    this.datasCollection = this.afs.collection<Data>('registros', (ref) =>
      ref.orderBy('hora', 'desc')
    );
  }
  updateData(edit: any, user: any): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const id = edit.id;
        const data = { id, horario: user.horasDeTrabajo };
        const result = this.datasCollection.doc(edit.id).update(data);
        resolve(result);
      } catch (error) {
        reject(error.message);
      }
    });
  }

  //funcion que editará el campo justificaciones del registro cuando se crea una justificación
  onEditDataJust(edit: Data, idJust: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const id = edit.id;
        const data = { id, ...edit };
        if (!edit.justificaciones) {
          edit.justificaciones = [];
        }
        edit.justificaciones.push(idJust);
        const result = this.datasCollection.doc(id).set(data);
        const result2 = this.datasCollection.doc(id).update({
          justificaciones: edit.justificaciones,
        });

        resolve(result);
      } catch (error) {
        reject(error.message);
      }
    });
  }
  //funcion que editará el campo horasExtra y HorasTrabajadas del registro cuando se acepte
  // o se rechace una justificación
  onUpdateDataJust(edit: any): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const id = edit.id;
        const data = { id, ...edit };
        const result = this.datasCollection.doc(edit.id).update(data);
        resolve(result);
      } catch (error) {
        reject(error.message);
      }
    });
  }
  //función para obtener todos los campos de la colección "registros"
  getDatas(): void {
    //se obtiene el observable de data
    this.data$ = this.datasCollection
      .snapshotChanges()
      .pipe(map((actions) => actions.map((a) => a.payload.doc.data() as Data)));
  }
  //Se obtienen los documentos que coincidan con el argumento "userId" de la colección "registros"
  getDataId(userId: string): void {
    this.datasCollectionById = this.afs.collection<Data>('registros', (ref) => {
      return ref.orderBy('hora', 'desc').where('idUsuario', '==', userId);
    });
    //Se obtienen todos los usuarios
    this.dataById$ = this.datasCollectionById
      .snapshotChanges()
      .pipe(map((actions) => actions.map((a) => a.payload.doc.data() as Data)));
  }
  //Obtiene el registro de una justificacion
  getDataJustification(idRegistro: string): void {
    this.datasCollectionById = this.afs.collection<Data>('registros', (ref) => {
      return ref.orderBy('hora', 'desc').where('id', '==', idRegistro).limit(1);
    });
    //Se obtienen todos los usuarios
    this.dataById$ = this.datasCollectionById
      .snapshotChanges()
      .pipe(map((actions) => actions.map((a) => a.payload.doc.data() as Data)));
  }
}
