import { User } from 'src/app/models/user.interface';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserService {
  //observable en donde estarán los usuarios obtenidos por CloudFirestore
  user$: Observable<User[]>;
  //se crea un objeto para gestionar el acceso al Cloud Firestore
  private usersCollection: AngularFirestoreCollection<User>;
  //observable en donde estarán los datos obtenidos por CloudFirestore en base al id de usuario
  userById$: Observable<User[]>;
  //se crea un objeto para gestionar el acceso al Cloud Firestore base al id de usuario
  private usersCollectionById: AngularFirestoreCollection<User>;

  //Constructor: se declara el servicio AngularFirestore para acceder a Cloud Firestore
  constructor(private readonly afs: AngularFirestore) {
    //se define el nombre de la colección que se leerá en el Cloud Firestore
    //se aplica un filtro de orden por nombre de forma ascendente
    this.usersCollection = this.afs.collection<User>('usuarios', (ref) =>
      ref.orderBy('name', 'asc')
    );
  }

  //función para registrar un nuevo usuario
  onSaveUser(user: User, userId: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const uid = userId || this.afs.createId();
        const data = { uid, ...user };
        const result = this.usersCollection.doc(uid).set(data);
        resolve(result);
      } catch (error) {
        reject(error.message);
      }
    });
  }

  //función editar un usuario existente
  onUpdateUser(user: User, userId: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const uid = userId;
        const data = { uid, ...user };
        const result = this.usersCollection.doc(uid).update(data);
        resolve(result);
      } catch (error) {
        reject(error.message);
      }
    });
  }
  //función para eliminar un usuario.
  onDeleteUser(userId: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = this.usersCollection.doc(userId).delete();
        resolve(result);
      } catch (error) {
        reject(error.message);
      }
    });
  }
  //función para obtener todos los campos de la colección "usuarios"
  getUsers(): void {
    //se obtiene el observable de data
    this.user$ = this.usersCollection
      .snapshotChanges()
      .pipe(map((actions) => actions.map((a) => a.payload.doc.data() as User)));
  }
  //función para obtener usuarios que coincidan con "userI"
  getUserId(userId: string): void {
    this.usersCollectionById = this.afs.collection<User>('usuarios', (ref) =>
      ref.where('uid', '==', userId)
    );
    //Se obtienen todos los usuarios
    this.userById$ = this.usersCollectionById
      .snapshotChanges()
      .pipe(map((actions) => actions.map((a) => a.payload.doc.data() as User)));
  }
}
