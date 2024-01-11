export enum SwStateStep {
  /** 线路选择 */
  step1,
  /** 站点选择 */
  step2,
  /** 结果页面 */
  Step3,
}

export interface StepSchemaRes {
  nextStep: () => void;
  nextTitle: React.ReactNode;
  navTitle: React.ReactNode;
}
