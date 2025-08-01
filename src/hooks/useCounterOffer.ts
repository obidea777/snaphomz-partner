import { useAtom } from 'jotai'
import { atomWithMutation } from 'jotai-tanstack-query'
import { Client } from 'lib/baseUrlClient'
import { pickErrorMessage, pickResult } from 'lib/client'
import { showToast } from 'utils/toastHelper'

type IApiFormat = {
  offerPrice: { amount: number; currency: string }
  financeType: string
}

const createCounterOffer = async ({ id, body }: { id: string; body: any }) => {
  return await Client.post(`property/agent/create/counter-offer/${id}`, {
    body: JSON.stringify(body)
  }).then(pickResult, pickErrorMessage)
}

const postCounterOffer = atomWithMutation(() => ({
  mutationKey: ['CREATE_COUNTER_OFFER'],
  mutationFn: createCounterOffer,
  onSuccess(data) {
    showToast('success', data.message)
  }
}))

export const useCreateCounterOffer = () => {
  const [{ mutate: mutateCounterOffer, status, data }] =
    useAtom(postCounterOffer)

  return [{ mutateCounterOffer, status, data }]
}
