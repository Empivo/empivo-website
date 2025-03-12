import AuthContext from '@/context/AuthContext'
import { formCategory } from '@/utils/constants'
import React, { useContext, useEffect, useState } from 'react'
import ErrorMessage from '@/pages/components/ErrorMessage'
import apiPath from '@/utils/pathObj'
import { useRouter } from 'next/router'
import axios from 'axios'

function LastFormComponent ({ length, index, register, errors }) {
  const { currentFormItem } = useContext(AuthContext)
  return (
    <>
      {length === index + 1 &&
        !currentFormItem?.edit &&
        !currentFormItem?.view && (
          <div>
            <label>
              <input type='checkbox' {...register} /> &nbsp; I hereby declared
              that details entered by me are true, updated and the best of my
              knowledge.
              <ErrorMessage message={errors?.checkbox?.message} />
            </label>
          </div>
        )}
    </>
  )
}

const FormComponent = ({
  formCategoryType,
  // setFormEdit,
  // formList,
  formView,
  handleNextButton,
  handlePrevButton
  // formLength,
  // setIndexForm,
  // indexForm,
  // formLists
}) => {
  const [form, setForm] = useState({})
  const { currentFormItem, setCurrentItem, applyJobApi, formLists, formList } =
    useContext(AuthContext)
  const router = useRouter()

  const getFormData = async ids => {
    try {
      let payload = {
        jobID:
          ids?.jobId ||
          JSON.parse(localStorage.getItem('approvedJobs'))?.Job?._id,
        employeeID:
          ids?.employeeId ||
          JSON.parse(localStorage.getItem('approvedJobs'))?.employeeID,
        companyID:
          ids?.companyId ||
          JSON.parse(localStorage.getItem('approvedJobs'))?.companyID,
        formType: ids?.formCategoryType
      }
      const path = apiPath.formDetails
      const result = await axios.get(
        process.env.NEXT_PUBLIC_API_BASE_URL + path,
        {
          params: payload,
          headers: { Authorization: `Bearer ${ids?.token}` }
        }
      )
      let obj = {}
      if (typeof window !== undefined)
        obj = {
          ...currentFormItem,
          ...JSON.parse(localStorage.getItem('currentItem') || '{}')
        }
      setCurrentItem({
        ...obj,
        formCategoryType: ids?.formCategoryType,
        data: result?.data?.results?.content
      })
    } catch (error) {
      console.log('error in get all jobs list==>>>>', error.message)
    }
  }

  useEffect(() => {
    formCategory.filter(el => {
      if (el.formType === formCategoryType) {
        setForm(el)
        document.getElementById('loader').style.display = 'none'
      }
    })
  }, [formCategoryType])

  useEffect(() => {
    applyJobApi()
  }, [])

  useEffect(() => {
    const payload = {
      token: localStorage.getItem('token')
    }
    if (router?.query?.slug) {
      if (router?.query?.type === 'admin') {
        let obj = {}
        if (typeof window !== undefined)
          obj = {
            ...currentFormItem,
            ...JSON.parse(localStorage.getItem('currentItem') || '{}')
          }
        setCurrentItem({
          ...obj,
          formCategoryType: router?.query?.slug,
          data: {}
        })
        return
      }
      if (
        router?.query?.type === 'hr' &&
        router?.query?.jobId &&
        router?.query?.companyId &&
        router?.query?.employeeId
      ) {
        payload.jobId = router?.query?.jobId
        payload.companyId = router?.query?.companyId
        payload.employeeId = router?.query?.employeeId
        payload.formCategoryType = router?.query?.slug
        payload.token = router?.query?.token
      }
      payload.formCategoryType = router?.query?.slug
      getFormData(payload)
    } else if (formCategoryType) {
      payload.formCategoryType = formCategoryType
      getFormData(payload)
    }
  }, [router?.query, currentFormItem?.indexForm])

  useEffect(() => {
    if (typeof window !== undefined) window.scrollTo(0, 0)
  }, [currentFormItem?.indexForm])

  return (
    <div>
      {Object.keys(form).length ? (
        <div>
          <form.formComponent
            formCategoryType={formCategoryType}
            formList={formList}
            formView={formView || currentFormItem?.view}
            indexForm={currentFormItem?.indexForm}
            formLength={currentFormItem?.formLength}
            currentItem={{}}
            isLastForm={{ lastForm: LastFormComponent }}
          />

          {(!currentFormItem.edit &&
            !currentFormItem.view &&
            currentFormItem?.formLength) > 1 && (
            <>
              <div className='text-center form_pagger'>
                {currentFormItem?.indexForm + 1 !== 1 && (
                  <button
                    // disabled={
                    //   formLists?.length !== currentFormItem?.indexForm + 1
                    // }
                    className='btn theme_md_btn text-white'
                    onClick={() => handlePrevButton()}
                    style={{ marginRight: '1rem' }}
                  >
                    {' '}
                    Prev
                    {/* <GrFormNext color='white' /> */}
                  </button>
                )}
                <span className=''>
                  Form {currentFormItem?.indexForm + 1} out of{' '}
                  {currentFormItem?.formLength}
                </span>

                {currentFormItem?.formLength !==
                  currentFormItem?.indexForm + 1 && (
                  <button
                    disabled={
                      (formLists?.fillForms?.length || 0) <
                      currentFormItem?.indexForm + 1
                    }
                    className='btn theme_md_btn text-white'
                    onClick={() => handleNextButton()}
                  >
                    {' '}
                    Next
                    {/* <GrFormNext color='white' /> */}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      ) : (
        ''
        // (document.getElementById('loader').style.display = 'block')
      )}
    </div>
  )
}

export default FormComponent
