import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpParams} from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _ from 'lodash';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Analyse, As, User, Project, Qc, Result, Summary, Variable, Dt} from './entities';
import { Subject, Observable, of} from 'rxjs';
import { mergeMap, map, delay, tap} from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';


@Injectable()
export class CommonsService {
  pageSize = 10;
  user: User = { registered: false};
  private projects: Project[] = [];
  project: Project = new Project;
  dt: Dt = new Dt;
  qc: Qc = new Qc;
  ass: As = new As;
  result: Result = new Result;
  variables: Variable[] = [];

  /**
   * allow to regenerate the nav bar
   */
  dataReady = new Subject<void>();

  redirectUrl = '/home';
  private api_url: string = environment.apiUrl; 
  private base: string; // url for authentification 

  params = {
    varTypes: ['Binary', 'Continuous', 'Ordinal'],
    asOutputs: ['outcome', 'predictor', 'confounder', 'covariate'],
    transformOptions: ['Nothing', 'Logarithmic', 'Normalization'],
  };

  constructor(private http: HttpClient, private router: Router, public snackBar: MatSnackBar, protected localStorage: LocalStorage) {
    this.base = '//' + window.location.origin.split('/')[2].replace('4200', '8000') + '/';
  }

  getProjects(refresh?: boolean): Observable<Project[]> {
    if(refresh) {
      if (this.projects.length != 0) {
        return of(this.projects);
      }
    }
    return this.http.get<Project[]>(this.api_url + 'projects/', {withCredentials: true});
  }

  /**
     * register the user. If a username and password are provided it's going to register
     * @param username the user login
     * @param password the password for this user
     */
  registerUser(mail?: string, password?: string): Observable<User> {
    const headers = { 'X-Requested-With': 'XMLHttpRequest' } as any;
    return this.http.post<any>(this.base + 'auth/register',
    { headers: new HttpHeaders(headers), email: mail, password: password })
    .pipe(tap(data => { 
      this.user.registered = true;
    }));
  }

  /**
   * Login with username and password
   * @param username the user login
   * @param password the password for this user
   */
  loginUser(username: string, password: string): Observable<any> {
    const body = new HttpParams()
      .set('username', username)
      .set('password', password);
    return this.http.post(this.base + 'auth/jwt/login', body.toString(), 
    { headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'), withCredentials: true});
  }

  //request an email to reset the password of the sent address
  requestVerify(mail: string): Observable<any> {
    const body = {"email": mail}
    return this.http.post(this.base + 'auth/request-verify-token', body,{ withCredentials: true});
  }
  mailVerify(token: string): Observable<any> {
    const body = {"token": token}
    return this.http.post(this.base + 'auth/verify', body,{ withCredentials: true});
  }

  //request an email to reset the password of the sent address
  forgotPassword(mail: string): Observable<any> {
    const body = {"email": mail}
    return this.http.post(this.base + 'auth/forgot-password', body,{ withCredentials: true});
  }

  resetPassword(token: string, password: string): Observable<any> {
    const body = {"token": token, "password": password}
    return this.http.post(this.base + 'auth/reset-password', body,{ withCredentials: true});
  }

  changePassword(): Observable<any> {
    const body = {}
    return this.http.post(this.api_url + 'changePassword/', body, {withCredentials: true});
  }

  deleteAccount(): void {
    this.http.delete(this.api_url + 'deleteAccount/', {withCredentials: true}).subscribe(() => {
    });
  }
  
  newProject(form: FormData): Observable<HttpEvent<string>>{
    this.projects = null;
    return this.http.post<string>(this.api_url + 'continueFileUpload/', form, {withCredentials: true, reportProgress: true, observe: "events"})
  }

  isCreator(project_id: number): Observable<boolean> {
    const url = this.api_url + `isCreator/?project_id=${project_id}`;
    return this.http.get<boolean>(url, {withCredentials: true})
  }

  getCollaborator(project_id: number): Observable<string[]> {
    const url = this.api_url + `getCollaborators/?project_id=${project_id}`;
    return this.http.get<string[]>(url, {withCredentials: true})
  }

  addCollaborator(project_id: number, mail : string): Observable<string>{
    const myPostBody = {project_id, mail}
    const url = this.api_url + `addCollaborator/?project_id=${project_id}&mail=${mail}`;
    return this.http.post<string>(url, myPostBody, {withCredentials: true})
  }

  removeCollaborator(project_id: number, mail : string): Observable<string>{
    const url = this.api_url + `removeCollaborator/?project_id=${project_id}&mail=${mail}`;
    return this.http.delete<string>(url, {withCredentials: true})
  }

  newDt(project: Project): Observable<Dt> {
    const dt = new Dt();
    const now = new Date();
    //const defaultName = 'QC ' + now.getFullYear() + '-' + now.getMonth() + '-' + now.getDate() + '-' + now.getHours() + 'h' + now.getMinutes();
    const defaultName = "Data Transformation 1"
    dt.name = defaultName;
    dt.projectId = project.ident;
    return this.http.post<Dt>(this.api_url + 'dataTransformation/', dt, {withCredentials: true}).pipe(
      map(newDt => {
        project.dataTransformation.push(newDt);
        return newDt;
      }),
    );
  }

  newQc(dt: Dt, project: Project): Observable<Qc> {
    const qc = new Qc();
    const now = new Date();
    //const defaultName = 'QC ' + now.getFullYear() + '-' + now.getMonth() + '-' + now.getDate() + '-' + now.getHours() + 'h' + now.getMinutes();
    const defaultName = "Quality Control 1"
    qc.name = defaultName;
    qc.missingThreshold = Math.floor(project.sampleSize * 0.3);
    qc.distanceMean = 3;
    qc.dtId = dt.ident;
    qc.projectId = dt.projectId;
    qc.lowCountRule = 5;
    return this.http.post<Qc>(this.api_url + 'qualityControls/', qc, {withCredentials: true}).pipe(
      map(newQc => {
        dt.qualityControl.push(newQc);
        return newQc;
      }),
    );
  }

  newAs(qc: Qc): Observable<As> {
    const as = new As();
    as.name = "Variables Selection 1";
    as.projectId = qc.projectId;
    as.dtId = qc.dtId;
    as.qcId = qc.ident;
    return this.http.post<As>(this.api_url + 'analysisSettings/', as, {withCredentials: true}).pipe(
      map(newAs => {
        qc.analysisSetting.push(newAs);
        return newAs;
      }),
    );
  }

  newResult(ass: As): Observable<Result> {
    const result = new Result();
    result.asId = ass.ident;
    result.qcId = ass.qcId;
    result.dtId = ass.dtId;
    result.projectId = ass.projectId;
    return this.http.post<Result>(this.api_url + 'results/', result, {withCredentials: true}).pipe(
      map(r => {
        ass.result.push(r);
        return r;
      }),
    );
  }

  deleteProject(id: number): void {
    this.http.delete<string>(this.api_url + 'deleteProject/?project_id=' + id, {withCredentials: true}).subscribe(() => {
    });
  }

  deleteDt(projectId: number, dtId: number): Observable<string> {
    return this.http.delete<string>(this.api_url + 'deleteDt/?project_id=' + projectId + '&dt_id=' + dtId, {withCredentials: true});
  }

  deleteQc(projectId: number, dtId: number, qcId: number): Observable<string> {
    return this.http.delete<string>(this.api_url + 'deleteQc/?project_id=' + projectId + '&dt_id=' + dtId + '&qc_id=' + qcId, {withCredentials: true});
  }

  deleteAs(projectId: number, dtId: number, qcId: number, asId: number): Observable<string> {
    return this.http.delete<string>(this.api_url + 'deleteAs/?project_id=' + projectId + '&dt_id=' + dtId + '&qc_id=' + qcId + '&as_id=' + asId, {withCredentials: true});
  }

  deleteResult(projectId: number, dtId: number, qcId: number, asId: number, resultId: number): Observable<string> {
    return this.http.delete<string>(this.api_url + 'deleteResult/?project_id=' + projectId + '&dt_id=' + dtId + '&qc_id=' + qcId + '&as_id=' + asId + '&result_id=' + resultId, {withCredentials: true});
  }

  launchAnalyse(r: Result, preselection: boolean, logistic: boolean): Observable<Result> {
    return this.http.get<Result>(this.api_url + 'launch_analysis/' + r.ident, {params : {preselection : preselection, logistic : logistic}, withCredentials: true});
  }

  private _isSameId(obj: { ident: number }, id: string) {
    return obj.ident === parseInt(id, 10);
  }

  getProject(id: number): Observable<Project>{
    return this.http.get<Project>(this.api_url + 'project/', {params: {project_id : id}, withCredentials: true});
  }

  getDt(id: string): Observable<Dt> { 
    return this.getProjects().pipe(
      map((projects: Project[]) => {
        projects.map(p => {
          p.dataTransformation
            .filter(d => this._isSameId(d, id))
            .map(d => {
              (this.project = p), (this.dt = d);
            })
      });
        this.dataReady.next();
        return this.dt;
      }),
    );
  }

  getQc(id: string): Observable<Qc> {
    return this.getProjects().pipe(
      map((projects: Project[]) => {
        projects.map(p =>
          p.dataTransformation.map(d =>
            d.qualityControl.filter(q => this._isSameId(q, id)).map(q => {
              (this.project = p), (this.dt = d), (this.qc = q);
            }),
          ),
        );
        this.dataReady.next();
        return this.qc;
      }),
    );
  }

  private _formatVariable(v: Variable, p: Project): Variable {
    v.missingP = Math.floor((v.missing * 100) / p.sampleSize);
    return v;
  }
  
  getVariablesForDataTransformation(dt: Dt): Observable<Variable[][]> {
    return this.localStorage.getItem('varsTransform' + dt.ident + dt.created).pipe(
      mergeMap(vars => {
        if (vars && vars instanceof Array) {
          //console.log('get variables from cache');
          return of(vars);
        } else {
          //console.log("no variables in cache");
          const url = this.api_url + `variables_transform/?project_id=${dt.projectId}&dt_id=${dt.ident}`;
          return this.http.get(url, {withCredentials: true}).pipe(
            map((variables: any) => {
              this.localStorage.setItem('varsTransform' + dt.ident + dt.created, variables).subscribe();
              return variables;
            }),
          );
        }
      }),
    );
  }

  getVariablesForQc(qc: Qc, p: Project): Observable<Variable[]> {
    return this.localStorage.getItem('vars_' + qc.ident + qc.created).pipe(
      mergeMap(vars => {
        if (vars && vars instanceof Array) {
          //console.log('get variables from cache');
          return of(vars);
        } else {
          //console.log("no variables in cache");
          const url = this.api_url + `variables_QC/?id=${qc.projectId}&dt_id=${qc.dtId}`;
          return this.http.get(url, {withCredentials: true}).pipe(
            map((r: any) => {
              const vars = r.map((v: Variable) => this._formatVariable(v, p));
              this.localStorage.setItem('vars_' + qc.ident + qc.created, vars).subscribe();
              return vars;
            }),
          );
        }
      }),
    );
  }

  getVariablesForProjectDetail(project: Project): Observable<Variable[]> {
    const qc = new Qc();
    return this.localStorage.getItem('vars_' + project.ident + project.created).pipe(
      mergeMap(vars => {
        if (vars && vars instanceof Array) {
          //console.log('get variables from cache');
          return of(vars);
        } else {
          //console.log("no variables in cache");
          const url = this.api_url + `variables_project/?id=${project.ident}`;
          return this.http.get(url, {withCredentials: true}).pipe(
            map((r: any) => {
              const vars = r.map((v: Variable) => this._formatVariable(v, project));
              this.localStorage.setItem('vars_' + project.ident + project.created, vars).subscribe();
              return vars;
            }),
          );
        }
      }),
    );
  }

  getAs(id: string): Observable<As> {
    return this.getProjects().pipe(
      map((projects: Project[]) => {
        projects.map(p =>
          p.dataTransformation.map(d =>
            d.qualityControl.map(q =>
              q.analysisSetting.filter(a => this._isSameId(a, id)).map(a => {
                (this.project = p), (this.dt = d), (this.qc = q), (this.ass = a);
              }),
            ),
          ),
        );
        this.dataReady.next();
        return this.ass;
      }),
    );
  }

  getResult(id: string, refresh = false): Observable<Result> {
    return this.getProjects(refresh).pipe(
      map((projects: Project[]) => {
        projects.map(p =>
          p.dataTransformation.map(d =>
            d.qualityControl.map(q =>
              q.analysisSetting.map(a =>
                a.result.filter(r => this._isSameId(r, id)).map(r => {
                  (this.project = p), (this.dt = d), (this.qc = q), (this.ass = a), (this.result = r);
                }),
              ),
            ),
          ),
        );
        this.dataReady.next();
        return this.result;
      }),
    );
  }

  goQA = () => this.router.navigate(['/QA']);
  goNewProject = () => this.router.navigate(['/new']);
  goFrontpage = () => this.router.navigate(['/p']);
  goProject = (p: { ident: number; }) => this.router.navigate(['/p', p.ident]);
  goDt = (dt: { ident: number; }) => this.router.navigate(['/dt', dt.ident]);
  goQc = (qc: { ident: number; }) => this.router.navigate(['/qc', qc.ident]);
  goAs = (as: As) => this.router.navigate(['/as', as.ident]);
  goResult = (r: { ident: number; }) => this.router.navigate(['/r', r.ident]);
  goResetTokenExpired = () => this.router.navigate(['/reset-token-expired']);

  logout() {
    this.http.post(this.base + 'auth/jwt/logout', {}, {withCredentials: true}).subscribe(() => this.router.navigate(['/signin']));
  }

  /**
   * shrink the dataSample according to the low count rule policy
   *
   * @return a boolean to say if it should be excluded according to the low count rule policy
   */
  private _shrinkSampleData(variable: Variable, lowCountRule: number) {
    // TODO optimize: if the sample has already been done for this lowCountRule there is no need to redo it.
    variable.shrinked = false;
    const NA = 'nan';
    variable.dataDistributionPostQC = [];
    //with "=" when you change sample you change dataDistribution, other method should be able to work but they didn't work for me
    let sample = JSON.parse(JSON.stringify(variable.dataDistribution))
    var length = Object.keys(sample).length;
    for (let i = length - 1; i >= 0; i--) {
      if (sample[i].occurrence < lowCountRule) {
        let next = sample[i - 1];
        if (next && next.value === NA) {
          next = sample[i - 2];
        }
        if (!next) {
          next = sample[i + 1];
        }
        if (next) {
          next.occurrence += sample[i].occurrence;
          sample[i].occurrence = 0;
          variable.shrinked = true; // to know that it happened at least once
        }
      }
    }
    for (let i = 0; i <= length - 1; i++) {
      if (sample[i].occurrence != 0) {
        variable.dataDistributionPostQC.push(sample[i])
      }
    }
    return variable.dataDistributionPostQC.length == 1;
  }

  /**
   * Apply the rules like 'missing data rule' or 'low count rule'
   */
  applyRules(variables: Variable[], qc: Qc) {
    qc.noVarianceCount = qc.tooManyMissingCount = qc.lowCountRuleCount = 0;
    qc.ruleCount = qc.numberOfVariablePostQc = qc.totalMissing = 0;
    qc.excludedLowCountRule = [];

    // TODO implement outliers rule

    const varsRuled = variables.map(v => {
      v.excluded = false;
      if (v.type =='Text') {
        v.excluded = true;
      }
      if (!v.variance) {
        qc.noVarianceCount++;
      }
      v.excludedBcMissing = v.missing > qc.missingThreshold;
      if (v.excludedBcMissing) {
        qc.tooManyMissingCount++;
      }
      v.isExcludedBcLCR = v.type != 'Continuous' && Object.keys(v.dataDistribution).length > 1 && this._shrinkSampleData(v, qc.lowCountRule);
      if (v.isExcludedBcLCR) {
        qc.excludedLowCountRule.push(v.ident);
      }
      if (v.shrinked) {
        qc.lowCountRuleCount++;
      }
      if (v.shrinked || v.excludedBcMissing) {
        qc.ruleCount++;
      }
      if (this.isForcedExclude(v)) {
        v.excluded = true;
      }
      return v;
    });

    const keptVariables = this._sumUpVars(varsRuled, qc); //necessary for postQC data summary
    return varsRuled;
  }

  isForcedExclude = (v: Variable) => !v.variance || v.excludedBcMissing || v.isExcludedBcLCR;

  /**
   * Write a 'sum up' of the variables in the QC
   */
  private _sumUpVars(variables: any[], qc: Qc) {
    if (!qc.dataSummaryPostQc) {
      qc.dataSummaryPostQc = JSON.parse(JSON.stringify(qc.dataSummaryPreQc));
    }
    qc.dataSummaryPostQc.map((type: { value: number; }) => (type.value = 0)); //reset dataSummaryPostQC
    return variables
      .filter((v: { excluded: any; }) => !v.excluded)
      .map((v: { missing: any; type: any; }) => {
        qc.numberOfVariablePostQc++;
        qc.totalMissing += v.missing;
        qc.dataSummaryPostQc.filter((type: { name: any; }) => type.name === v.type).map((type: { value: number; }) => type.value++);
        return v;
      });
  }

  getVariables_AS(p: Project, qc: Qc, as: As): Observable<Variable[]> {
    return this.localStorage.getItem('vars_qc' + qc.ident + '_as' + as.ident).pipe(
      mergeMap(vars => {
        if (vars && vars instanceof Array) {
          //console.log('get variables from cache');
          return of(vars);
        } else {
          //console.log("no variables in cache");
          return this._getVariables_AS_from_server(p, qc, as);
        }
      }),
    );
  }

  private _getVariables_AS_from_server(p: Project, qc: Qc, as: As): Observable<Variable[]> {
    const url = this.api_url + `variables_AS/?project_id=${as.projectId}&dt_id=${as.dtId}&qc_id=${as.qcId}&as_id=${as.ident}`;
    return this.http.get(url, {withCredentials: true}).pipe(
      map((r: any) => {
        const vars = r.map((v: Variable) => this._formatVariable(v, p));
        const varsSignature = 'vars_dt' + as.dtId +'_qc' + as.qcId + '_as' + as.ident;
        this.localStorage.setItem(varsSignature, vars).subscribe();
        return vars;
      }),
    );
  }

  transformData(dt: Dt, changed: Set<Variable>): Observable<Dt> {
    this.localStorage.setItem('varsTransform' + dt.ident + dt.created, changed).subscribe();
    var list_variables = Array.from(changed.values()); //The backend cannot read Set, but it can read array, idk why
    const myPostBody = {dt, list_variables};
    return this.http.patch<Dt>(this.api_url + 'transformation/', myPostBody, {withCredentials: true});
  }

  private _patchQc$(qc: Qc) {
    var qcToSend = new Qc();
    qcToSend.ident = qc.ident;
    qcToSend.projectId = qc.projectId;
    qcToSend.dtId = qc.dtId;
    qcToSend.name = qc.name;
    qcToSend.missingThreshold = qc.missingThreshold;
    qcToSend.lowCountRule = qc.lowCountRule;
    qcToSend.distanceMean = qc.distanceMean;
    qcToSend.dataSummaryPreQc = qc.dataSummaryPreQc;
    qcToSend.created = qc.created;
    qcToSend.updated = qc.updated;
    return this.http.patch<Qc>(this.api_url + 'qualityControls/', qcToSend, {withCredentials: true});
  }

  patchQc(qc: Qc): Observable<Qc> {
    const qcS = { ...qc };
    qcS.excludedLowCountRule = null; // hack to avoid spring rest to fail
    if (qcS.outliersChoose == "preserveAll") {qcS.distanceMean = -1} // to save the preserveAll in database set distanceMean<0
    return this._patchQc$(qcS)
  }
  /**
   * Fast create a DT, a QC and an As
  **/
  fastQcAs(p: Project): Observable<As> {
    let d = 500;
    let dt: Dt;
    let qc: Qc;
    return of({}).pipe(
      mergeMap(() => {
        return this.newDt(p);
      }),
      mergeMap(dT => {
        delay(d);
        dt = dT;
        return this.transformData(dt, new Set<Variable>());
      }),
      mergeMap(() => {
        delay(d);
        return this.newQc(dt, p);
      }),
      mergeMap(qC => {
        delay(d);
        qc = qC;
        return this.getVariablesForQc(qc, p);
      }),
      mergeMap(() => {
        delay(d);
        return this.patchQc(qc);
      }),
      mergeMap(() => {
        delay(d);
        return this.newAs(qc);
      }),
    );
  }


  updateCacheVariables(qc: Qc, as:As ,vars: Variable[]){
    const varsSignature = 'vars_qc' + qc.ident + '_as' + as.ident;
    this.localStorage.setItem(varsSignature, vars).subscribe();
  }
  patchAs(As: As, changed: Variable[]) {
    const myPostBody = {As, changed}
    return this.http.patch<As>(this.api_url + 'analysisSettings/', myPostBody, {withCredentials: true}).pipe(
      mergeMap(newAs => {
        As.updated = newAs.updated;
        return of([]);
      }),
    );  
  }

  snack = (msg: string) => this.snackBar.open(msg, '', { duration: 3000 });

  /**
   * get variables disctribution (predictor, covariate...) in a JSON format.
   */
  getVarDistribution(project: Project, qc: Qc, as: As) {
    const distrib = new Map<string, number>()
    this.params.asOutputs.map(o => (distrib.set(o,0)));
    return this.getVariables_AS(project, qc, as).pipe(
      map(vars => {
        vars.forEach(v => Object.keys(distrib).map(type => (v.type ? distrib.set(type,distrib.get(type)+1) : 0)));
        return distrib;
      }),
    );
  }


  getResultFile(result: Result): Observable<Analyse> {
    return this.localStorage.getItem<Analyse>('analyse' + result.ident + result.created).pipe(
      mergeMap(Analysis => {
        if (Analysis) {
          //console.log('get result from cache');
          return of(Analysis as Analyse);
        } else {
          //console.log("get result from server");
          return this.getResultFileServer(result);
        }
      }),
    );
  }

  private getResultFileServer(result: Result): Observable<Analyse> {
    return this.http.get<Analyse>(this.api_url + 'res/' + result.ident, {withCredentials: true}).pipe(
      map(rawAnalysis => {
        const analysis: Analyse = rawAnalysis;
        if (analysis.completed) {
          this.localStorage.setItem('analyse' + result.ident + result.created, analysis).subscribe();
          return analysis
        } else {
          return analysis;
        }
      }),
    );
  }

  /**
   * build a summary JSON object
   */
  buildResultSummary(data: any[]) {
    const summary = new Summary();
    summary.total = data.length;
    summary.Pvalue = summary.nominallyLimit / summary.total;
    const nominally: any[] = [];
    data.map(r => {
      if ((r.MAp && r.MAp < summary.nominallyLimit) || (r.MCp && r.MCp < summary.nominallyLimit)) {
        summary.nominallySignificantAssoc++;
        nominally.push(r);
      }
      if ((r.MAp && r.MAp < summary.Pvalue) || (r.MCp && r.MCp < summary.Pvalue)) {
        summary.bonferroni++;
      }
    });
    summary.nominally = nominally
      .sort((a, b) => {
        if (a.MAp && a.MCp && b.MAp && b.MCp) {
          return _.min([a.MAp, a.MCp]) - _.min([b.MAp, b.MCp]);
        }
        if (a.MAp) {
          return a.MAp - b.MAp;
        }
        if (a.MCp) {
          return a.MCp - b.MCp;
        }
        else {
            return 0;
        }
      })
      .slice(0, 5);
    return summary;
  }

  /**
   * build a JSON object for the charts
   */
  buildChartsData(data: any[]): any {
    const maxDiff = data.reduce((diff, e) => {
      const currentDiff = Math.abs(e.MAp - e.MCp);
      return currentDiff > diff ? currentDiff : diff;
    }, 0);
    const res = [{ name: 'MAp', series: [] as any[] }, { name: 'MCp', series: [] }];
    data.forEach((e, i) => {
      e.name = i;
      e.x = i;
      e.r = 1;
      if (Number.isNaN(e.MAp) && !Number.isNaN(e.MCp)) {
        e.y = -Math.log10(e.MCp);
        res[0].series.push(e);
      } else if (!Number.isNaN(e.MAp) && Number.isNaN(e.MCp)) {
        e.y = -Math.log10(e.MAp);
        res[0].series.push(e);
      } else if (!Number.isNaN(e.MAp) && !Number.isNaN(e.MCp)) {
        res[e.MAp > e.MCp ? 0 : 1].series.push(e);
        e.y = -Math.log10(e.MAp) > -Math.log10(e.MCp) ? -Math.log10(e.MAp) : -Math.log10(e.MCp);
        if (maxDiff != 0) {
          e.r = e.r * (1 + Math.abs(e.MAp - e.MCp) / maxDiff);
        }
      }
    });
    return res;
  }

  /**
   * build a JSON object for the histogramm
   */
  buildHistogrammData(qc_id : number, var_id : number, isPreQc : boolean): Observable<any[]> {
    return this.http.get<any[]>(this.api_url + 'histogramm_variable/', {params: {qc_id : qc_id, var_id : var_id, isPreQc : isPreQc}, withCredentials: true});
  }

  /**
   * build a JSON object for the histogramm before QC
   */
  buildHistogrammDataProjectDetail(project_id : number, var_id : number): Observable<any[]> {
    return this.http.get<any[]>(this.api_url + 'histogramm_variable_project/', {params: {project_id : project_id, var_id : var_id}, withCredentials: true});
  }

  getAssociationDetail(association: { out: string; pred: string; }, result: Result, preselection: boolean, logistic: boolean): Observable<any[]> {
    return this.http.post<any>(this.api_url + 'association/', {
        idProject: result.projectId,
        idDt: result.dtId,
        idQc: result.qcId,
        idAs: result.asId,
        idResult: result.ident,
        out: association.out,
        pred: association.pred,
        preselection: preselection,
        logistic: logistic
      }, {withCredentials: true})
  }

  // https://stackoverflow.com/questions/3115150/how-to-escape-regular-expression-special-characters-using-javascript
  escapeRegExp(text: string): string {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }



  resultDownload(resultId: number) {
    return this.http.get(this.api_url + 'download_result/?result_id=' + resultId, {withCredentials: true, observe:'response', responseType: 'blob'});
  }
}