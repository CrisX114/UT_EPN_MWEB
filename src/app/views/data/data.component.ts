import { AuthService } from 'src/app/components/services/auth.service';
import { DataService } from '../../components/services/data.service';
import { JustificationService } from '../../components/services/justification.service';
import { PreferenceService } from './../../components/services/preference.service';
import { UserService } from '../../components/services/user.service';
import { Data } from '../../models/data.interface';
import { DataMes } from '../../models/datames.interface';
import { Preference } from './../../models/preference.interface';
import { User } from '../../models/user.interface';
import { Justification } from '../../models/justification.interface';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TimeConverter } from '../../components/class/time-converter';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css'],
})
export class DataComponent extends TimeConverter implements OnInit, OnDestroy {
  //variable para almacenar el filtro 1: filtro de nombre
  filter1 = '';
  //variable para almacenar el filtro 2: filtro de fecha y estado de asistencia
  filter2 = '';
  //variable para almacenar el filtro 3: filtro de estado de asistencia
  filter3 = '';
  //variable para almacenar el value del Radiobutton que permite seleccionar:
  //1: resumen de asistencia, 2:resumen completo(todos los datos del registro)
  //y 3: resumen por mes.
  selected = '1';
  numPerPage = 20;
  date: string = this.timeConverter((Date.now() / 1000).toFixed(), 1);

  //users$ = this.userSvc.user$;

  //arreglo de objetos para almacenar los datos por mes que se van a mostrar
  dataMes: DataMes[] = [];
  //arreglo de objetos tipo Data (registros) que se almacenarán de forma temporal
  //para asociarlos con su respectivo usuario
  //se almacenarán los registros de los usuarios
  data: Data[] = [];
  data$: Subscription;
  //se almacenarán los usuarios registrados en el sistema
  user: User[] = [];
  user$: Subscription;
  //se almacenarán las justificaciones generadas
  just: Justification[] = [];
  just$: Subscription;
  //se almacenarán las preferencias generadas
  pref: Preference;
  pref$: Subscription;
  //variable para controlar si es Admin o Empleado(restringe la visualización de registros)
  isAdmin: boolean = false;
  //variable para controlar si es Admin o Empleado(restringe la visualización de registros)
  isLogged: boolean = false;
  //variable que recupera el usuario autenticado desde el servicio authService
  currentUser: string = null;
  currentUserId: string = null;
  //objeto para almacenar los registros que se desea enviar a otro componente
  navigationExtras: NavigationExtras = { state: { value: null } };
  public page: number = 0;

  constructor(
    private router: Router,
    private userSvc: UserService,
    private dataSvc: DataService,
    private justSvc: JustificationService,
    private authSvc: AuthService,
    private prefSvc: PreferenceService
  ) {
    super();
    //se inicializa la variable "selected" en 1 ya que se desplegará la primera ventana
    this.selected = '1';
    //crea una llamada a la función getAdmin();
    this.getDataAdmin();
  }
  ngOnDestroy(): void {
    this.data$.unsubscribe();
    this.user$.unsubscribe();
    this.just$.unsubscribe();
  }

  //Función que se ejecutará al inicir el componente
  ngOnInit() {}

  //función que determinará el rol del usuario autenticado
  //y se guardará en la variable isAdmin
  async getDataAdmin() {
    //Se llama al documento preferencias para obtener los valores de las tolerancias de entrada y salida
    this.pref$ = this.prefSvc.preference$.subscribe((data) => {
      this.pref = data;
    });
    //se obtiene el usuario autenticado mediante una suscripción al observable del servicio authService
    this.authSvc.currentUser$.subscribe((data) => {
      if (data.toString()) {
        //asignación del usuario autenticado a "currentUser".
        this.currentUser = data[0].name;
        this.currentUserId = data[0].uid;
        //comprobación del rol del usuario autenticado mediante la funcion isAdmin
        //definida en la clase RoleValidator
        this.isAdmin = this.authSvc.isAdmin(data);
        this.isLogged = true;
      }
      //se obtiene una copia del observable de los registros a un objeto Data[]
      if (this.isAdmin) {
        //se obtiene una copia del observable de los usuarios a un objeto User[]
        this.userSvc.getUsers();
        this.dataSvc.getDatas();
        this.justSvc.getJustifications();
        this.user$ = this.userSvc.user$.subscribe((data) => {
          this.user = data;
        });
        //se obtiene una copia del observable de las justificaciones a un objeto Justification[]
        this.just$ = this.justSvc.justification$.subscribe((data) => {
          this.just = data;
        });
        this.data$ = this.dataSvc.data$.subscribe((data) => {
          this.data = data;
          this.set();
        });
      } else {
        this.dataSvc.getDataId(this.currentUserId);
        this.justSvc.getJustId(this.currentUserId);
        this.userSvc.getUserId(this.currentUserId);
        this.user$ = this.userSvc.userById$.subscribe(
          (data) => (this.user = data)
        );

        this.just$ = this.justSvc.justificationById$.subscribe(
          (data) => (this.just = data)
        );
        this.data$ = this.dataSvc.dataById$.subscribe((data) => {
          this.data = data;
          this.set();
        });
      }
    });
  }

  print() {
    window.print();
  }
  //función que se ejecuta al dar click en el botón "Justificar"
  createJustification(item: any): void {
    //toma el valor del item en el cual se dió click
    this.navigationExtras.state.value = item;
    //se redirige al componente "new-j" con el argumento que contiene el registro
    this.router.navigate(['new-j'], this.navigationExtras);
  }
  //función que se ejecuta al dar click en el botón "Ver Justificación"
  seeJustification(item: any) {
    //toma el valor del item en el cual se dió click
    this.navigationExtras.state.value = item;
    //se redirige al componente "details-j" con el argumento que contiene el registro
    this.router.navigate(['details-j'], this.navigationExtras);
  }

  setHorasExtra() {
    this.data.forEach((item) => {
      if (!item.horasExtra) {
        item.horasExtra = '00:00:00';
        if (item.hora[1] && item.horario != '00:00') {
          if (
            this.compareH(
              item.horasTrabajadas,
              this.addHoras(
                item.horario + ':00',
                '00:' + this.pref.toleranciaOut + ':00'
              )
            ) > 0
          ) {
            item.horasExtra = this.subtractHoras(
              item.horasTrabajadas,
              item.horario + ':00'
            );
          }
          if (
            this.compareH(
              item.horasTrabajadas,
              this.subtractHoras(
                item.horario + ':00',
                '00:' + this.pref.toleranciaIn + ':00'
              )
            ) < 0 &&
            item.asistencia[0] != 'DIA EXTRA'
          ) {
            item.asistencia.push('SALIDA TEMPRANA');
          }
        }
      }
    });
  }

  setHorasTrabajadas() {
    const tiempoActual = (Date.now() / 1000).toFixed();
    this.data?.forEach((item) => {
      if (
        this.timeConverter(tiempoActual, 1) ==
          this.timeConverter(item.hora[0]['seconds'], 1) &&
        item.horasTrabajadas == '00:00:00' &&
        item.asistencia[0] != 'FALTA'
      ) {
        var seconds = parseInt(tiempoActual) - item.hora[0]['seconds'] + 18000;
        item.horasTrabajadas = this.timeConverter(seconds, 2);
      }
      if (
        this.timeConverter(tiempoActual, 1) !=
          this.timeConverter(item.hora[0]['seconds'], 1) &&
        item.horasTrabajadas == '00:00:00' &&
        item.asistencia[0] != 'FALTA' &&
        item.hora.length % 2 != 0
      ) {
        item.asistencia[1] = 'SIN SALIDA';
      }
    });
  }

  setDataMes(): DataMes[] {
    try {
      if (!this.dataMes || this.dataMes.length == 0) {
        let temp: DataMes;
        var existe: boolean;
        this.dataMes = [];
        let idUsuarios = [];
        let fechaGuardando: string;
        this.data?.forEach((data: Data) => {
          temp = {
            fecha: '',
            idUsuario: '',
            usuario: '',
            data: [],
            horasTrabajadas: '00:00:00',
            horasExtra: '00:00:00',
            horasTotalesTrabajo: '00:00:00',
            horasDiaExtra: '00:00:00',
            horasExtraJustificadas: '00:00:00',
            numAtrasos: 0,
            numFaltas: 0,
            numSalidasTempranas: 0,
            numSinSalidas: 0,
            numDiaExtra: 0,
          };
          existe = false;
          const fechaD = this.timeConverter(data.hora[0]['seconds'], 1).split(
            '/'
          );
          const fechadata = fechaD[1] + '/' + fechaD[2];
          if (fechaGuardando != fechadata) {
            fechaGuardando = fechadata;
            idUsuarios = [];
          }
          idUsuarios?.forEach((user) => {
            if (user == data.idUsuario) {
              existe = true;
            }
          });
          if (!existe) {
            idUsuarios.push(data.idUsuario);
            temp.usuario = data.usuario;
            temp.fecha = fechaGuardando;
            temp.idUsuario = data.idUsuario;
            this.dataMes.push(temp);
          }

          this.dataMes?.forEach((datames) => {
            if (
              datames.fecha == fechaGuardando &&
              datames.idUsuario == data.idUsuario
            ) {
              datames.data.push(data);
              if (data.horario != '00:00') {
                //cambio
                if (data.asistencia?.indexOf('ATRASO') >= 0) {
                  datames.numAtrasos++;
                }
                if (data.asistencia.indexOf('SIN SALIDA') >= 0) {
                  datames.numSinSalidas++;
                }
                if (data.asistencia.indexOf('FALTA') >= 0) {
                  datames.numFaltas++;
                }
                if (data.asistencia[0] != 'DIA EXTRA') {
                  if (
                    this.compareH(data.horasTrabajadas, data.horario + ':00') >=
                      0 ||
                    this.compareH(
                      this.addHoras(
                        '00:' + this.pref.toleranciaIn + ':00',
                        data.horasTrabajadas
                      ),
                      data.horario + ':00'
                    ) >= 0
                  ) {
                    datames.horasTrabajadas = this.addHoras(
                      datames.horasTrabajadas,
                      data.horario + ':00'
                    );
                    if (
                      this.compareH(
                        data.horasTrabajadas,
                        data.horario + ':00'
                      ) >= 0
                    ) {
                      datames.horasExtra = this.addHoras(
                        datames.horasExtra,
                        this.subtractHoras(
                          data.horasTrabajadas,
                          data.horario + ':00'
                        )
                      );
                    }
                  } else {
                    if (
                      data.asistencia.indexOf('FALTA') < 0 &&
                      data.horasTrabajadas != '00:00:00'
                    ) {
                      const tiempoActual = (Date.now() / 1000).toFixed();
                      if (
                        this.timeConverter(tiempoActual, 1) !=
                        this.timeConverter(data.hora[0]['seconds'], 1)
                      ) {
                        datames.numSalidasTempranas++;
                      }
                      if (data.justificaciones) {
                        data.justificaciones?.forEach((justificacion) => {
                          const justific = this.just.filter(
                            (just) => just.id == justificacion
                          );

                          if (
                            justific[0].tipo == 'SALIDA_TEMPR' &&
                            justific[0].status == 'ACEPTADO' &&
                            justific[0].tipo
                          ) {
                            datames.numSalidasTempranas -= 1;
                            datames.horasTrabajadas = this.addHoras(
                              datames.horasTrabajadas,
                              justific[0].horaJustificada
                            ).toString();
                          } else {
                            datames.horasTrabajadas = this.addHoras(
                              datames.horasTrabajadas,
                              data.horasTrabajadas
                            ).toString();
                          }
                        });
                      } else {
                        datames.horasTrabajadas = this.addHoras(
                          datames.horasTrabajadas,
                          data.horasTrabajadas
                        );
                      }
                    }
                  }
                } else {
                  datames.numDiaExtra++;
                }
              } else {
                datames.horasTrabajadas = this.addHoras(
                  datames.horasTrabajadas,
                  data.horasTrabajadas
                );
              }
              datames.horasTotalesTrabajo = this.addHoras(
                datames.horasTotalesTrabajo,
                data.horario + ':00'
              );
              if (data.asistencia[0] != 'DIA EXTRA') {
              }
              //gestion de justificaciones
              data.justificaciones?.forEach((justificacion) => {
                const justific = this.just.filter(
                  (just) => just.id == justificacion
                );
                if (justific.length > 0) {
                  if (
                    justific[0].tipo == 'DIA_EXTRA' &&
                    justific[0].status == 'ACEPTADO'
                  ) {
                    datames.horasDiaExtra = this.addHoras(
                      datames.horasDiaExtra,
                      justific[0].horaJustificada
                    ).toString();
                  }
                  if (
                    justific[0].tipo == 'ATRASO' &&
                    justific[0].status == 'ACEPTADO'
                  ) {
                    datames.numAtrasos -= 1;
                  }
                  if (
                    justific[0].tipo == 'HORAS_EXTRA' &&
                    justific[0].status == 'ACEPTADO'
                  ) {
                    datames.horasExtraJustificadas = this.addHoras(
                      datames.horasExtraJustificadas,
                      justific[0].horaJustificada
                    ).toString();
                  }
                  if (
                    justific[0].tipo == 'FALTA' &&
                    justific[0].status == 'ACEPTADO'
                  ) {
                    datames.horasTrabajadas = this.addHoras(
                      datames.horasTrabajadas,
                      justific[0].horaJustificada
                    ).toString();
                    datames.numFaltas -= 1;
                  }
                  if (
                    justific[0].tipo == 'SIN_SALIDA' &&
                    justific[0].status == 'ACEPTADO'
                  ) {
                    datames.horasTrabajadas = this.addHoras(
                      datames.horasTrabajadas,
                      justific[0].horaJustificada
                    ).toString();
                    datames.numSinSalidas -= 1;
                  }
                }
              });
            }
          });
        });
      }
    } catch (error) {
      console.log(error);
    }
    return this.dataMes;
  }

  async set() {
    this.setHorasTrabajadas();
    this.setHorasExtra();
    this.dataMes = this.setDataMes();
    this.page = 0;
  }

  nextPage() {
    this.page += this.numPerPage;
  }

  prevPage() {
    if (this.page > 0) this.page -= this.numPerPage;
  }
}
