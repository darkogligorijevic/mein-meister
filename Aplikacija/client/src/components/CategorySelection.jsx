import React from 'react'
import { useLocation } from 'react-router-dom'

const CategorySelection = ({onChange}) => {

  const location = useLocation()

  if (location.pathname.startsWith('/create-post/')) {

    return (
      <select onChange={onChange} className='px-4 py-2 border border-gray-200 rounded-md outline-none w-full'>
          <option value='Vodoinstalater'>Vodoinstalater</option>
          <option value='Električar'>Električar</option>
          <option value='Kućni majstor'>Kućni majstor</option>
          <option value='Molerske usluge'>Molerske usluge</option>
          <option value='Fasadne usluge'>Fasadne usluge</option>
          <option value='Gipsani radovi'>Gipsani radovi</option>
          <option value='Demontaže i montaže'>Demontaže i montaže</option>
          <option value='Farbarske usluge'>Farbarske usluge</option>
      </select>
    )
  } else {
    return (
      <select onChange={onChange} className='px-4 py-2 border border-gray-200 rounded-md outline-none'>
          <option value='Vodoinstalater'>Vodoinstalater</option>
          <option value='Elektricar'>Električar</option>
          <option value='Kucni Majstor'>Kućni majstor</option>
          <option value='Molerske usluge'>Molerske usluge</option>
          <option value='Fasadne usluge'>Fasadne usluge</option>
          <option value='Gipsani radovi'>Gipsani radovi</option>
          <option value='Demontaže i montaže'>Demontaže i montaže</option>
          <option value='Farbarske usluge'>Farbarske usluge</option>
      </select>
    )
  }

}

export default CategorySelection