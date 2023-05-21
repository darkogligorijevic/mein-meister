import React from 'react'
import { Link } from 'react-router-dom'

const PrimaryButton = ({content, link, primaryColor, secondaryColor}) => {
  return (
    <Link className={`border border-${primaryColor} text-${primaryColor} px-8 py-2 rounded-xl self-start hover:bg-${primaryColor} hover:text-${secondaryColor} hover:scale-105 duration-300 font-black`} to={link}>{content}</Link>
  )
}

export default PrimaryButton