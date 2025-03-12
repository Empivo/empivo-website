import { apiGet, apiPut } from '@/utils/apiFetch'
import apiPath from '@/utils/pathObj'

const fetchFormList = async (resultPayload, callback) => {
  if (callback) {
    callback(true, true, null)
  }
  try {
    const res = await apiGet(apiPath.formsList, {})
    callback(false, false, res.data.results)
  } catch (error) {
    callback(false, true, null)
    console.log('error:', error)
  }
}

const editForm = async (resultPayload, callback) => {
  if (callback) {
    callback(true, true, null)
  }
  try {
    const res = await apiPut(apiPath.editForms, resultPayload)
    callback(false, false, res.data.results)
  } catch (error) {
    console.log('error:', error)
  }
}

export { fetchFormList, editForm }
