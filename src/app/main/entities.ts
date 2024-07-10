export class Variable {
  [key: string]: string | number | boolean | any;
  ident: number;
  name: string;
  type: string;
  //summary stats
  mean: number;
  variance: number;
  skewnessTest: number;
  kurtosisTest: number;
  normalTest : number;
  transform: string;
  binary_transform: string[];
  missing: number;
  nbOfValues: number;
  dataDistribution: any;
  excluded: boolean;
  //the roles for AS
  outcome: boolean;
  predictor: boolean;
  covariate: boolean;
  confounder: boolean;
  // removed when sending to backend
  rank: number;
  missingP: number;
  excludedBcMissing: boolean;
  dataDistributionPostQC: any;
  shrinked: boolean;
  isExcludedBcLCR: boolean;
}

export class Analyse {
  completed: boolean = false;
  error?: any;
  progress: any;
  result: any[] = [];
  warnings: any[] = [];
}

export class Association {
  varExplained: any;
  value: any;
  _row: any;
  name: any;
  /** variable used to toggle row on the charts */
  view: boolean = false;
}

export interface ResultElement {
  MAbeta: number;
  MAp: number;
  MAse: number;
  MCbeta: number;
  MCp: number;
  MCse: number;
  name: number | string;
  out: string;
  pred: string;
  r: number;
  radius: number;
  series: string;
  value: number;
  x: number;
  y: number;
}

export class Result {
  ident!: number;
  projectId!: number;
  dtId! : number;
  qcId!: number;
  asId!: number;
  created!: string;
  updated!: string;
  status!: number;
}

export class Summary {
  nominally: any[] = [];
  Pvalue!: number;
  nominallySignificantAssoc = 0;
  total!: number;
  nominallyLimit = 0.05;
  bonferroni = 0;
  displayedColumns = ['outcome', 'predictor', 'm1', 'm2'];
}

export class As {
  ident!: number;
  projectId!: number;
  dtId! : number;
  qcId!: number;
  name!: string;
  testMusicalChair: boolean = true;
  testStandard: boolean = true;
  preselection: boolean = false;
  logistic: boolean = false;
  imputation!: string;
  created!: string;
  updated!: string;
  minTotSample!: number;
  sigmaMax!: number;
  dweight!: number;
  result: Result[] = [];
}

export interface SelectedVariables {
  outcome: string[];
  predictor: string[];
  confounder: string[];
  covariate: string[];
}
 
export class Qc {
  ident!: number;
  projectId!: number;
  dtId! : number;
  name!: string;
  lowCountRule!: number;
  outliersChoose!: string;
  distanceMean!: number;
  pvalueNormality!: number;
  missingThreshold!: number;
  created!: string;
  updated!: string;
  analysisSetting: As[] = [];
  /**
   * count the variables impacted by missing data rule
   */
  tooManyMissingCount!: number;
  /**
   * array of Ids of variables excluded because of the low count rule;
   * it's useful so that we don't have to do the shrinking in the Java code.
   */
  excludedLowCountRule: number[]; //= []
  /**
   * count the variables impacted by Low Count Rule
   */
  lowCountRuleCount!: number;
  /**
   * variables before QC
   */
  dataSummaryPreQc: any;
  /**
   * number of variable still included after QC
   */
  numberOfVariablePostQc: any;
  dataSummaryPostQc: any;
  totalMissing!: number;
  /**
   * count the varables with variance null
   */
  noVarianceCount!: number;
  /**
   * count the variables impacted by at least one rule
   */
  ruleCount!: number;
  cmsScoreQC: number;
}


export class Dt {
  ident!: number;
  projectId!: number;
  name!: string;
  created!: string;
  updated!: string;
  qualityControl: Qc[] = [];
}

export class Project {
  ident!: number;
  name!: string;
  description!: string;
  created!: string;
  updated!: string;
  sampleSize!: number;
  numberOfVariable!: number;
  numberOfMissingValues!: number;
  cmsScore: number;
  dataSummary!: string;
  dataTransformation: Dt[] = [];
}

export interface User {
  registered: boolean;
}
