import { Currency } from 'app/shared/models/general.model';

export interface DelinquencyRange {
  id: number;
  classification: string;
  minimumAgeDays: number;
}

export interface DelinquentData {
  availableDisbursementAmount: number;
  pastDueDays: number;
  nextPaymentDueDate: number[];
  delinquentDays: number;
  delinquentDate: number[];
  delinquentAmount: number;
  lastPaymentAmount: number;
  lastRepaymentAmount: number;
  delinquencyCalculationPaused: boolean;
  installmentLevelDelinquency?: InstallmentLevelDelinquency[];
}

export interface InstallmentLevelDelinquency {
  rangeId: number;
  classification: string;
  minimumAgeDays: number;
  delinquentAmount: number;
}

export interface LoanDelinquencyTags {
  id: number;
  loanId: number;
  delinquencyRange: DelinquencyRange;
  addedOnDate: number[];
  liftedOnDate: number[];
}

export interface LoanDelinquencyAction {
  id: number;
  action: string;
  startDate: number[];
  endDate: number[];
  createdById: number;
  createdOn: Date;
  updatedById: number;
  lastModifiedOn: Date;
}

export interface DelinquencyPausePeriod {
  active: boolean;
  pausePeriodStart: number[];
  pausePeriodEnd: number[];
}

export interface RepaymentSchedule {
  currency: Currency;
  loanTermInDays: number;
  totalPrincipalDisbursed: number;
  totalPrincipalExpected: number;
  totalPrincipalPaid: number;
  totalInterestCharged: number;
  totalFeeChargesCharged: number;
  totalPenaltyChargesCharged: number;
  totalWaived: number;
  totalWrittenOff: number;
  totalRepaymentExpected: number;
  totalRepayment: number;
  totalPaidInAdvance: number;
  totalPaidLate: number;
  totalOutstanding: number;
  totalCredits: number;
  periods: RepaymentSchedulePeriod[];
}

export interface RepaymentSchedulePeriod {
  dueDate: number[];
  principalDisbursed?: number;
  principalLoanBalanceOutstanding: number;
  feeChargesDue: number;
  feeChargesPaid: number;
  feeChargesOutstanding: number;
  totalOriginalDueForPeriod: number;
  totalDueForPeriod: number;
  totalPaidForPeriod: number;
  totalOutstandingForPeriod: number;
  totalOverdue?: number;
  totalActualCostOfLoanForPeriod: number;
  totalCredits: number;
  period?: number;
  fromDate?: number[];
  complete?: boolean;
  isAdditional?: boolean;
  downPaymentPeriod?: boolean;
  daysInPeriod?: number;
  principalOriginalDue?: number;
  principalDue?: number;
  principalPaid?: number;
  principalWrittenOff?: number;
  principalOutstanding?: number;
  interestOriginalDue?: number;
  interestDue?: number;
  interestPaid?: number;
  interestWaived?: number;
  interestWrittenOff?: number;
  interestOutstanding?: number;
  feeChargesWaived?: number;
  feeChargesWrittenOff?: number;
  penaltyChargesDue?: number;
  penaltyChargesPaid?: number;
  penaltyChargesWaived?: number;
  penaltyChargesWrittenOff?: number;
  penaltyChargesOutstanding?: number;
  totalPaidInAdvanceForPeriod?: number;
  totalPaidLateForPeriod?: number;
  totalWaivedForPeriod?: number;
  totalWrittenOffForPeriod?: number;
  totalInstallmentAmountForPeriod?: number;
}

export interface CrbIndividualData {
  individual_id: number;
  image?: string;
  surname?: string;
  forename1?: string;
  forename2?: string;
  forename3?: string;
  gender?: string;
  marital_status?: string;
  date_of_birth?: string;
  nationality?: string;
}

export interface CrbNonIndividualData {
  non_individual_id: number;
  business_name?: string;
  trading_name?: string;
  business_type?: string;
  industry?: string;
  date_registered?: string;
  activity_description?: string;
}

export interface CrbSectorData {
  id?: string;
  entity?: string;
  timestamp?: string;
  reference?: string;
  criteria?: string;
  search_value?: string;
  identification_type?: string;
  charge?: number;
  vat?: number;
  sector?: string;
  matches?: number;
  individuals?: CrbIndividualData[] | null;
  nonindividuals?: CrbNonIndividualData[] | null;
}

export interface CreditEnquiryResponse {
  message?: string;
  status?: number;
  count?: number;
  enquiry?: {
    id?: string;
    entity?: string;
    timestamp?: string;
    reference?: string;
    criteria?: string;
    search_value?: string;
    identification_type?: string;
    status?: string;
    cost?: number;
    vat?: number;
    charge?: number;
    formal?: CrbSectorData | null;
    informal?: CrbSectorData | null;
  };
}

export interface CreditEnquiryCheck {
  id: number;
  clientId: number;
  clientName: string;
  clientAccount: string;
  loanId: number;
  loanProductName?: string;
  loanAccount?: string;
  proposedPrincipal?: number;
  validationType?: any;
  requestType?: any;
  status?: any;
  consentStatus?: any;
  providerValidationId?: string;
  providerReference?: string;
  cost?: number;
  responsePayload?: string;
  createdAt?: any;
  completedAt?: any;
  responseDetails?: any;

  parsedResponse?: CreditEnquiryResponse | null;
  parseError?: boolean;
}

export interface CreditScoreEnquiry {
  ID?: string;
  Reference?: string;
  Entity?: string;
  Identifier?: string;
  Timestamp?: string;
}

export interface CreditScoreCustomer {
  Disputed?: string | null;
  Name?: string;
  Gender?: string;
  Date_of_Birth?: string;
  Age?: number;
}

export interface CreditScoreScoring {
  Period?: string;
  Band?: string;
  Rating?: string;
  Likelihood_to_Default?: string;
  Score?: number;
  Probability_of_Default_Percent?: number;
  Previous_Score?: number;
  History_Max_12Months?: { [period: string]: number };
}

export interface CreditApplicationSummary {
  Currency?: string;
  Count?: number;
  Value?: number;
}

export interface CreditApplications {
  Total_Applications?: CreditApplicationSummary[];
  Applications_12Months?: CreditApplicationSummary[];
  Pending_Applications?: CreditApplicationSummary[];
  Approved_Applications?: CreditApplicationSummary[];
  Rejected_Applications?: CreditApplicationSummary[];
  Cancelled_Applications?: CreditApplicationSummary[];
}

export interface CreditAccountValue {
  Currency?: string;
  Loan_Amount?: number;
  Loan_Balance?: number;
  Amount_Overdue?: number;
}

export interface MonthlyInstallment {
  Currency?: string;
  Count?: number;
  Amount?: number;
}

export interface CreditAccounts {
  Total_Accounts?: number;
  Total_Accounts_12Months?: number;
  Open_Accounts?: number;
  Open_Accounts_12Months?: number;
  Closed_Accounts?: number;
  Closed_Accounts_12Months?: number;
  Adverse_Accounts?: number;
  Adverse_Accounts_12Months?: number;
  Worst_Active_Days_in_arrears?: number;
  Worst_Days_in_Arrears?: number;
  Worst_Days_in_arrears_12Months?: number;
  Total_Value?: CreditAccountValue[];
  Monthly_Installment?: MonthlyInstallment[];
  Value_12Months?: CreditAccountValue12MonthsData[];
}

export interface CreditAccountValue12MonthsData{
  Currency?: string;
  Loan_Amount_12Months?: number;
  Payment_12Months?: number;
  Loan_Balance_12Months?: number;
  Amount_Overdue_12Months?: number;

}

export interface CollateralMaterial {
  Currency?: string;
  Items?: number;
  Value?: number;
}

export interface CollateralGuarantor {
  Currency?: string;
  Accounts?: number;
  Loan_Amount?: number;
  Loan_Balance?: number;
}

export interface BouncedCheque {
  Currency?: string;
  Cheques?: number;
  Value?: number;
}

interface FinancialFraud {
  Currency?: string;
  Cases?: number;
  Loss_Amount?: number;
}

export interface CreditScoreCost {
  Currency?: string;
  Amount?: number;
}

export interface CreditScoreError {
  Code?: string;
  Message?: string;
}

export interface CrbScore {
  Customer?: CreditScoreCustomer;
  Scoring?: CreditScoreScoring;
  Credit_Applications?: CreditApplications;
  Credit_Accounts?: CreditAccounts;
  Collateral_Material?: CollateralMaterial[];
  Collateral_Guarantor?: CollateralGuarantor[];
  Bounced_Cheques?: BouncedCheque[];
  Financial_Fraud?: FinancialFraud[];
  Cost?: CreditScoreCost;
  Errors?: CreditScoreError | null;
}

export interface MnoCustomerData {
  Category?: string;
  Name?: string;
  Gender?: string;
  Date_of_Birth?: string;
  Age?: number;
  Months_Active?: number;
  Phone_Count?: number;
  Phone_Numbers?: MnoPhoneNumberData[];
}

export interface MnoPhoneNumberData{
  msisdn?: string;
  status?: string;
}

export interface Scoring{
  Period?: string;
  Band?: string;
  Rating?: string;
  Likelihood_to_Default?: string;
  Probability_of_Default_Percent?: number;
  Previous_Score?: number;
  Score?: number;
}

export interface MnoCreditAccountsData{
  Months_Active?: string;
  Accounts_12Months?: string;
  Total_Loan_Amount_12Months?: string;
  Closed_Accounts_12Months?:string;
  Total_Payment_12Months?: string;
  Accounts_6Months?: string;
  Total_Loan_Amount_6Months?: string;
  Closed_Accounts_6Months?: string;
  Total_Payment_6Months?:string;

}

export interface MnoIncomeProxyData{
  //individual
  Total_Turnover_Count_6Months?: number;
  Monthly_Turnover_Amount?: number;
  Total_Spend_Count_6Months?: number;
  Monthly_Spend_Amount?: number;
  Total_Turnover_Count_3Months?: number;
  Monthly_Turnover_Amount_3Months?: number;
  Total_Spend_Count_3Months?: number;
  Monthly_Spend_Amount_3Months?: number;

  //agent
  Monthly_Float_Purchased?: number;
  Monthly_Commission_Earned?: number;

  //merchant
  Total_Inflow_Count_6Months?: number;
  Monthly_Inflow_Amount?: number;

}

export interface MnoScore {
  Customer?: MnoCustomerData;
  Scoring?: Scoring;
  Credit_Accounts?: MnoCreditAccountsData;
  Income_Proxy?: MnoIncomeProxyData;
  Cost?: CreditScoreCost;
  Errors?: CreditScoreError | null;
}

export interface CreditScoreProviderData {
  Enquiry?: CreditScoreEnquiry;
  MNO?: MnoScore | null;
  CRB?: CrbScore | null;
  Cost?: {
    Currency?: string;
    Amount?: number;
    Charge?: number;
    VAT?: number;
  };
}

export interface CreditScoreResponse {
  message?: string;
  status?: number;
  count?: number;
  data?: CreditScoreProviderData;
}

export interface CreditScoreAttempt {
  id: number;
  clientId?: number;
  clientName?: string;
  clientAccount?: string;
  loanId?: number;
  loanProductName?: string;
  loanAccount?: string;
  proposedPrincipal?: number;
  validationType?: any;
  requestType?: any;
  status?: any;
  consentStatus?: any;
  providerValidationId?: string;
  providerReference?: string;
  cost?: number;
  responsePayload?: string;
  createdAt?: number[];
  completedAt?: number[];
  responseDetails?: any;

  parsedResponse?: CreditScoreResponse | null;
  parseError?: boolean;
}


export interface CreditReportJsonResponse {
  message?: string;
  status?: number;
  count?: number;
  credit_information?: CreditInformation;
}

export interface CreditInformation {
  identification_details?: IdentificationDetail[];
  customer_details?: CustomerDetails;
  physical_address_history?: PhysicalAddress[];
  postal_address_history?: PostalAddress[];
  contact_history?: ContactHistory;
  shareholder_details?: ShareholderDetail[];
  employment_history?: EmploymentHistory[];
  scoring_details?: ScoringDetails;

  credit_applications_summary?: Record<string, unknown>[];
  credit_accounts_summary?: Record<string, unknown>[];
  credits_accounts_classification_summary?: CreditAccountsClassification[];
  collateral_material_summary?: Record<string, unknown>[];
  collateral_guarantor_summary?: Record<string, unknown>[];
  bounced_cheques_summary?: Record<string, unknown>[];
  financial_fraud_summary?: Record<string, unknown>[];

  credit_applications_details?: CreditApplicationDetail[];
  credit_account_details?: CreditAccountDetail[];
  collateral_material_details?: CollateralMaterialDetail[];
  collateral_guarantor_details?: CollateralGuarantorDetail[];
  bounced_cheques_details?: BouncedChequeDetail[];
  financial_fraud_details?: FinancialFraudDetail[];
  enquiries_details?: EnquiryDetail[];
}

export interface IdentificationDetail {
  SNo?: number;
  Identifier?: string;
  Identifier_Type?: string;
  Country_of_Issue?: string;
}

export interface CustomerDetails {
  Photo?: string;
  Name?: string;
  Date_of_Birth?: string;
  Marital_Status?: string;
  Gender?: string;
  Nationality?: string;
  Contact?: string;
  Address?: string;
}

export interface PhysicalAddress {
  SNo?: number;
  Address?: string;
  Ownership?: string;
  Period_at_Address?: string;
}

export interface PostalAddress {
  SNo?: number;
  address?: string;
}

export interface ContactHistory {
  Phone_Numbers?: PhoneNumber[];
  Emails?: Email[];
}

export interface PhoneNumber {
  SNo?: number;
  Phone_Number?: string;
}

export interface Email {
  SNo?: number;
  Email?: string;
}

export interface ShareholderDetail {
  SNo?: number;
  Business_Name?: string;
  stakeholderType?: string;
  Stakeholder_Category?: string;
  Shareholder_Percentage?: string;
}

export interface EmploymentHistory {
  SNo?: number;
  Employer_Name?: string;
  Occupation?: string;
  Employment_Date?: string;
  Income_Band?: string;
}

export interface ScoringDetails {
  Evaluation_Period?: string;
  Current_Score_Band?: string;
  Current_Score_Rating?: string;
  Probability_of_Default?: string;
  Likelihood_to_Default?: string;
  Current_Score?: number;
  Score_Explanation?: string[];
  Score_History?: ScoreHistory[];
}

export interface ScoreHistory {
  MonthYear?: string;
  Score?: string;
}

export interface CreditAccountsClassification {
  Institution_Type?: string;
  Currency?: string;
  No_of_Accounts?: number;
  Loan_Amount?: number;
  Loan_Balance?: number;
}

export interface CreditApplicationDetail {
  SNo?: number;
  Institution?: string;
  Reference?: string;
  Product_Type?: string;
  Application_Date?: string;
  Currency?: string;
  Amount?: string;
  Application_Status?: string;
  Last_Status_Date?: string;
}

export interface CreditAccountDetail {
  SNo?: number;
  Number_of_Payments?: number;
  Institution?: string;
  Term?: string;
  Loan_Purpose?: string;
  Client_Number?: string;
  Borrower_Classification?: string;
  First_Payment_Date?: string;
  Credit_Account_Reference?: string;
  Amortization_Type?: string;
  Type_of_Interest?: string;

  Annual_Interest_Rate_at_Disbursement?: number;
  Credit_Amount?: number;
  Facility_Amount?: number;
  Monthly_Installment_Amount?: number;
  Provision_Amount?: number;

  Credit_Account_Date?: string;
  Interest_Calculation_Method?: string;
  Payment_Frequency?: string;
  Currency?: string;
  Credit_Account_Type?: string;
  Group_ID?: string;
  Client_Consented?: string;
  Maturity_Date?: string;
  Client_Given_Notice?: string;

  Last_Transaction?: LastTransaction[];
  Credit_Cycle_12_Months?: CreditCycle[];
}

export interface LastTransaction {
  Transaction_Date?: string;
  Currency?: string;
  Last_Payment_Date?: string;
  Closure_Reason?: string;
  Closure_Date?: string;
  Last_Status_Change_Date?: string;
  Arrears_Date?: string;
  Restructured_Credit?: string;
  Account_Status?: string;
  Risk_Classification?: string;

  Last_Payment_Amount?: number;
  Current_Balance_Amount?: number;
  Balance_Overdue?: number;
  Annual_Interest_Rate_at_Reporting?: number;
  Days_in_Arrears?: number;
}

export interface CreditCycle {
  Month?: string;
  Year?: string;
  Days_in_Arrears?: string;
  Risk_Classification?: string;
  Account_Status?: string;
}

export interface CollateralMaterialDetail {
  SNo?: number;
  Held_By?: string;
  Client_Number?: string;
  Valuation_Date?: string;
  Account_Number?: string;
  Expiry_Date?: string;
  Classification?: string;
  Currency?: string;
  Open_Market_Value?: number;
  Forced_Sale_Value?: number;
  Maturity_Date?: string;
  Reference?: string;
  Instrument_of_Claim?: string;
  Description?: string;
}

export interface CollateralGuarantorDetail {
  SNo?: number;
  Institution?: string;
  Currency?: string;
  Reference?: string;
  Maturity_Date?: string;
  Credit_Account_Date?: string;
  Credit_Account_Status?: string;
  Amount_Guaranteed?: number;
  Current_Balance_Amount?: number;
}

export interface BouncedChequeDetail {
  SNo?: number;
  Cheque_Number?: number;
  Amount?: number;
  Institution?: string;
  Reference?: string;
  Bounced_Date?: string;
  Beneficiary?: string;
  Currency?: string;
  Reason?: string;
}

export interface FinancialFraudDetail {
  SNo?: number;
  Institution?: string;
  Category?: string;
  Subcategory?: string;
  Currency?: string;
  Incident_Date?: string;
  Loss_Amount?: number;
}

export interface EnquiryDetail {
  SNo?: number;
  Count?: number;
  Institution?: string;
  Reason?: string;
  Timestamp?: string;
}


export interface CrbCreditReportCheck {
  id: number;

  clientName?: string;
  clientAccount?: string;
  loanAccount?: string;
  loanProductName?: string;

  validationType?: any;
  requestType?: any;
  status?: any;
  consentStatus?: any;

  providerValidationId?: string;
  providerReference?: string;

  cost?: number;
  responsePayload?: string;

  reportToken?: string;
  reportUrl?: string;

  createdAt?: string;
  completedAt?: string;

  parsedResponse?: CreditReportJsonResponse | null;
  parseError?: boolean;
}

