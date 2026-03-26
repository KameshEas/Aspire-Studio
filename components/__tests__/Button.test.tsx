import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from '../Button';

describe('Button', ()=>{
  it('renders and handles click', ()=>{
    const onClick = jest.fn();
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
