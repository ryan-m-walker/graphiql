/**
 *  Copyright (c) 2019 GraphQL Contributors.
 *
 *  This source code is licensed under the MIT license found in the
 *  LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import { mount } from 'enzyme';

import { QueryHistory } from '../QueryHistory';
import HistoryQuery from '../HistoryQuery';
import { mockStorage } from './helpers/storage';

const mockBadQuery = `bad {} query`;

const mockQuery = /* GraphQL */ `
  query Test($string: String) {
    test {
      hasArgs(string: $string)
    }
  }
`;

const mockVariables1 = JSON.stringify({ string: 'string' });
const mockVariables2 = JSON.stringify({ string: 'string2' });

const mockOperationName = 'Test';

const baseMockProps = {
  query: mockQuery,
  variables: mockVariables1,
  operationName: mockOperationName,
  queryID: 1,
  onSelectQuery: () => {},
  storage: mockStorage,
};

describe.only('QueryHistory', () => {
  it('will not save invalid queries', () => {
    const W = mount(<QueryHistory {...baseMockProps} />);
    const instance = W.instance();
    instance.updateHistory(mockBadQuery);
    W.update();
    expect(W.find(HistoryQuery).length).toBe(0);
  });

  it('will save if there was not a previously saved query', () => {
    const W = mount(<QueryHistory {...baseMockProps} />);
    const instance = W.instance();
    instance.updateHistory(mockQuery, mockVariables1, mockOperationName);
    W.update();
    expect(W.find(HistoryQuery).length).toBe(1);
  });

  it('will not save a query if the query is the same as previous query', () => {
    const W = mount(<QueryHistory {...baseMockProps} />);
    const instance = W.instance();
    instance.updateHistory(mockQuery, mockVariables1, mockOperationName);
    W.update();
    expect(W.find(HistoryQuery).length).toBe(1);
    instance.updateHistory(mockQuery, mockVariables1, mockOperationName);
    W.update();
    expect(W.find(HistoryQuery).length).toBe(1);
  });

  it('will save query if variables are different ', () => {
    const W = mount(<QueryHistory {...baseMockProps} />);
    const instance = W.instance();
    instance.updateHistory(mockQuery, mockVariables1, mockOperationName);
    W.update();
    expect(W.find(HistoryQuery).length).toBe(1);
    instance.updateHistory(mockQuery, mockVariables2, mockOperationName);
    W.update();
    expect(W.find(HistoryQuery).length).toBe(2);
  });
});
