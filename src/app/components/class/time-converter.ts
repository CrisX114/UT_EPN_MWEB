export class TimeConverter {
  //Convierte fecha y hora de formato Timestamp a String
  //el idFecha indica si la funcion deve devolver:
  //0: hora y fecha
  //1: solo fecha
  //2: solo hora
  public timeConverter(UNIX_timestamp, idFecha) {
    //var { seconds } = UNIX_timestamp;
    var a = new Date(UNIX_timestamp * 1000);
    var months = [
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
      '10',
      '11',
      '12',
    ];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = '0' + a.getMinutes();
    var sec = '0' + a.getSeconds();
    if (idFecha == 1) {
      var time = date + '/' + month + '/' + year;
      return time;
    }
    if (idFecha == 2) {
      var time = hour + ':' + min.substr(-2) + ':' + sec.substr(-2);
      return time;
    }
    var time =
      date +
      '/' +
      month +
      '/' +
      year +
      ' ' +
      hour +
      ':' +
      min.substr(-2) +
      ':' +
      sec.substr(-2);
    return time;
  }
  //función para sumar 2 horas (hora1+hora2)
  addHoras(hora1: String, hora2: String): string {
    const hora1S = hora1.split(':');

    const hora2S = hora2.split(':');

    let segundoR = parseInt(hora1S[2]) + parseInt(hora2S[2]);
    let horaR = parseInt(hora1S[0]) + parseInt(hora2S[0]);
    let minutoR = parseInt(hora1S[1]) + parseInt(hora2S[1]);
    while (segundoR >= 60) {
      minutoR++;
      segundoR = segundoR - 60;
    }
    while (minutoR >= 60) {
      horaR++;
      minutoR = minutoR - 60;
    }

    return (
      horaR +
      ':' +
      ('0' + minutoR).substr(-2) +
      ':' +
      ('0' + segundoR).substr(-2)
    );
  }
  //función para restar 2 horas (hora1-hora2)
  subtractHoras(hora1: string, hora2: string): string {
    const hora1S = hora1.split(':');

    const hora2S = hora2.split(':');

    let horaR = parseInt(hora1S[0]) - parseInt(hora2S[0]);
    let segundoR = parseInt(hora1S[2]) - parseInt(hora2S[2]);
    let minutoR = parseInt(hora1S[1]) - parseInt(hora2S[1]);
    while (segundoR < 0) {
      minutoR--;
      segundoR = 60 + segundoR;
    }
    while (minutoR < 0) {
      horaR--;
      minutoR = 60 + minutoR;
    }

    return (
      horaR +
      ':' +
      ('0' + minutoR).substr(-2) +
      ':' +
      ('0' + segundoR).substr(-2)
    );
  }
  //funcion para comparar 2 horas. Devuelve:
  //-1: si hora1 es mayor a hora 2
  //0: si son iguales
  //1: si hora1 es menor a hora 2
  compareH(hora1: String, hora2: String): number {
    const hora1S = hora1.split(':');
    const hora2S = hora2.split(':');
    const horas1 =
      parseInt(hora1S[0]) * 10000 +
      parseInt(hora1S[1]) * 100 +
      parseInt(hora1S[2]);
    const horas2 =
      parseInt(hora2S[0]) * 10000 +
      parseInt(hora2S[1]) * 100 +
      parseInt(hora2S[2]);

    if (horas1 > horas2) {
      return 1;
    }
    if (horas1 < horas2) {
      return -1;
    }
    if (horas1 == horas2) {
      return 0;
    }
  }
  //Convierte un formato HHmmss a HH:mm:ss
  convertString(time: number): string {
    return String(time).substr(-6, 2) + ':' + String(time).substr(-4, 2);
  }
  //Convierte un formato HH:mm:ss a HHmmss
  convertNumber(time: string): number {
    return parseInt(
      String(time).substr(-5, 2) + String(time).substr(-2) + '00'
    );
  }
}
