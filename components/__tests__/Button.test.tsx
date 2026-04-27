import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi } from 'vitest';
import Button from '../Button';

describe('Button', ()=>{
  it('renders and handles click', ()=>{
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    const btn = screen.getByText('Click');
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalled();
  });
  it('shows loading state', ()=>{
    render(<Button loading>Wait</Button>);
    expect(screen.getByText('Loading…')).toBeInTheDocument();
  });
});
