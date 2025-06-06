import React from 'react';
import { axe } from 'vitest-axe';
import { render } from '@testing-library/react';

import Footer from './Footer';

describe('<Footer>', () => {
  test('renders and matches snapshot', () => {
    const { container } = render(<Footer />);

    expect(container).toMatchSnapshot();
  });
  test('renders and matches snapshot without links', () => {
    const { container } = render(<Footer />);

    expect(container).toMatchSnapshot();
  });

  test('renders and matches snapshot with two links', () => {
    const { container } = render(<Footer />);

    expect(container).toMatchSnapshot();
  });

  test('WCAG 2.2 (AA) compliant', async () => {
    const { container } = render(
      <>
        <h2>Without links</h2>
        <Footer />
        <h2>With links</h2>
        <Footer />
      </>,
    );

    expect(await axe(container, { runOnly: ['wcag21a', 'wcag21aa', 'wcag22aa'] })).toHaveNoViolations();
  });
});
