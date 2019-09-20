
/**
 * Copyright © 2019 Elastic Path Software Inc. All rights reserved.
 *
 * This is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this license. If not, see
 *
 *     https://www.gnu.org/licenses/
 *
 *
 */

import React from 'react';
import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import { adminFetch } from '../../utils/Cortex';
import { login } from '../../utils/AuthService';
import userIcon from '../../images/header-icons/account-icon-blue.svg';
import salesChart from '../../images/b2b-mock/sales.png';
import accountRevenueChart from '../../images/b2b-mock/account-revenue.png';
import imgMissingHorizontal from '../../images/img_missing_horizontal@2x.png';
import Config from '../../ep.config.json';

import './Quotes.less';

interface QuotesState {
  admins: any,
  defaultBillingAddress: any,
  defaultShippingAddress: any,
  recentOrders: any,
  topProducts: any,
  accounts: any,
  quotes: any,
  searchAccounts: string,
  isLoading: boolean,
  showSearchLoader: boolean,
  noSearchResults: boolean,
}

const accountsZoomArray = [
  'accounts',
  'accounts:element',
  'accounts:element:selfsignupinfo',
  'accounts:element:statusinfo',
  'accounts:element:statusinfo:status',
  'accounts:element:subaccounts',
  'accounts:element:subaccounts:accountform',
  'accounts:element:subaccounts:parentaccount',
  'accounts:element:associateroleassignments',
  'accounts:element:associateroleassignments:element',
  'accounts:element:associateroleassignments:element:associateroleassignments',
  'accounts:element:associateroleassignments:element:roleinfo',
  'accounts:element:associateroleassignments:element:roleinfo:roles',
  'accounts:element:associateroleassignments:element:roleinfo:roles:element',
  'accounts:element:associateroleassignments:element:roleinfo:selector',
  'accounts:element:associateroleassignments:element:associate',
  'accounts:element:associateroleassignments:element:associate:primaryemail',
];

export default class Quotes extends React.Component<{}, QuotesState> {
  static isLoggedIn(config) {
    return (localStorage.getItem(`${config.cortexApi.scope}_oAuthRole`) === 'REGISTERED');
  }

  constructor(props) {
    super(props);
    this.state = {
      quotes: [
        {
          id: '118344715-9',
          requestFrom: 'Youtags',
          date: '19-Aug-2019',
          status: 'Accepted',
        },
        {
          id: '664035490-X',
          requestFrom: 'Wikizz',
          date: '31-Oct-2018',
          status: 'Accepted',
        },
        {
          id: '796998895-4',
          requestFrom: 'Agimba',
          date: '05-Dec-2018',
          status: 'In Review',
        },
        {
          id: '753193924-X',
          requestFrom: 'Browsetype',
          date: '09-Sep-2019',
          status: 'Rejected',
        },
        {
          id: '282511554-1',
          requestFrom: 'BlogXS',
          date: '16-Nov-2018',
          status: 'Rejected',
        },
      ],
    };
  }

  static periodRender(title) {
    return (
      <div className="period-select">
        <div className="period-select-button">{title}</div>
      </div>
    );
  }

  static renderPagination() {
    return (
      <div className="pagination-container">
        <div className="b2b-pagination">
          <span className="items-count">{`1-5 ${intl.get('of')} 15`}</span>
          <button type="button" disabled className="padination-previous" />
          <span className="page-count">{`${intl.get('b2b-page')} 1 ${intl.get('of')} 3`}</span>
          <button type="button" className="pagination-next" />
        </div>
        <Link className="b2b-link" href="/b2b">View All</Link>
      </div>
    );
  }

  static renderStockStatus(stock) {
    let status;
    let icon;

    switch (stock) {
      case 'LIMITED':
        status = intl.get('low-stock');
        icon = 'info';
        break;
      case 'OUT_OF_STOCK':
        status = intl.get('out-of-stock');
        icon = 'blocked';
        break;
      default:
        status = intl.get('in-stock');
        icon = 'enabled';
    }
    return (
      <span>
        <i className={`icons-status ${icon}`} />
        {status}
      </span>
    );
  }

  static renderQuotesStatus(status) {
    let icon;

    switch (status) {
      case 'Rejected':
        icon = 'blocked';
        break;
      case 'In Review':
        icon = 'info';
        break;
      default:
        icon = 'enabled';
    }
    return (
      <span>
        <i className={`icons-status ${icon}`} />
        {status}
      </span>
    );
  }

  render() {
    const {
      quotes,
    } = this.state;

    return (
      <div className="Quotes-component">
        <div>
          <div className="b2b-section quotes">
            <div className="section-header">
              <div className="section-title">{intl.get('quotes')}</div>
              <div className="section-header-right">
                <div className="quotes-search">
                  <input type="text" placeholder={intl.get('search')} />
                </div>
              </div>
            </div>
            <div className="section-content">
              <table className="b2b-table quotes-table">
                <thead>
                  <tr>
                    <th className="quote-id">
                      {intl.get('quote-id')}
                      <span className="mobile-table-title">
                        {' '}
                        &
                        {' '}
                        {intl.get('request-from')}
                      </span>
                    </th>
                    <th className="quote-request-from">{intl.get('request-from')}</th>
                    <th className="quote-submitted">
                      {intl.get('submitted')}
                      <span className="mobile-table-title">
                        {' '}
                        &
                        {' '}
                        {intl.get('status')}
                      </span>
                    </th>
                    <th className="quote-status">
                      {intl.get('status')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {quotes
                    .map(quote => (
                      <tr key={quote.id}>
                        <td className="quote-id">
                          <Link className="b2b-link" to="/b2b">{quote.id}</Link>
                        </td>
                        <td className="quote-request-from">{quote.requestFrom}</td>
                        <td className="quote-submitted">{quote.date.replace(/-/g, ' ')}</td>
                        <td className="quote-status">
                          {Quotes.renderQuotesStatus(quote.status)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {Quotes.renderPagination()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
