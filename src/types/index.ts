export interface IDCardConfig {
  programmeName: string;
  intake: string;
  customIntake: string;
  academicYear: string;
  partnerLogoUrl: string;
  partnerLogoData: string | null;
  partnerLogoName: string;
  numberOfCards: number;
  idPrefix: string;
  startNumber: number;
  showBarcode: boolean;
  issueDate: string;
  validUntil: string;
}

export interface GenerationProgress {
  isGenerating: boolean;
  step: number;
  message: string;
  percentage: number;
  error: string | null;
  isComplete: boolean;
}
