import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import StatusPill from '../components/StatusPill'
import PriorityTag from '../components/PriorityTag'

describe('StatusPill', () => {
  it('renders the human-readable label for a known status', () => {
    render(<StatusPill status="IN_PROGRESS" />)
    expect(screen.getByText('In progress')).toBeInTheDocument()
  })

  it('falls back to the raw status for unknown values', () => {
    render(<StatusPill status="BLOCKED" />)
    expect(screen.getByText('BLOCKED')).toBeInTheDocument()
  })
})

describe('PriorityTag', () => {
  it('renders the priority label', () => {
    render(<PriorityTag priority="HIGH" />)
    expect(screen.getByText('High')).toBeInTheDocument()
  })
})
