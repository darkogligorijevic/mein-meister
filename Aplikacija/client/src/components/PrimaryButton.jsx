import React from 'react'
import { Link } from 'react-router-dom'

const PrimaryButton = ({content, link, primaryColor, secondaryColor, onClick, adjustments, state}) => {
  return (
    <Link onClick={onClick} state={state} className={`border border-${primaryColor} text-${primaryColor} px-8 py-2 rounded-md self-start hover:bg-${primaryColor} hover:text-${secondaryColor} hover:scale-105 duration-300 font-black ${adjustments}`} to={link}>{content}</Link>
  )
}

export default PrimaryButton