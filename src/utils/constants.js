import AnnualTuberculosisForm from '@/component/shared/Forms/AnnualTuberculosisForm'
import BackgroundReleaseForm from '@/component/shared/Forms/BackgroundReleaseForm'
import BeneficiaryDesignationForm from '@/component/shared/Forms/BeneficiaryDesignationForm'
import CandidateInterviewForm from '@/component/shared/Forms/CandidateInterviewForm'
import CobraTerminationForm from '@/component/shared/Forms/CobraTerminationForm'
import ConfidentialityAgreementForm from '@/component/shared/Forms/ConfidentialityAgreementForm'
import ConfirmationVerbalForm from '@/component/shared/Forms/ConfirmationVerbalForm'
import DirectDepositAuthorization from '@/component/shared/Forms/DirectDepositAuthorization'
import DisciplinarCounselingForm from '@/component/shared/Forms/DisciplinarCounselingForm'
import DrugTestingReasonableForm from '@/component/shared/Forms/DrugTestingReasonableForm'
import EmployeeAgreementForm from '@/component/shared/Forms/EmployeeAgreementForm'
import EmployeeApplicationForm from '@/component/shared/Forms/EmployeeApplicationForm'
import EmployeeAttestationForm from '@/component/shared/Forms/EmployeeAttestationForm'
import EmployeeEmergencyForm from '@/component/shared/Forms/EmployeeEmergencyForm'
import EmployeeHandbookForm from '@/component/shared/Forms/EmployeeHandbookForm'
import EmployeePhysicalForm from '@/component/shared/Forms/EmployeePhysicalForm'
import EmployeeSalaryForm from '@/component/shared/Forms/EmployeeSalaryForm'
import EmployeeSatisfactionForm from '@/component/shared/Forms/EmployeeSatisfactionForm'
import EmployeeTimeSheetForm from '@/component/shared/Forms/EmployeeTimeSheetForm'
import EmployeeWithholdingCertificate from '@/component/shared/Forms/EmployeeWithholdingCertificate'
import FCRAAuthorizationForm from '@/component/shared/Forms/FCRAAuthorizationForm'
import HepatitisBimmunizationNewForm from '@/component/shared/Forms/HepatitisBimmunizationNewForm'
import IndependentContractorForm from '@/component/shared/Forms/IndependentContractorForm'
import JobOfferLetterForm from '@/component/shared/Forms/JobOfferLetterForm'
import NonCompeteNonSocialization from '@/component/shared/Forms/NonCompeteNonSocialization'
import NoticeOfNoncomplianceForm from '@/component/shared/Forms/NoticeOfNoncomplianceForm'
import NoticeToEmployeeForm from '@/component/shared/Forms/NoticeToEmployeeForm'
import PaidTimeOffLeaveForm from '@/component/shared/Forms/PaidTimeOffLeaveForm'
import PerformanceAppraisalForm from '@/component/shared/Forms/PerformanceAppraisalForm'
import PerformanceImprovementForm from '@/component/shared/Forms/PerformanceImprovementForm'
import RequestForCoronavirusRelatedForm from '@/component/shared/Forms/RequestForCoronavirusRelatedForm'
import RequestForEmploymentForm from '@/component/shared/Forms/RequestForEmploymentForm'
import RequestForTaxpayerForm from '@/component/shared/Forms/RequestForTaxpayerForm'
import ReturnOfCompanyForm from '@/component/shared/Forms/ReturnOfCompanyForm'
import TerminationForCauseForm from '@/component/shared/Forms/TerminationForCauseForm'
import TerminationNoticeForm from '@/component/shared/Forms/TerminationNoticeForm'
import TerminationWithoutCauseForm from '@/component/shared/Forms/TerminationWithoutCauseForm'
import TotalCompensationStatement from '@/component/shared/Forms/TotalCompensationStatement'
import UnpaidLeaveForm from '@/component/shared/Forms/UnpaidLeaveForm'

export const preventMaxInput = (e, limit) => {
  e.target.value = e.target.value.trimStart()
  e.target.value = e.target.value.replace(/  +/g, ' ')
  if (e.target.value.length > limit) {
    e.target.value = e.target.value.slice(0, limit)
  }
}

export const validationRules = {
  email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  password: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$/,
  passwordMessage:
    'Password must contain uppercase and lowercase characters, numbers, special character and must be minimum 8 character long.',
  characters: /^[a-zA-Z_ ]*$/,
  charactersMessage: 'Only alphabets are allowed.',
  numbers: /^[0-9]*$/,
  removeWhitespace: /^[a-zA-Z0-9]+$/,
  numberNew: /^[0-9]*$/,
  numberWithDot: /^\d*(\.\d{0,10})?$/
}

export const validateFile = file => {
  const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png']
  if (!supportedTypes.includes(file.type)) {
    return 'Only jpeg, jpg, and png are supported'
  }
  return ''
}

export const sideBarObjHeader = {
  dashboard: 'Dashboard',
  profile: 'My Account',
  forms: 'Forms',
  JobApplied: 'Job Applied',
  leaves: 'Leaves',
  paySlip: 'Pay Slip'
}

export const handleKeyDown = event => {
  if (
    !['Backspace', 'Delete', 'Tab'].includes(event.key) &&
    !/[0-9]/.test(event.key)
  ) {
    event.preventDefault()
  }
}

export const formCategory = [
  {
    id: 1,
    formType: 'employee_survey_exit',
    title: 'Employee survey',
    formComponent: EmployeeSalaryForm
  },
  {
    id: 2,
    formType: 'employee_application',
    title: 'Employee application',
    formComponent: EmployeeApplicationForm
  },
  {
    id: 3,
    formType: 'employee_agreement',
    title: 'Employee agreement',
    formComponent: EmployeeAgreementForm
  },
  {
    id: 4,
    formType: 'candidate_interview',
    title: 'Candidate interview',
    formComponent: CandidateInterviewForm
  },
  {
    id: 5,
    formType: 'employee_emergency',
    title: 'Employee emergency',
    formComponent: EmployeeEmergencyForm
  },
  {
    id: 6,
    formType: 'employee_physical',
    title: 'Employee physical',
    formComponent: EmployeePhysicalForm
  },
  {
    id: 7,
    formType: 'hepatitis_bimmunization',
    title: 'Hepatitis bimmunization',
    formComponent: HepatitisBimmunizationNewForm
  },
  {
    id: 8,
    formType: 'job_offer_letter',
    title: 'Job offer letter',
    formComponent: JobOfferLetterForm
  },
  {
    id: 9,
    formType: 'request_for_employment',
    title: 'Request for employment',
    formComponent: RequestForEmploymentForm
  },
  {
    id: 10,
    formType: 'background_release',
    title: 'Background release',
    formComponent: BackgroundReleaseForm
  },
  {
    id: 11,
    formType: 'direct_deposit_authorization',
    title: 'Direct deposit authorization',
    formComponent: DirectDepositAuthorization
  },
  {
    id: 12,
    formType: 'employee_handbook',
    title: 'Employee handbook',
    formComponent: EmployeeHandbookForm
  },
  {
    id: 13,
    formType: 'beneficiary_designation',
    title: 'Beneficiary designation',
    formComponent: BeneficiaryDesignationForm
  },
  {
    id: 14,
    formType: 'cobra_termination',
    title: 'Cobra termination',
    formComponent: CobraTerminationForm
  },
  {
    id: 15,
    formType: 'confidentiality_agreement',
    title: 'Confidentiality agreement',
    formComponent: ConfidentialityAgreementForm
  },
  {
    id: 16,
    formType: 'employee_attestation',
    title: 'Employee attestation',
    formComponent: EmployeeAttestationForm
  },
  {
    id: 17,
    formType: 'paid_time_off_leave',
    title: 'Paid time off leave',
    formComponent: PaidTimeOffLeaveForm
  },
  {
    id: 18,
    formType: 'notice_to_employee',
    title: 'Notice to employee',
    formComponent: NoticeToEmployeeForm
  },
  {
    id: 19,
    formType: 'notice_of_non_compliance',
    title: 'Notice of non compliance',
    formComponent: NoticeOfNoncomplianceForm
  },
  {
    id: 20,
    formType: 'non_compete_non_soliciation',
    title: 'Non compete non soliciation',
    formComponent: NonCompeteNonSocialization
  },
  {
    id: 21,
    formType: 'FCRA_authorization',
    title: 'FCRA authorization',
    formComponent: FCRAAuthorizationForm
  },
  {
    id: 22,
    formType: 'employee_time_sheet',
    title: 'Employee time sheet',
    formComponent: EmployeeTimeSheetForm
  },
  {
    id: 23,
    formType: 'employee_satisfaction',
    title: 'Employee satisfaction',
    formComponent: EmployeeSatisfactionForm
  },
  {
    id: 24,
    formType: 'drug_testing_reasonable',
    title: 'Drug testing reasonable',
    formComponent: DrugTestingReasonableForm
  },
  {
    id: 25,
    formType: 'annual_tuber_culosis',
    title: 'Annual tuber culosis',
    formComponent: AnnualTuberculosisForm
  },
  {
    id: 26,
    formType: 'confirmation_verbal',
    title: 'Confirmation verbal',
    formComponent: ConfirmationVerbalForm
  },
  {
    id: 27,
    formType: 'disciplinar_counseling',
    title: 'Disciplinar counseling',
    formComponent: DisciplinarCounselingForm
  },
  {
    id: 28,
    formType: 'non_compete_non_socialization',
    title: 'Non compete non socialization',
    formComponent: NonCompeteNonSocialization
  },
  {
    id: 29,
    formType: 'performance_appraisal',
    title: 'Performance appraisal',
    formComponent: PerformanceAppraisalForm
  },
  {
    id: 30,
    formType: 'request_for_corona_virus',
    title: 'Request for corona virus related',
    formComponent: RequestForCoronavirusRelatedForm
  },
  {
    id: 31,
    formType: 'return_of_company',
    title: 'Return of company',
    formComponent: ReturnOfCompanyForm
  },
  {
    id: 32,
    formType: 'termination_for_cause',
    title: 'Termination for cause',
    formComponent: TerminationForCauseForm
  },
  {
    id: 33,
    formType: 'termination_notice',
    title: 'Termination notice',
    formComponent: TerminationNoticeForm
  },
  {
    id: 34,
    formType: 'termination_without_cause',
    title: 'Termination without cause',
    formComponent: TerminationWithoutCauseForm
  },
  {
    id: 35,
    formType: 'total_compensation_statement',
    title: 'Total compensation statement',
    formComponent: TotalCompensationStatement
  },
  {
    id: 36,
    formType: 'unpaid_leave',
    title: 'Unpaid leave',
    formComponent: UnpaidLeaveForm
  },
  {
    id: 37,
    formType: 'request_for_taxpayer',
    title: 'Request For Taxpayer',
    formComponent: RequestForTaxpayerForm
  },
  {
    id: 38,
    formType: 'performance_improvement',
    title: 'Performance Improvement',
    formComponent: PerformanceImprovementForm
  },
  {
    id: 39,
    formType: 'employee_with_holding_certificate',
    title: 'Employee With holding certificate',
    formComponent: EmployeeWithholdingCertificate
  },
  {
    id: 40,
    formType: 'independent_contractor',
    title: 'Independent contractor',
    formComponent: IndependentContractorForm
  }
]
