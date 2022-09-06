import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Preference } from '../../models/preference.interface';

@Injectable({
  providedIn: 'root',
})
export class PreferenceService {
  preference$: Observable<Preference>;
  //objeto que almacenará una copia de los datos del observable justification$
  preference: Preference[];
  //se crea un objeto para gestionar el acceso al Cloud Firestore
  private preferencesCollection: AngularFirestoreDocument<Preference>;

  constructor(private readonly afs: AngularFirestore) {
    this.preferencesCollection = afs
      .collection<Preference>('preferencias')
      .doc('sistema');
    this.getPreferences();
  }

  //función para registrar un nuevo usuario o editar un usuario existente
  onSavePreference(pref: Preference): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const data = { ...pref };
        const result = this.preferencesCollection.update(data);
        resolve(result);
      } catch (error) {
        reject(error.message);
      }
    });
  }
  //función para obtener las preferencias de la colección definida preferencesCollection
  private getPreferences(): void {
    this.preference$ = this.preferencesCollection
      .snapshotChanges()
      .pipe(map((a) => a.payload.data() as Preference));
  }
}
