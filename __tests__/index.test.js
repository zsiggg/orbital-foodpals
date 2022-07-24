import Root from '../pages/index'
import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'

describe('Onboarding', () => {
  it('renders the onboarding page', () => {
    render(<Root />)
    // check if all components are rendered
    expect(screen.getByTestId('logo')).toBeInTheDocument()
    expect(screen.getByTestId('sign-in')).toBeInTheDocument()
    expect(screen.getByTestId('register')).toBeInTheDocument()
  })
})
