import React from 'react';
import { Button } from '../Button';

export default { title: 'Components/Button' };

export const Primary = () => <Button variant="primary">Primary</Button>;
export const Secondary = () => <Button variant="secondary">Secondary</Button>;
export const Loading = () => <Button variant="primary" loading>Generating…</Button>;
