import React from 'react';
import '@testing-library/jest-dom'
import { arrayChunk } from './arrayChunk';

test('arrayChunk returns chunks of correct length', () => {
    const testArr = [0,0,0,0,0,0,0,0,0];
    let value = arrayChunk(testArr, 3)[0].length;
    expect(value).toBe(3);
}
)