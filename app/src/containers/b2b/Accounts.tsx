
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

import './Accounts.less';

interface AccountsState {
  admins: any,
  defaultBillingAddress: any,
  defaultShippingAddress: any,
  recentOrders: any,
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

export default class Accounts extends React.Component<{}, AccountsState> {
  static isLoggedIn(config) {
    return (localStorage.getItem(`${config.cortexApi.scope}_oAuthRole`) === 'REGISTERED');
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: Accounts.isLoggedIn(Config),
      noSearchResults: false,
      showSearchLoader: false,
      defaultBillingAddress: {
        name: 'Inez Larson',
        address: '198 Bendar Knoll',
        city: 'East Nicklaus',
        state: 'Michigan',
        zip: '48002',
        country: 'United States',
      },
      defaultShippingAddress: {
        name: 'Max Wilkerson',
        address: '198 Bendar Knoll',
        city: 'East Nicklaus',
        state: 'Michigan',
        zip: '48002',
        country: 'United States',
      },
      recentOrders: [
        {
          orderId: '170-05-3731',
          date: '03 May 2019',
          shipTo: 'Max Wilkerson',
          orderTotal: '$4628.77',
          status: 'Complete',
        },
        {
          orderId: '170-05-3730',
          date: '01 May 2019',
          shipTo: 'Max Wilkerson',
          orderTotal: '$4308.32',
          status: 'Complete',
        },
        {
          orderId: '170-05-3729',
          date: '27 Apr 2019',
          shipTo: 'Max Wilkerson',
          orderTotal: '$3182.27',
          status: 'Processing',
        },
        {
          orderId: '170-05-3728',
          date: '26 Apr 2019',
          shipTo: 'Christopher Bryan',
          orderTotal: '$2934.03',
          status: 'Processing',
        },
      ],
      accounts: [],
      admins: [],
      quotes: [
        {
          id: '118344715-9',
          requestFrom: 'Accelsmart',
          date: '27-Aug-2019',
          status: 'Accepted',
        },
        {
          id: '664035490-X',
          requestFrom: 'Bluefuse',
          date: '16-Sep-2019',
          status: 'Accepted',
        },
        {
          id: '796998895-4',
          requestFrom: 'Cabana',
          date: '09-Sep-2019',
          status: 'Accepted',
        },
        {
          id: '753193924-X',
          requestFrom: 'Clevermatic',
          date: '10-Sep-2019',
          status: 'Accepted',
        },
        {
          id: '282511554-1',
          requestFrom: 'Forexo',
          date: '11-Mar-2018',
          status: 'Accepted',
        },
      ],
      searchAccounts: '',
    };
    if (Accounts.isLoggedIn(Config)) {
      this.getAdminData();
    }
    this.setSearchAccounts = this.setSearchAccounts.bind(this);
    this.getSearchAccounts = this.getSearchAccounts.bind(this);
    this.handleEnterKeyPress = this.handleEnterKeyPress.bind(this);
  }

  setSearchAccounts(event) {
    this.setState({ searchAccounts: event.target.value });
  }

  getAdminData() {
    login().then(() => {
      adminFetch(`/?zoom=${accountsZoomArray.join()}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`),
        },
      })
        .then(res => res.json())
        .then((res) => {
          if (res && res._accounts) {
            const accounts = res._accounts[0]._element.map((account) => {
              const uri = account.self.uri.split('/').pop();
              return {
                name: account.name,
                externalId: account['external-id'],
                status: account._statusinfo[0]._status[0].status.toLowerCase(),
                uri,
              };
            });
            const map = new Map();
            res._accounts[0]._element.reduce((accum, account) => {
              const associates = account._associateroleassignments[0]._element;
              if (!associates) return accum;

              associates.forEach((associate) => {
                if (associate._roleinfo[0]._roles[0]._element && associate._roleinfo[0]._roles[0]._element[0].name === 'BUYER_ADMIN') {
                  const { name } = associate._associate[0];
                  const { email } = associate._associate[0]._primaryemail[0];
                  map.set(email, { name, email });
                }
              });
              return accum;
            }, []);
            const admins = Array.from(map.values());

            this.setState({
              accounts, admins, isLoading: false, noSearchResults: false,
            });
          }
        });
    });
  }

  getSearchAccounts() {
    const { searchAccounts } = this.state;
    this.setState({ showSearchLoader: true });
    login().then(() => {
      adminFetch('/accounts/am/search/form?followlocation&format=standardlinks,zoom.nodatalinks', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`),
        },
        body: JSON.stringify({ keywords: searchAccounts, page: '1', 'page-size': '10' }),
      })
        .then(data => data.json())
        .then((data) => {
          adminFetch(`${data.self.uri}?zoom=element,element:statusinfo:status`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`),
            },
            body: JSON.stringify({ keywords: searchAccounts, page: '1', 'page-size': '10' }),
          })
            .then(res => res.json())
            .then((res) => {
              adminFetch(`${res.self.uri}?zoom=element,element:statusinfo:status`, {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`),
                },
              })
                .then(searchResult => searchResult.json())
                .then((searchResult) => {
                  if (searchResult && searchResult._element) {
                    const accounts = searchResult._element.map((account) => {
                      const uri = account.self.uri.split('/').pop();
                      return {
                        name: account.name,
                        externalId: account['external-id'],
                        status: account._statusinfo[0]._status[0].status.toLowerCase(),
                        uri,
                      };
                    });
                    this.setState({ accounts, showSearchLoader: false, noSearchResults: false });
                  } else {
                    this.setState({ showSearchLoader: false, noSearchResults: true });
                  }
                })
                .catch((error) => {
                  // eslint-disable-next-line no-console
                  console.error(error.message);
                });
            })
            .catch((error) => {
              // eslint-disable-next-line no-console
              console.error(error.message);
            });
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    });
  }

  handleEnterKeyPress(e) {
    if (e.keyCode === 13) {
      this.getSearchAccounts();
    }
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

  renderAccounts() {
    const { history } = this.props;
    const {
      accounts,
      searchAccounts,
      showSearchLoader,
      noSearchResults,
    } = this.state;

    return (
      <div className="b2b-section accounts">
        <div className="section-header">
          <div className="section-title">{intl.get('accounts')}</div>
          <div className="section-header-right">
            <div className="accounts-search">
              <input type="text" placeholder={intl.get('search')} value={searchAccounts} onKeyDown={this.handleEnterKeyPress} onChange={this.setSearchAccounts} />
              {showSearchLoader && <div className="miniLoader" />}
            </div>
          </div>
        </div>
        <div className="section-content">
          { !noSearchResults ? (
            <table className="b2b-table accounts-table">
              <thead>
                <tr>
                  <th className="name">
                    {intl.get('name')}
                    <span className="mobile-table-title">
                      {' '}
                    &
                      {' '}
                      {intl.get('external-id')}
                    </span>
                  </th>
                  <th className="external-id">{intl.get('external-id')}</th>
                  <th className="status">{intl.get('status')}</th>
                  <th className="arrow" />
                </tr>
              </thead>
              <tbody>
                {accounts.map(account => (
                  <tr key={account.externalId} onClick={() => { history.push(`/b2b/account/${account.uri}`); }} className="account-list-rows">
                    <td className="name">{account.name}</td>
                    <td className="external-id">{account.externalId}</td>
                    <td className="status">
                      <i className={`icons-status ${account.status.toLowerCase()}`} />
                      {intl.get(account.status)}
                    </td>
                    <td className="arrow">
                      <Link to={`/b2b/account/${account.uri}`} className="arrow-btn" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className="no-results">{intl.get('no-results-found')}</p>}
          {!noSearchResults && Accounts.renderPagination()}
        </div>
      </div>
    );
  }

  render() {
    const {
      admins,
      defaultBillingAddress,
      defaultShippingAddress,
      recentOrders,
      isLoading,
      quotes,
    } = this.state;

    return (
      <div className="Accounts-component">
        {!isLoading ? (
          <div>
            { Accounts.isLoggedIn(Config) && this.renderAccounts() }
          </div>
        ) : (
          <div className="loader" />
        )}
      </div>
    );
  }
}
