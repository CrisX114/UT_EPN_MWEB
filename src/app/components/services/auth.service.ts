import { RoleValidator } from '../class/roleValidator';
import { User } from 'src/app/models/user.interface';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends RoleValidator {
  //se almacenan los datos de Cloud Firestore del usuario loggeado
  public currentUser$: Observable<User>;
  //se almacenan los datos del usuario loggeado (servicio de autenticación de Firebase)
  public userDataFirebase$: Observable<any>;
  //usuario loggeado.
  public user: any;

  //Constructor:
  //se declara el servicio AngularFireAuth para acceder a las características Authentication Firebase
  //el servicio AngularFirestore para acceder a las características de Cloud Firestore.
  constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore) {
    //funcion para acceder a las funciones del padre (RoleValidator)
    super();
    //variable que almacena el estado del usuario que se autenticó por el servicio de Firebase
    this.userDataFirebase$ = afAuth.authState;
    //variable que almacenará el registro de CloudFirestore del usuario autenticado
    //se compara el email del usuario autenticado con los registros de user en la base de datos
    this.currentUser$ = afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          this.user = user;
          return this.afs
            .collection<User>('usuarios', (ref) =>
              ref.where('email', '==', user.email)
            )
            .valueChanges();
        }
        return of(null);
      })
    );
  }

  //función para resetear contraseña de autenticación
  async resetPassword(email: string): Promise<void> {
    try {
      return this.afAuth.sendPasswordResetEmail(email);
    } catch (error) {
      return null;
    }
  }
  //función para gestionar el login.
  async login(email: string, password: string): Promise<any> {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(
        email,
        password
      );
      window.location.reload();
      return result;
    } catch (error) {
      return null;
    }
  }
  //función para crear una cuenta nueva a un usuario en FirebaseAuthentication
  async register(email: string, password: string): Promise<any> {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      return result;
    } catch (error) {
      return null;
    }
  }
  //función para cerrar sesión
  async logout() {
    try {
      await this.afAuth.signOut();
      window.location.reload();
    } catch (error) {
      return null;
    }
  }
  //función para cambiar la contraseña de un usuario autenticado
  async onChangePassword(pass1: any): Promise<any> {
    this.afAuth.currentUser.then((user) => {
      user?.updatePassword(pass1);
    });
  }
}
