import React from 'react';
import '@testing-library/jest-dom'
import { getIDfromURI } from './getIDfromURI';

test('Recipe ID is parsed from URI correctly', () => {
    const testURI = "gklmsdksmdp_1234567";
    let value = getIDfromURI(testURI)
    expect(value).toBe('1234567');
}
)