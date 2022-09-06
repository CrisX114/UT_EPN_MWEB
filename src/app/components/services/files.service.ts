import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  //Observable que contendrá el url del archivo que se subió a Cloud Storage
  urlFile: Observable<string>;

  //Se inyecta el servicio de Cloud Storage
  constructor(private storage: AngularFireStorage) {}
  //Función que permite cargar un archivo a Cloud Storage, retorna su url
  uploadFile(path: any, file: any): Promise<string> {
    return new Promise((resolve) => {
      const ref = this.storage.ref(path);
      const task = this.storage.upload(path, file);
      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            ref.getDownloadURL().subscribe((res) => {
              const downloadURL = res;
              resolve(downloadURL);
              return;
            });
          })
        )
        .subscribe();
    });
  }
}
