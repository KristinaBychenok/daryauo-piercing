import { RootState } from '../../store/store'
import {
  ChangeEventHandler,
  MouseEventHandler,
  useCallback,
  useMemo,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  addName,
  addPhone,
  addEmail,
  addStudio,
  addService,
  addDate,
  addTime,
  addServiceType,
  addMessage,
  clearForm,
  addAcceptAgreement,
  addAppointmentId,
} from './form.slice'
import { Dayjs } from 'dayjs'
import { DateTime } from '../../store/index.types'
import {
  deleteAppointment,
  editAppointment,
  fetchSchedule,
  postAppointment,
} from '../../helpers/fetch.helpers'
import { addLoadedData } from '../../store/index.slice'
import { setIsLoading, setIsModalOpen } from '../../store/settings.slice'
import {
  checkRegExpField,
  emailRegExp,
  getDeletedTimes,
  getServiceTypes,
  getServices,
  getTimes,
  nameRegExp,
  phoneRegExp,
} from './form.helpers'
import { useRouter } from 'next/router'
import { useTranslations } from 'next-intl'

export const useChangeFormHook = (isEdit: boolean, appointmentId?: string) => {
  const bookingForm = useSelector(
    (state: RootState) => state.bookingForm.bookingData
  )
  const backup = useSelector((state: RootState) => state.bookingForm.backup)
  const isLoading = useSelector((state: RootState) => state.settings.isLoading)

  const dispatch = useDispatch()
  const { locale, push } = useRouter()

  const handleChangeName: ChangeEventHandler<HTMLInputElement> = useCallback(
    (value) => {
      const isValid = value.target.value
        ? checkRegExpField(value.target.value, nameRegExp) &&
          value.target.value.length <= 50
        : true
      dispatch(addName({ value: value.target.value, isValid }))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const handleChangePhone: ChangeEventHandler<HTMLInputElement> = useCallback(
    (value) => {
      const isValid = value.target.value
        ? checkRegExpField(value.target.value, phoneRegExp) &&
          value.target.value.length <= 12
        : true
      dispatch(addPhone({ value: value.target.value, isValid }))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
  const handleChangeEmail: ChangeEventHandler<HTMLInputElement> = useCallback(
    (value) => {
      const isValid = value.target.value
        ? checkRegExpField(value.target.value, emailRegExp) &&
          value.target.value.length <= 50
        : true
      dispatch(addEmail({ value: value.target.value, isValid }))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
  const handleSelectServiceType: ChangeEventHandler<HTMLInputElement> =
    useCallback((value) => {
      dispatch(addServiceType(value.target.value))
      dispatch(addService(''))
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  const handleSelectService: ChangeEventHandler<HTMLInputElement> = useCallback(
    (value) => {
      dispatch(addService(String(value.target.value)))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
  const handleSelectStudio: ChangeEventHandler<HTMLInputElement> = useCallback(
    async (value) => {
      dispatch(addStudio(value.target.value))
      if (bookingForm.date) {
        dispatch(addDate(''))
      }
      if (bookingForm.time) {
        dispatch(addTime(''))
      }
      const loadedData: DateTime[] | undefined = await fetchSchedule(
        value.target.value
      )
      dispatch(addLoadedData(loadedData || []))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bookingForm.date, bookingForm.time]
  )
  const handleChangeDate = useCallback((date: Dayjs) => {
    dispatch(addDate(date.format('YYYY-MM-DD')))
    dispatch(addTime(''))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const handleChangeTime: ChangeEventHandler<HTMLInputElement> = useCallback(
    (value) => {
      if (!bookingForm.date || !bookingForm.service) {
        return
      }
      dispatch(addTime(value.target.value))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bookingForm.date, bookingForm.service]
  )
  const handleChangeMessage: ChangeEventHandler<HTMLInputElement> = useCallback(
    (value) => {
      const isValid = value.target.value
        ? value.target.value.length <= 500
        : true
      dispatch(addMessage({ value: value.target.value, isValid }))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
  const handleChangeAcceptAgreement: ChangeEventHandler<HTMLInputElement> =
    useCallback(
      (value) => {
        dispatch(addAcceptAgreement())
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    )

  const handleSubmitForm: MouseEventHandler<HTMLButtonElement> =
    useCallback(async () => {
      dispatch(setIsLoading(true))
      const result: { number_appointment: string } = await postAppointment(
        {
          name: bookingForm.name,
          phone: bookingForm.phone,
          email: bookingForm.email,
          studio: bookingForm.studio,
          serviceType: bookingForm.serviceType,
          service: bookingForm.service,
          date: bookingForm.date,
          time: bookingForm.time,
          message: bookingForm.message,
        },
        locale || 'en'
      )
      if (!!result.number_appointment) {
        dispatch(setIsModalOpen(true))
        dispatch(addAppointmentId(result.number_appointment))
        dispatch(setIsLoading(false))
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      bookingForm.date,
      bookingForm.email,
      bookingForm.message,
      bookingForm.name,
      bookingForm.phone,
      bookingForm.service,
      bookingForm.serviceType,
      bookingForm.studio,
      bookingForm.time,
      locale,
    ])

  const isBookButtonDisable = useMemo(() => {
    const isBookingFormInvalid =
      !bookingForm.name.value ||
      !bookingForm.name.isValid ||
      !bookingForm.phone.value ||
      !bookingForm.phone.isValid ||
      !bookingForm.email.value ||
      !bookingForm.email.isValid ||
      !bookingForm.service ||
      !bookingForm.serviceType ||
      !bookingForm.studio ||
      !bookingForm.date ||
      !bookingForm.time ||
      !bookingForm.message.isValid

    const rescheduleFormInvalid =
      isBookingFormInvalid ||
      (bookingForm.service === backup.service &&
        bookingForm.studio === backup.studio &&
        bookingForm.date === backup.date &&
        bookingForm.time === backup.time &&
        bookingForm.message.value === backup.message.value)

    return isEdit
      ? rescheduleFormInvalid
      : isBookingFormInvalid || !bookingForm.acceptAgreement
  }, [
    backup.date,
    backup.message?.value,
    backup.service,
    backup.studio,
    backup.time,
    bookingForm.acceptAgreement,
    bookingForm.date,
    bookingForm.email.isValid,
    bookingForm.email.value,
    bookingForm.message.isValid,
    bookingForm.message.value,
    bookingForm.name.isValid,
    bookingForm.name.value,
    bookingForm.phone.isValid,
    bookingForm.phone.value,
    bookingForm.service,
    bookingForm.serviceType,
    bookingForm.studio,
    bookingForm.time,
    isEdit,
  ])

  const handleSaveChanges: MouseEventHandler<HTMLButtonElement> =
    useCallback(async () => {
      if (!appointmentId) return

      const editAppointmentData = {
        studio: bookingForm.studio,
        service: bookingForm.service,
        date: bookingForm.date,
        time: bookingForm.time,
        message: bookingForm.message.value,
      }
      dispatch(setIsLoading(true))
      const result = await editAppointment(
        editAppointmentData,
        appointmentId,
        locale || 'en'
      )
      if (result.message === 'Appointment edited successfully') {
        push('/appointment/rescheduled')
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      appointmentId,
      bookingForm.date,
      bookingForm.message.value,
      bookingForm.service,
      bookingForm.studio,
      bookingForm.time,
      locale,
      push,
    ])

  const handleAskDeleteAppointment: MouseEventHandler<HTMLButtonElement> =
    useCallback(async () => {
      dispatch(setIsModalOpen(true))
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

  const handleDeleteAppointment: MouseEventHandler<HTMLButtonElement> =
    useCallback(async () => {
      if (!appointmentId) return

      dispatch(setIsLoading(true))
      const res = await deleteAppointment(appointmentId)
      if (res.message === 'Appointment deleted successfully') {
        dispatch(clearForm())
        dispatch(setIsModalOpen(false))
        push('/appointment/deleted')
        dispatch(setIsLoading(false))
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appointmentId, push])

  const isFormLoading = useMemo(() => {
    return !!isLoading || !bookingForm.serviceType || !bookingForm.studio
  }, [bookingForm.serviceType, bookingForm.studio, isLoading])

  const isRescheduleFormLoading = useMemo(() => {
    return (
      !!isLoading ||
      !bookingForm.name.value ||
      !bookingForm.phone.value ||
      !bookingForm.email.value ||
      !bookingForm.service ||
      !bookingForm.serviceType ||
      !bookingForm.studio
    )
  }, [
    bookingForm.email.value,
    bookingForm.name.value,
    bookingForm.phone.value,
    bookingForm.service,
    bookingForm.serviceType,
    bookingForm.studio,
    isLoading,
  ])

  return {
    handleChangeName,
    handleChangePhone,
    handleChangeEmail,
    handleSelectServiceType,
    handleSelectService,
    handleSelectStudio,
    handleChangeDate,
    handleChangeTime,
    handleChangeMessage,
    handleChangeAcceptAgreement,
    handleSubmitForm,
    isBookButtonDisable,
    handleSaveChanges,
    handleDeleteAppointment,
    handleAskDeleteAppointment,
    isFormLoading,
    isRescheduleFormLoading,
  }
}

export const useGetFormDataHook = (isEdit: boolean) => {
  const bookingForm = useSelector(
    (state: RootState) => state.bookingForm.bookingData
  )
  const loadedData = useSelector((state: RootState) => state.loadedData)
  const studios = useSelector((state: RootState) => state.loadedData.studios)
  const t = useTranslations()

  const services = useMemo(
    () => getServices(loadedData.services, bookingForm?.serviceType),
    [bookingForm?.serviceType, loadedData.services]
  )
  const formServices: { value: number; label: string }[] = useMemo(
    () =>
      services.map((service) => ({
        value: service.value,
        label: `${t(`services.${service.type}.${service.name}`)} - ${
          service.cost
        }zl - ${service.time}min`,
      })),
    [services, t]
  )
  const formServiceTypes = useMemo(() => {
    const srvcsTypes = getServiceTypes(loadedData.services)

    return srvcsTypes.map((srvcsType) => ({
      value: srvcsType.value,
      label: `${t(`services.${srvcsType.label}.title`)}`,
    }))
  }, [loadedData.services, t])

  const formTimes = useMemo(() => {
    const times = getTimes(bookingForm.date, loadedData.data, isEdit)
    let filteredTimes: string[] = times
    if (!bookingForm.service || !bookingForm.date)
      return ['Please select a service and a date.']

    const choosedServiceDuration = services.find(
      (service) => String(service.value) === bookingForm.service
    )?.time

    if (!!choosedServiceDuration && choosedServiceDuration >= 30) {
      const deletedTimes: string[] = ['19:45']
      loadedData.data.forEach((data) => {
        const date = data.date

        if (date === bookingForm.date) {
          let editedBusyTimes: string[] = data.busyTimes
          if (isEdit) {
            const editedBusyTimeIndex = editedBusyTimes.findIndex(
              (item) => item === bookingForm.time
            )
            editedBusyTimes = [
              ...editedBusyTimes.slice(0, editedBusyTimeIndex),
              ...editedBusyTimes.slice(editedBusyTimeIndex + 2),
            ]
          }

          const busyTimes = isEdit ? editedBusyTimes : data.busyTimes
          const delItems = getDeletedTimes(
            [...busyTimes, '20:00'],
            choosedServiceDuration
          )
          deletedTimes.push(...delItems)
        }
      })

      deletedTimes.forEach((deletedTime) => {
        filteredTimes = filteredTimes.filter((time) => time !== deletedTime)
      })
    }

    return filteredTimes
  }, [
    bookingForm.date,
    bookingForm.service,
    bookingForm.time,
    isEdit,
    loadedData.data,
    services,
  ])

  return {
    studios,
    services: formServices,
    serviceTypes: formServiceTypes,
    times: formTimes,
  }
}
