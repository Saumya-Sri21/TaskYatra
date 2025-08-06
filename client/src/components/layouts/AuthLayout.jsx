import React from 'react'

const AuthLayout = ({children}) => {
  return (
    <div className='flex'>
        <div>
            <h2>TaskYatra</h2>
            {children}
        </div>

        <div>
            
        </div>
      
    </div>
  )
}

export default AuthLayout
