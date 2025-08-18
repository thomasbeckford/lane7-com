'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const PageClient: React.FC = () => {
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        router.push('/venues')
      }
    }

    // Agregar el event listener
    document.addEventListener('keydown', handleKeyDown)

    // Cleanup: remover el event listener cuando el componente se desmonte
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [router])

  return <React.Fragment />
}

export default PageClient
