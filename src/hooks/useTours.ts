import { useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { atomWithMutation } from 'jotai-tanstack-query'
import { Client } from 'lib/baseUrlClient'
import { pickErrorMessage, pickResult } from 'lib/client'
import { showToast } from 'utils/toastHelper'

const getAllPropertyTours = () => {
  return Client.get(`property/get/tour-schedules`).then(
    pickResult,
    pickErrorMessage
  )
}

export const useFetchAllTours = () => {
  return useQuery({
    queryKey: ['GET_ALL_TOURS'],
    queryFn: () => getAllPropertyTours()
  })
}

const getFuturePropertyTours = () => {
  return Client.get(`property/user/future/tours`, {
    headers: {
      role: 'agent'
    }
  }).then(pickResult, pickErrorMessage)
}

export const useFetchFutureTours = () => {
  return useQuery({
    queryKey: ['GET_FUTURE_TOURS'],
    queryFn: () => getFuturePropertyTours()
  })
}

const scheduleATour = async (body) => {
  return await Client.post(`property/schedule/tour`, {
    body: JSON.stringify(body),
    headers: {
      role: 'seller'
    }
  }).then(pickResult, pickErrorMessage)
}

const postScheduleATour = atomWithMutation(() => ({
  mutationKey: ['posts'],
  mutationFn: scheduleATour,
  onSuccess(data) {
    showToast('success', data.message)
  }
}))

export const useScheduleATour = () => {
  const [{ mutate: mutateScheduleATour, status, data }] =
    useAtom(postScheduleATour)

  return [{ mutateScheduleATour, status, data }]
}
