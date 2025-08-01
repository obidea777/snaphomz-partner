import { useAtom } from 'jotai'
import { atomWithMutation } from 'jotai-tanstack-query'
import { Client } from 'lib/baseUrlClient'
import { pickErrorMessage, pickResult } from 'lib/client'
import { showToast } from 'utils/toastHelper'

const publishProperty = async ({ id, body }: { id: string; body: any }) => {
  return await Client.put(`property/publish-property/${id}`, {
    body: JSON.stringify(body),
    headers: {
      role: 'seller'
    }
  }).then(pickResult, pickErrorMessage)
}

const putPublishProperty = atomWithMutation(() => ({
  mutationKey: ['PUBLISH_PROPERTY'],
  mutationFn: publishProperty,
  onSuccess(data) {
    showToast('success', data.message)
  }
}))

export const usePublishProperty = () => {
  const [{ mutate: mutatePublishProperty, status, data }] =
    useAtom(putPublishProperty)

  return [{ mutatePublishProperty, status, data }]
}
