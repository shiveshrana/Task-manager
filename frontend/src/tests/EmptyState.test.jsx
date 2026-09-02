import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import EmptyState from '../components/EmptyState'

describe('EmptyState', () => {
  it('renders title and description', () => {
    render(<EmptyState title="No projects yet" description="Create one to get started." />)
    expect(screen.getByText('No projects yet')).toBeInTheDocument()
    expect(screen.getByText('Create one to get started.')).toBeInTheDocument()
  })

  it('renders an optional action', () => {
    render(<EmptyState title="Empty" action={<button>Create</button>} />)
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument()
  })
})
