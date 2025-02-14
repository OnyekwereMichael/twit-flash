import React from 'react'

const Loader = () => {
    return (
        <div className="flex justify-center items-center h-screen bg-dark-2">
        <div className="flex text-4xl font-bold  space-x-2">
          <span className="animate-ping text-purple-500">T</span>
          <span className="animate-ping delay-200 bg-dark-3">F</span>
        </div>
      </div>
    )
}

export default Loader
