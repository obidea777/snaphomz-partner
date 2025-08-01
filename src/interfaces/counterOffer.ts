import * as yup from 'yup'

export const schema = yup.object().shape({
  offerPrice: yup.number().required(),
  downPayment: yup.number().required(),
  expirationDate: yup.string().required(),
  expirationTime: yup.string().required(),
  financeType: yup.string().required(),
  financeContingency: yup.number().required(),
  appraisalContingency: yup.number().required(),
  inspectionContingency: yup.number().required(),
  closeEscrow: yup.number().required(),
  specialTerms: yup.string(),
  note: yup.string()
})
